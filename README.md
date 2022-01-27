# get-npm-package

## install

```shell

$ npm install get-npm-package -D

$ yarn add get-npm-package -D

```

```js
/**
 * Download `package` to `dest` and opts.
 *
 * @param {String} packageName
 * @param {String} dest
 * @param {Object} opts
 */

const download = require('get-npm-package')

download('@tangxiaomi/cli@1.1.1', './src')

// or

download('@tangxiaomi/cli', './src')

```