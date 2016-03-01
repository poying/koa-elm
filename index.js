'use strict';

const os = require('os');
const path = require('path');
const watch = require('watch');
const fs = require('fs-promise');
const exec = require('child_process').exec;
const randomstring = require('randomstring');
const debug = require('debug')('koa-elm');
const ELMPATH = path.resolve(__dirname, 'node_modules/.bin/elm-make');

module.exports = function (urlpath, options) {
  options || (options = {});

  const context = {
    root: options.root || process.cwd(),
    entry: options.entry || 'Main.elm',
    out: options.stdout,
    err: options.stderr,
    cache: null
  };

  if (options.watch) {
    autoRebuild(context);
  }

  return function *elm(next) {
    if (this.url !== urlpath) {
      yield* next;
      return;
    }

    this.type = 'js';
    if (context.cache) {
      this.body = context.cache;
    } else {
      this.body = yield build(context);
    }
  };
};

function autoRebuild(context) {
  const pkgpath = path.resolve(context.root, 'elm-package.json');
  const pkg = require(pkgpath);
  const dirs = pkg['source-directories'];
  dirs.forEach(dir => {
    dir = path.resolve(context.root, dir);
    debug(`watch ${dir}`);
    watch.watchTree(dir, () => {
      build(context);
    });
  });
}

function build(context) {
  const dist = getTmpFilePath();
  return elmMake(dist, context)
    .then(() => fs.readFile(dist, 'utf8'))
    .then(content => context.cache = content)
    .then(content => {
      debug(`build ${new Date()}`);
      return content;
    });
};

function elmMake(dist, options) {
  const entry = path.resolve(options.root, options.entry);
  return new Promise((resolve, reject) => {
    const command = [ELMPATH, '--yes', '--output', dist, entry].join(' ');
    const elmMake = exec(command, { cwd: options.root }, err => {
      err ? reject(err) : resolve();
    });
    options.out && elmMake.stdout.pipe(options.out);
    options.err && elmMake.stderr.pipe(options.err);
  });
}

function getTmpFilePath() {
  return path.join(os.tmpdir(), randomstring.generate() + '.js');
}
