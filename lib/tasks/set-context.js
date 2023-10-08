/*
  Copyright 2014 the Baseline Authors.

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

import { name } from '@jsdoc/core';
import { Task } from '@jsdoc/task-runner';

import { CATEGORIES, KIND_TO_CATEGORY, OUTPUT_FILE_CATEGORIES } from '../enums.js';
import Template from '../template.js';

function isValidPackage(doclet) {
  return doclet && doclet.kind === 'package' && doclet.longname !== 'package:undefined';
}

export default class SetContext extends Task {
  constructor(opts) {
    super(opts);

    this.func = async (ctx) => {
      try {
        const { dependencies, templateConfig } = ctx;
        const workspace = {
          allDocletsByLongname: {},
          allLongnames: [],
          events: {},
          listeners: {},
          needsOutputFile: {},
        };

        ctx.readme = ctx.config.opts.readme;
        // eslint-disable-next-line require-atomic-updates
        ctx.template = await Template.create(templateConfig, ctx, dependencies);
        ctx.linkManager = ctx.template.linkManager;

        // Claim some special filenames before anything else has a chance to get them.
        this._claimSpecialFilenames(ctx);
        // Then claim filenames for the source files.
        this._claimSourceFilenames(ctx);

        for (const doclet of ctx.docletStore.doclets) {
          this._handleDoclet(doclet, ctx, workspace);
        }

        this._addListenersToEvents(workspace);
        this._updateContext(ctx, workspace);
      } catch (e) {
        return Promise.reject(e);
      }

      return Promise.resolve();
    };
  }

  // If an event has listeners, add the listeners to the event doclet.
  // TODO: Add this info to the context, not the doclets.
  _addListenersToEvents({ events, listeners }) {
    for (const key of Object.keys(events)) {
      let docletsToUpdate;

      if (Object.hasOwn(listeners, key)) {
        docletsToUpdate = events[key];
        for (const d of docletsToUpdate) {
          d.listeners = (d.listeners || []).concat(listeners[key]);
        }
      }
    }
  }

  _claimSourceFilenames(ctx) {
    if (ctx.sourceFiles) {
      for (const filename of Object.values(ctx.sourceFiles)) {
        ctx.linkManager.requestFilename(filename);
      }
    }
  }

  _claimSpecialFilenames(ctx) {
    ctx.linkManager.requestFilename('index');
    ctx.linkManager.requestFilename('global');
  }

  _handleDoclet(doclet, ctx, workspace) {
    const { allDocletsByLongname, allLongnames, events, listeners, needsOutputFile } = workspace;
    const category = KIND_TO_CATEGORY[doclet.kind];
    // Remove the variation, if any, from the longname.
    // TODO: Don't strip the variation from the actual doclet here; do it in the template.
    const longname = (doclet.longname = name.stripVariation(doclet.longname));

    if (doclet.kind === 'package' && !ctx.package) {
      ctx.package = isValidPackage(doclet) ? doclet : undefined;

      // The rest of this method isn't relevant to packages.
      return;
    }

    // Track events.
    if (category === CATEGORIES.EVENTS) {
      events[longname] = events[longname] || [];
      events[longname].push(doclet);
    }

    // Track which events, if any, this symbol listens to.
    if (doclet.listens && doclet.listens.length) {
      for (const listensTo of doclet.listens) {
        listeners[listensTo] = listeners[listensTo] || [];
        listeners[listensTo].push(longname);
      }
    }

    if (longname) {
      // Add the longname to the list if necessary.
      if (!allLongnames.includes(longname)) {
        allLongnames.push(longname);
      }

      // Track the doclet by its longname.
      allDocletsByLongname[longname] = doclet;

      // Identify longnames for which we generate an output file.
      if (OUTPUT_FILE_CATEGORIES.includes(category)) {
        needsOutputFile[longname] = doclet;
      }

      ctx.linkManager.registerDoclet(doclet);
    }
  }

  _updateContext(ctx, workspace) {
    ctx.allLongnames = workspace.allLongnames;
    ctx.allLongnamesTree = name.longnamesToTree(
      workspace.allLongnames,
      workspace.allDocletsByLongname
    );
    ctx.destination = ctx.config.opts.destination;
    ctx.navTree = name.longnamesToTree(
      Object.keys(workspace.needsOutputFile),
      workspace.needsOutputFile
    );
    ctx.needsOutputFile = workspace.needsOutputFile;

    if (!ctx.package || !ctx.package.name) {
      ctx.pageTitlePrefix = '';
    } else {
      ctx.pageTitlePrefix = ctx.template.translate('pageTitlePrefix', {
        name: ctx.package.name,
        version: ctx.package.version || '',
      });
    }
  }
}
