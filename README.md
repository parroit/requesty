# requesty
[![Build Status](https://secure.travis-ci.org/parroit/requesty.png?branch=master)](http://travis-ci.org/parroit/requesty)  [![Npm module](https://badge.fury.io/js/requesty.png)](https://npmjs.org/package/requesty) [![Code Climate](https://codeclimate.com/github/parroit/requesty.png)](https://codeclimate.com/github/parroit/requesty)

[![browser support](https://ci.testling.com/parroit/requesty.png)](http://ci.testling.com/parroit/requesty)

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

## Documentation
_(Coming soon)_

## Examples
see test folder for more advanced usage

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.


## License
Copyright (c) 2013 parroit  
Licensed under the MIT license.
