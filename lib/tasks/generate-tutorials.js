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
const { CATEGORIES } = require('../enums');
const GenerateFiles = require('./generate-files');
const helper = require('jsdoc/util/templateHelper');
const name = require('jsdoc/name');
const Ticket = require('../ticket');

/**
 * Get a tutorial's children recursively.
 *
 * @private
 * @param {module:jsdoc/tutorial.Tutorial} tutorial - The tutorial to use.
 * @return {Array<module:jsdoc/tutorial.Tutorial} The child tutorials.
 */
function getChildTutorials(tutorials) {
    let children = tutorials.children;

    children.forEach(child => {
        children = children.concat(getChildTutorials(child));
    });

    return children;
}

module.exports = class GenerateTutorials extends GenerateFiles {
    run(ctx) {
        this.tickets = [];

        try {
            if (ctx.tutorials) {
                for (const child of getChildTutorials(ctx.tutorials)) {
                    const title = name.stripNamespace(child.title);
                    const data = {
                        pageCategory: CATEGORIES.TUTORIALS,
                        pageTitle: title,
                        pageTitlePrefix: ctx.pageTitlePrefix,
                        header: title,
                        tutorialContent: child.content,
                        tutorialChildren: child.children
                    };
                    const url = helper.tutorialToUrl(child.name);

                    this.tickets.push(new Ticket({
                        data,
                        url,
                        viewName: 'tutorial'
                    }));
                }
            }
        } catch (e) {
            return Promise.reject(e);
        }

        return super.run(ctx);
    }
};
