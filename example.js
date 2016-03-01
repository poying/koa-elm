'use strict';

const app = require('koa')();
const elm = require('./');

app.use(elm('/build.js', {
  root: __dirname,
  entry: 'test/fixtures/Main.elm',
  stderr: process.stderr,
  stdout: process.stdout,
  watch: app.env === 'development'
}));

app.listen(3000);
