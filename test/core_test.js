/*
 * requesty
 * https://github.com/parroit/requesty
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
var should = chai.should();

var requesty = require('../lib/requesty');


describe('requesty core request', function () {
    this.timeout(10000);

    it('is defined', function () {
        requesty.should.be.an('function');
    });


    describe('GET https json', function () {
        var response;
        before(function (done) {
            var req = requesty(
                'http://httpbin.org/get',
                'GET',
                {
                    'User-Agent': 'requesty'
                }
            );

            req.then(function (res) {
                response = res;
                done();

            }).then(null, done);


        });

        it ('parse json',function(){
   
            response.data.should.be.an('object');
        });

        it ('parse headers',function(){
            //console.dir(response.headers)
            response.headers.server.should.be.equal('gunicorn/18.0');
        });
    });

    describe('GET http json', function () {
        var response;
        before(function (done) {
            var req = requesty(
                'http://httpbin.org/get',
                'GET',
                {
                    'User-Agent': 'requesty'
                }
            );

            req.then(function (res) {
                response = res;
                done();

            }).then(null, function (err) {
                console.log('%s\n%s', err.message, err.stack);
            });


        });

        it ('parse json',function(){
   
            response.data.should.be.an('object');
        });

        it ('parse headers',function(){
            response.headers.server.should.be.equal('gunicorn/18.0');
        });
    });

    describe('POST http json', function () {
        var response;
        before(function (done) {
            var req = requesty(
                'http://httpbin.org/post',
                'POST',
                {},
                'Just a test'
            );

            req.then(function (res) {
                response = res;
                done();

            }).then(null, done);


        });

        it ('post request body',function(){
            response.data.data.should.be.equal('Just a test');
        });

    });

    describe('POST http unicode', function () {
        var response;
        before(function (done) {
            var req = requesty(
                'http://httpbin.org/post',
                'POST',
                {},
                'Just a €'
            );

            req.then(function (res) {
                response = res;
                done();

            }).then(null, done);


        });

        it ('post request body',function(){
            response.data.data.should.be.equal('Just a €');
        });


    });

    describe('GET gzipped data', function () {
        var response;
        before(function (done) {
            var req = requesty(
                'http://httpbin.org/gzip'
            );

            req.then(function (res) {
                response = res;
                done();

            }).then(null, done);


        });

        it ('return unzipped json data',function(){
            response.data.should.be.an('object');
        });

        it ('parse headers',function(){

            response.data.gzipped.should.be.equal(true);
        });
    });


    describe('follow redirects', function () {
        var response;
        before(function (done) {
            var req = requesty(
                'http://httpbin.org/redirect/1'
            );

            req.then(function (res) {
                response = res;
                done();

            }).then(null, done);


        });

        it ('return json data from redirected page',function(){
            response.data.should.be.an('object');

            response.data.url.should.be.equal('http://httpbin.org/get');
        });
    });

    describe('GET http  404', function () {
        var error;
        before(function (done) {
            var req = requesty(
                'http://httpbin.org/status/404',
                'GET'
            );

            req.then(function () {
                done();

            }).then(null, function (err) {
                error = err;

                done();
            });


        });

        it ('reject with error',function(){
            error.should.be.an('object');
        });

        it ('error message contains status code and description',function(){
            error.message.should.be.equal('404: Not Found');
        });

        it ('error contains status code',function(){
            error.statusCode.should.be.equal(404);
        });

    });

    describe('GET http 500', function () {
        var error;
        before(function (done) {
            var req = requesty(
                'http://httpbin.org/status/500',
                'GET'
            );

            req.then(function () {
                done();

            }).then(null, function (err) {
                    error = err;

                    done();
                });


        });

        it ('reject with error',function(){
            error.should.be.an('object');
        });

        it ('error message contains status code and description',function(){
            error.message.should.be.equal('500: Internal Server Error');
        });

        it ('error contains status code',function(){
            error.statusCode.should.be.equal(500);
        });

    });

    describe('succeed with status 2**', function () {
        var error;
        var response;
        before(function (done) {
            var req = requesty('http://httpbin.org/status/201');

            req.then(function (res) {
                response = res;
                done();

            }).then(null, function (err) {
                    error = err;

                    done();
                });


        });
        it ('error is not raised',function(){
            should.equal(error,undefined);
        });
        it ('fullfill response',function(){

            response.headers['content-type'].should.be.equal('text/html; charset=utf-8');
        });




    });
});
