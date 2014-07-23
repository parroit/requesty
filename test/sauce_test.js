var MochaSauce = require('mocha-sauce');

// configure
var sauce = new MochaSauce({
    name: 'requesty', // your project name
    username: process.env.SAUCE_USERNAME, // Sauce username
    accessKey: process.env.SAUCE_ACCESS_KEY, // Sauce access key
    host: 'http://ondemand.saucelabs.com', 
    port: 80,

    // the test url
    url: 'http://www.parro.it/requesty/dist/test.html' // point to the site running your mocha tests
});


// setup what browsers to test with
sauce.browser({ browserName: 'chrome', platform: 'Windows 7', version:36 });



sauce.on('init', function(browser) {
  console.log('  init : %s %s', browser.browserName, browser.platform);
});

sauce.on('start', function(browser) {
  console.log('  start : %s %s', browser.browserName, browser.platform);
});

sauce.on('end', function(browser, res) {
  console.log('  end : %s %s : %d failures', browser.browserName, browser.platform, res.failures);
});

sauce.start(function(err){
  
  console.dir(arguments);
});