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
var httpbin = process.env.httpbin || 'http://httpbin.org';

function newApi() {
    var req = requesty.new().usePromises();
    req
        .get()
        .using(httpbin)
        .headers({
            'User-Agent': 'requesty'
        });

    return {
        getJson: req.using({path:'/get'}).build(),

        gzipped: req.using({path:'/gzip'}).build(),

        redirect: req.using({path:'/redirect/1'}).build(),

        notFound: req.using({path:'/status/404'}).build(), 

        status201: req.using({path:'/status/201'}).build(), 

        postJson: req.post().using({path:'/post'}).build(),
    };

}

describe('requesty build an api', function() {
    this.timeout(100000);

    var api = newApi();


    describe('GET https json', function() {
        var response;
        before(function(done) {
            api.getJson().then(function(res) {
                response = res;
                done();
            }).catch(done);

        });

        it('parse json', function() {
            response.data.should.be.an('object');
        });

        it('parse headers', function() {
            response.headers['content-type'].should.be.equal('application/json');
        });
    });

    

    describe('POST http json', function() {
        var response;
        before(function(done) {
            
            api.postJson('Just a test').then(function(res) {
                response = res;
                done();
            }).catch(done);

        });

        it('post request body', function() {
            response.data.data.should.be.equal('Just a test');
        });

    });

    

    describe('GET gzipped data', function() {
        var response;
        before(function(done) {
            
            api.gzipped().then(function(res) {
                response = res;
                done();
            }).catch(done);

        });

        it('return unzipped json data', function() {
            response.data.should.be.an('object');
        });

        it('parse headers', function() {

            response.data.gzipped.should.be.equal(true);
        });
    });


    describe('follow redirects', function() {
        var response;
        before(function(done) {
            
            api.redirect().then(function(res) {
                response = res;
                done();
            }).catch(done);

        });

        it('return json data from redirected page', function() {
            response.data.should.be.an('object');

            response.data.url.should.be.equal(httpbin+'/get');
        });
    });

    describe('GET http  404', function() {
        var error;
         before(function(done) {
            
            api.notFound()
                .return()
                .then(done)
                .catch(function(err) {
                    error = err;
                    done();
                });

        });


        it('reject with error', function() {
            error.should.be.an('object');
        });

        it('error message contains status code and description', function() {
            error.message.should.be.equal('404: Not Found');
        });

        it('error contains status code', function() {
            error.statusCode.should.be.equal(404);
        });

    });


    describe('succeed with status 2**', function() {
        var error;
        var response;
        before(function(done) {
            
            api.status201().then(function(res) {
                response = res;
                done();
            }).catch(done);

        });

        it('fullfill response', function() {

            response.headers['content-type'].should.be.equal('text/html; charset=utf-8');
        });




    });
});
