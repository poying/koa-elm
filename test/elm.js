'use strict';

const fs = require('fs');
const koa = require('koa');
const path = require('path');
const expect = require('chai').expect;
const request = require('supertest');
const elm = require('../');
const expectContent = fs.readFileSync(path.resolve(__dirname, './fixtures/elm.js'), 'utf8');

describe('koa-elm', () => {
  it('build', done => {
    const app = koa();
    const root = path.join(__dirname, 'fixtures');
    app.use(elm('/build.js', { root }));
    request(app.listen())
      .get('/build.js')
      .expect('Content-Type', 'application/javascript; charset=utf-8')
      .expect(200, expectContent)
      .end(done);
  });
});
