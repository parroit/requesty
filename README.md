# requesty
[![Build Status](https://secure.travis-ci.org/parroit/requesty.png?branch=master)](http://travis-ci.org/parroit/requesty)  [![Npm module](https://badge.fury.io/js/requesty.png)](https://npmjs.org/package/requesty) [![Code Climate](https://codeclimate.com/github/parroit/requesty.png)](https://codeclimate.com/github/parroit/requesty)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/parroit-requesty.svg)](https://saucelabs.com/u/parroit-requesty)

promise based http and https requests, in node and in browser

## Getting Started
Install the module with: `npm install requesty --save`

```javascript
var requesty = require('requesty');

requesty('http://httpbin.org/html').then(function (res) {

    expect(res.data.indexOf("Herman Melville - Moby-Dick")).to.be.greaterThan(10);

}).then(null, function (err) {

    console.log("%s\n%s", err.message, err.stack);

});
```

## Other stuff

* documentation - maybe I will add documentation if you ask it. open an issue for this.
* support - open an issue [here](https://github.com/parroit/requesty/issues).

## License
[MIT](http://opensource.org/licenses/MIT) © 2014, Andrea Parodi