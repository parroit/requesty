'use strict';

var expect = require("expect.js");
var requesty = require("../lib/requesty");


describe("requesty", function () {
    it("is defined", function () {
        expect(requesty).to.be.an('function');
    });

    describe("GET https json", function () {
        var response;
        before(function (done) {
            var req = requesty(
                'https://api.github.com/users/octocat/orgs',
                "GET",
                {
                    'User-Agent': 'requesty'
                }
            );

            req.then(function (res) {
                response = res;
                done();

            }).then(null, function (err) {
                console.log("%s\n%s", err.message, err.stack);
            });


        });

        it ("parse json",function(){
            expect(response.data).to.be.an('array');
        });

        it ("parse headers",function(){

            expect(response.headers["x-ratelimit-limit"]).to.be.equal('60');
        });
    });

    describe("POST http json", function () {
        var response;
        before(function (done) {
            var req = requesty(
                'http://httpbin.org/post',
                "POST",
                {},
                "Just a test"
            );

            req.then(function (res) {
                response = res;
                done();

            }).then(null, function (err) {
                    console.log("%s\n%s", err.message, err.stack);
                });


        });

        it ("post request body",function(){
            expect(response.data.data).to.be.equal("Just a test");
        });


    });



    describe("GET http html", function () {
        var response;
        before(function (done) {
            var req = requesty(
                'http://httpbin.org/'
            );

            req.then(function (res) {
                response = res;
                done();

            }).then(null, function (err) {
                console.log("%s\n%s", err.message, err.stack);
            });


        });

        it ("return html as string",function(){
            expect(response.data).to.be.an('string');
        });

        it ("parse headers",function(){

            expect(response.data.length).to.be.greaterThan(7600);
        });
    });


    describe("GET https 404", function () {
        var error;
        before(function (done) {
            var req = requesty(
                'https://github.com/olalalalal',
                "GET"
            );

            req.then(function (res) {
                done();

            }).then(null, function (err) {
                error = err;

                done();
            });


        });

        it ("reject with error",function(){
            expect(error).to.be.an('object');
        });

        it ("error message contains status code and description",function(){
            expect(error.message).to.be.equal('404: Not Found');
        });

        it ("error contains status code",function(){
            expect(error.statusCode).to.be.equal(404);
        });

    });


});
