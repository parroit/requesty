/*window.global_test_results = {
  "passed": 1,
  "failed": 3,
  "total": 4,
  "duration": 4321,
  "tests": [
    {
      "name": "foo test",
      "result": false,
      "message": "sumthin bad",
      "duration": 4000
    },
    {
      "name": "bar test",
      "result": false,
      "message": "failure",
      "duration": 300
    },
    {
      "name": "baz test",
      "result": true,
      "message": "passed",
      "duration": 20
    },
    {
      "name": "qux test",
      "result": false,
      "message": "test bad",
      "duration": 1
    }
  ]
}*/


function SauceReporter(runner) {
    function makeTestResult(test, err) {
        return {
            name: test.fullTitle ? test.fullTitle() : test.toString(),
            result: (typeof err === 'undefined'),
            message: err ? err.message : 'passed',
            duration: 0
        };
    }

    var results = {
        passed: 0,
        failed: 0,
        total: 0,
        duration: 0,
        tests: []
    };

    runner.on('pass', function(test) {
        results.passed++;
        results.total++;
        var result = makeTestResult(test);
        console.log(result);
        results.tests.push(result);


    });

    runner.on('fail', function(test, err) {
        results.failed++;
        results.total++;

        var result = makeTestResult(test, err);
        console.log(result);
        results.tests.push(result);


    });

    runner.on('end', function() {
        window.global_test_results = results;

    });
}
