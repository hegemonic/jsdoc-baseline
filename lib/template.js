/*
    Copyright 2014-2019 Google LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
/** @module lib/template */

const _ = require('lodash');
const beautify = require('js-beautify').html;
const config = require('./config');
const deepExtend = require('deep-extend');
const fileFinder = require('./filefinder');
const fs = require('jsdoc/fs');
const handlebars = require('handlebars');
const handlebarsLayouts = require('handlebars-layouts');
const MessageFormat = require('messageformat');
const logger = require('jsdoc/util/logger');
const path = require('jsdoc/path');
const yaml = require('js-yaml');

const finders = {};

// Maximum file size that we'll try to beautify.
const MAX_BEAUTIFY_SIZE = 1024 * 128;

function loadYaml(filepath) {
    let parsedObject;

    try {
        if (filepath) {
            parsedObject = yaml.load(fs.readFileSync(filepath, 'utf8'));
        }
    } catch (e) {
        logger.fatal('Unable to load the file %s: %s', filepath, e);
    }

    return parsedObject;
}

function basenameWithoutExtension(filepath) {
    const basename = path.basename(filepath);

    return basename.replace(path.extname(basename), '');
}

/**
 * Log a message about the template. Maps JSDoc's built-in logger to Handlebars' logger.
 *
 * @param {string} level - The logging level. May contain one of `DEBUG`, `INFO`, `WARN`, `ERROR`,
 * or `FATAL`.
 * @private
 */
function log(level, message) {
    let logMethod = level.toLowerCase();

    if (!logger[logMethod]) {
        logMethod = 'info';
    }

    logger[logMethod](message);
}

module.exports = class Template {
    constructor(conf) {
        finders.cssClassMap = fileFinder.get('cssClassMap', conf.cssClassMap);
        finders.l10n = fileFinder.get('l10n', conf.l10n);
        finders.module = fileFinder.get('modules', conf.modules);
        finders.views = {};

        this.config = conf;
        this.cssClasses = config.readJsonSync(finders.cssClassMap.findFileSync('classmap.json'));
        this.encoding = this.config.encoding;
        this.locale = this.config.locale;
        this.ids = {};
        this._l10nData = null;
        this._l10nFormatter = null;
        this.loader = null;
        this.path = this.config.templatePath;
        // set by the publish job
        this.urls = {
            global: null,
            index: null
        };
        this.views = {};
    }

    /**
     * Initialize the template by configuring its dependencies and loading resource files.
     *
     * @returns {this}
     */
    init() {
        this._handlebarsInit()
            ._l10nInit();

        logger.debug('Initialized the template in %s with config: %j', this.path, this.config);

        return this;
    }

    /**
     * Set up Handlebars to use the appropriate views, helper functions, and translation strings.
     *
     * @private
     * @returns {this}
     */
    _handlebarsInit() {
        let helpers = this.config.helpers;
        const self = this;

        function addInternalHelpers(modulePath) {
            const helperModule = require(path.resolve(self.path, modulePath));
            const instance = helperModule(self);

            Object.keys(instance).forEach(key => {
                handlebars.registerHelper(key, instance[key]);
            });
        }

        if (!Array.isArray(helpers)) {
            helpers = [helpers];
        }

        // add external helpers
        handlebarsLayouts.register(handlebars);

        // add Baseline helpers
        helpers.forEach(addInternalHelpers, this);

        handlebars.log = log;

        this._loadViews();

        return this;
    }

    /**
     * Load, compile, and register the Handlebars views, including layouts and partials.
     *
     * @returns {this}
     */
    _loadViews() {
        let layouts = [];
        let partials = [];

        // load the view loader
        this.loader = finders.module.require('loader');

        this.config.views.layouts.forEach(filepath => {
            layouts = layouts.concat(fs.ls(path.resolve(this.path, filepath), 0));
        });
        this._addLayouts(layouts);

        // load the partials (handlebars-layouts requires that we also load the layouts as partials)
        this.config.views.partials.forEach(filepath => {
            partials = partials.concat(fs.ls(path.resolve(this.path, filepath), 0));
        });
        this._addPartials(partials.concat(layouts));

        return this;
    }

    /**
     * Load the string resources and formatters used for localization.
     *
     * @private
     * @returns {this}
     */
    _l10nInit() {
        const l10nData = [];
        let l10nFiles;

        try {
            l10nFiles = finders.l10n.findAllFilesSync(this.config.l10nFile);
        } catch (e) {
            logger.fatal(`Unable to find the localization data file ${this.config.l10nFile}`);

            return this;
        }

        l10nFiles.forEach(filepath => {
            l10nData.push(loadYaml(filepath));
        });

        // Merge the objects in reverse order so that the first one loaded wins.
        this._l10nData = deepExtend.apply(deepExtend, l10nData.reverse());
        this._l10nFormatter = new MessageFormat(this.locale).compile(this._l10nData);

        return this;
    }

    /**
     * Add layouts to the template.
     *
     * @private
     * @param {Array.<string>} layouts - The paths to the layouts.
     * @returns {this}
     */
    _addLayouts(layouts) {
        layouts.forEach(layout => {
            const name = basenameWithoutExtension(layout);

            logger.debug('Adding the layout "%s"', name);

            this._loadAndCompileLayout(name, layout);
        });

        return this;
    }

    /**
     * Add partials to the template. Partials are views that can be embedded within other views.
     *
     * @private
     * @param {(Array.<string>|Object)} partials - The paths to the partials, or an object containing
     * the partials.
     * @returns {this}
     */
    _addPartials(partials) {
        let partialsObject;

        if (!Array.isArray(partials)) {
            partialsObject = partials;
        } else {
            partialsObject = {};

            partials.forEach(partial => {
                const name = basenameWithoutExtension(partial);

                partialsObject[name] = this._loadAndCompilePartial(name, partial);
            });
        }

        logger.debug('Adding all partials to Handlebars');
        handlebars.registerPartial(partialsObject);
    }

    // Load and compile the layout. We can't lazily load these, because Handlebars doesn't allow you
    // to provide a custom loader.
    _loadAndCompileLayout(layoutName, filepath) {
        let templateString;

        // skip this layout if we've already compiled a view with the same name
        if (!{}.hasOwnProperty.call(this.views, layoutName)) {
            templateString = this.loader.loadSync(filepath, 'utf8');
            this.views[layoutName] = handlebars.compile(templateString);
        }
    }

    // Load and compile the partial. We can't lazily load these, because Handlebars doesn't allow
    // you to provide a custom loader.
    _loadAndCompilePartial(partialName, filepath) {
        let templateString;
        let view;

        // Skip this partial if we've already compiled a view with the same name.
        if ({}.hasOwnProperty.call(this.views, partialName)) {
            view = this.views[partialName];
        } else {
            templateString = this.loader.loadSync(filepath, 'utf8');

            view = this.views[partialName] = handlebars.compile(templateString);
        }

        return view;
    }

    render(viewName, data, options) {
        let beautifyOptions;
        const i18nData = {
            locales: this.config.locale
        };
        let rendered;

        if (!{}.hasOwnProperty.call(this.views, viewName)) {
            logger.fatal('The view "%s" is unknown. Cannot render output.', viewName);

            return '';
        }

        options = options || {};

        data.intl = i18nData;
        rendered = this.views[viewName](data);

        if (options.beautify !== false) {
            /* eslint-disable camelcase */
            beautifyOptions = {
                indent_size: 2,
                // js-beautify ignores the value 0 because it's falsy
                max_preserve_newlines: 0.1
            };
            /* eslint-enable camelcase */

            if (rendered.length < MAX_BEAUTIFY_SIZE) {
                rendered = beautify(rendered, beautifyOptions);
            }
        }

        return rendered;
    }

    translate(key, opts) {
        const formatter = _.get(this._l10nFormatter, key);
        let options;
        let translation;

        if (!formatter) {
            logger.warn('Unable to find a localized string for the key %s', key);

            return '';
        }

        if (typeof opts === 'number') {
            options = {
                items: opts
            };
        } else {
            options = opts || {};
            if (typeof options.items === 'undefined') {
                options.items = 1;
            }
        }

        translation = formatter(options);

        // Remove the trailing newline, if present.
        return translation.replace(/\n$/, '');
    }
};
