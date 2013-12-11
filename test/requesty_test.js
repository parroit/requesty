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

    describe("GET gzipped data", function () {
        var response;
        before(function (done) {
            var req = requesty(
                'http://httpbin.org/gzip'
            );

            req.then(function (res) {
                response = res;
                done();

            }).then(null, function (err) {
                    console.log("%s\n%s", err.message, err.stack);
                });


        });

        it ("return unzipped json data",function(){
            expect(response.data).to.be.an('object');
        });

        it ("parse headers",function(){

            expect(response.data.gzipped).to.be.equal(true);
        });
    });


    describe("follow redirects", function () {
        var response;
        before(function (done) {
            var req = requesty(
                'http://httpbin.org/redirect/1'
            );

            req.then(function (res) {
                response = res;
                done();

            }).then(null, function (err) {
                    console.log("%s\n%s", err.message, err.stack);
                });


        });

        it ("return json data from redirected page",function(){
            expect(response.data).to.be.an('object');

            expect(response.data.url).to.be.equal("http://httpbin.org/get");
        });
    });


    describe("method defaults to GET", function () {


        it ("return html as string",function(done){
            var req = requesty('http://httpbin.org/html');

            req.then(function (res) {

                expect(res.data.indexOf("Herman Melville - Moby-Dick")).to.be.greaterThan(10);
                done();

            }).then(null, function (err) {
                console.log("%s\n%s", err.message, err.stack);
            });
        });


    });


    describe("GET https 404", function () {
        var error;
        before(function (done) {
            var req = requesty(
                'https://httpbin.org/status/404',
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

    describe("GET https 500", function () {
        var error;
        before(function (done) {
            var req = requesty(
                'https://httpbin.org/status/500',
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
            expect(error.message).to.be.equal('500: Internal Server Error');
        });

        it ("error contains status code",function(){
            expect(error.statusCode).to.be.equal(500);
        });

    });


});
