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

import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

import * as name from '@jsdoc/name';
import { Task } from '@jsdoc/task-runner';
import _ from 'lodash';
import stripJsonComments from 'strip-json-comments';

import { KIND_TO_CATEGORY, OUTPUT_FILE_CATEGORIES } from '../enums.js';
import Template from '../template.js';

function isValidPackage(doclet) {
  return doclet?.kind === 'package' && doclet?.longname !== 'package:undefined';
}

export default class SetContext extends Task {
  constructor(opts) {
    super(opts);
  }

  async func(ctx) {
    try {
      const { env, templateConfig } = ctx;
      const needsOutputFile = {};

      ctx.readme = ctx.config.opts.readme;
      // eslint-disable-next-line require-atomic-updates
      ctx.template = await Template.create(templateConfig, ctx, env);
      ctx.linkManager = ctx.template.linkManager;

      this._findSourceFilePaths(ctx);
      // Claim some special filenames before anything else has a chance to get them.
      this._claimSpecialFilenames(ctx);
      // Then claim filenames for the source files.
      this._claimSourceFilenames(ctx);

      for (const doclet of ctx.docletStore.doclets) {
        this._handleDoclet(doclet, ctx, needsOutputFile);
      }
      await this._registerXrefs(ctx);

      this._addListenersToEvents(ctx);
      this._updateContext(ctx, needsOutputFile);
    } catch (e) {
      return Promise.reject(e);
    }

    return Promise.resolve();
  }

  // If an event has listeners, add the listeners to the event doclet.
  // TODO: Add this info to the context, not the doclets.
  _addListenersToEvents(ctx) {
    const { docletStore } = ctx;

    for (const [eventLongname, listeners] of docletStore.listenersByListensTo) {
      const eventDoclets = docletStore.docletsByLongname.get(eventLongname);
      const listenerLongnames = Array.from(listeners).map((d) => d.longname);

      for (const eventDoclet of eventDoclets) {
        eventDoclet.listeners = (eventDoclet.listeners ?? []).concat(listenerLongnames);
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

  _findSourceFilePaths(ctx) {
    const commonPrefix = ctx.docletStore.commonPathPrefix + '/';
    const longToShort = {};
    let sourcePath;
    const sourcePaths = ctx.docletStore.sourcePaths;

    // If there's only one filepath, then its short path is just its basename.
    if (sourcePaths.length === 1) {
      sourcePath = sourcePaths[0];
      longToShort[sourcePath] = basename(sourcePath);
    } else if (sourcePaths.length) {
      sourcePaths.forEach((filepath) => {
        longToShort[filepath] = filepath
          .replace(commonPrefix, '')
          // Always use forward slashes.
          .replace(/\\/g, '/');
      });
    }

    ctx.sourceFiles = longToShort;
  }

  _handleDoclet(doclet, ctx, needsOutputFile) {
    const category = KIND_TO_CATEGORY[doclet.kind];
    // Remove the variation, if any, from the longname.
    // TODO: Don't strip the variation from the actual doclet here; do it in the template.
    const longname = (doclet.longname = name.stripVariation(doclet.longname));

    if (doclet.kind === 'package' && !ctx.package) {
      ctx.package = isValidPackage(doclet) ? doclet : undefined;

      // The rest of this method isn't relevant to packages.
      return;
    }

    if (longname) {
      // Identify longnames for which we generate an output file.
      if (OUTPUT_FILE_CATEGORIES.includes(category)) {
        needsOutputFile[longname] = doclet;
      }

      ctx.linkManager.registerDoclet(doclet);
    }
  }

  // TODO: support other filetypes? (or just js)
  async _registerXrefs(ctx) {
    let fileData;
    const xrefs = ctx.env.conf.templates.xrefs ?? [];
    const promises = [];

    for (let xref of xrefs) {
      if (_.isObject(xref)) {
        xref = xref.source;
      }
      promises.push(readFile(xref, 'utf8'));
    }

    fileData = await Promise.all(promises);
    for (const file of fileData) {
      const parsedFile = JSON.parse(stripJsonComments(file));

      ctx.linkManager.registerXrefs(parsedFile.xrefs);
    }
  }

  _updateContext(ctx, needsOutputFile) {
    const docletStore = ctx.docletStore;
    const docletsByLongname = {};
    let longnames;

    docletStore.docletsByLongname.forEach((doclets, longname) => {
      docletsByLongname[longname] = Array.from(doclets)[0];
    });
    longnames = Object.keys(docletsByLongname);

    ctx.allLongnamesTree = name.longnamesToTree(longnames, docletsByLongname);
    ctx.destination = ctx.config.opts.destination;
    ctx.needsOutputFile = needsOutputFile;

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
