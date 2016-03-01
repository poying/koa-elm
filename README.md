koa-elm [![npm](https://img.shields.io/npm/dm/koa-elm.svg)](http://npmjs.org/koa-elm)
=======

```javascript
const elm = require('koa-elm');
const app = koa();

app.use(elm('/build.js', options));
```

### Options

```javascript
{
  root: <String>, // default: process.cwd()
  entry: <String>, // default: 'Main.elm'
  stdout: <Stream>, // default: undefined
  stderr: <Stream>, // default: indefined
  watch: <Boolean> // default: false
}
```

## License

(The MIT License)

Copyright (c) 2014 Po-Ying Chen &lt;poying.me@gmail.com&gt;.
