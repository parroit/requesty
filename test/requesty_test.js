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
var concat = require('concat-stream');
var requesty = require('../lib/requesty');
var httpbin = process.env.httpbin || 'http://httpbin.org';

describe('requesty', function() {
    this.timeout(10000);

    it('is defined', function() {
        requesty.should.be.an('function');
    });

    describe('return', function() {
       it('promises', function(done) {
            var req = requesty.new();
           

            var getHttpBin = req.get(httpbin+'/html');

            req.send()
                .then(function(res) {
                    
                    res.data.indexOf('Herman Melville - Moby-Dick').should.be.greaterThan(10);
                    done();

                }).then(null, done);
        });


        it('callbacks', function(done) {
            var req = requesty.new();
           

            var getHttpBin = req.get(httpbin+'/html');

            req.useCallbacks().send(
                function success(err,res) {
                    if (err) {
                        return done(err);
                    }
                    res.data.indexOf('Herman Melville - Moby-Dick').should.be.greaterThan(10);
                    done();

                }
            );
            
        });

        it('streams', function(done) {
            var req = requesty.new();
           

            req.get(httpbin+'/html');

            var res = req.useStreams().send();
            res.on('error',done);
            res.setEncoding('utf8');
            res.pipe(concat(function(data){
                data.indexOf('Herman Melville - Moby-Dick').should.be.greaterThan(10);
                done();

            }));
            
            
        });

    });


    describe('new', function() {
        var req = requesty.new({
            its: 'me'
        });
        var reqDefault = requesty.new();

        it('return new Request object', function() {
            (reqDefault instanceof requesty.Request).should.be.equal(true);
        });

        it('accept options object', function() {
            req.options.its.should.be.equal('me');
        });

        it('options created by default', function() {
            reqDefault.options.should.be.a('object');
        });

    });

    describe('serving results', function() {
        var req = requesty.new();

        it('return promises as default', function() {
            req.options.mode.should.equal('promises');
        });

        it('use callback', function() {
            req.useCallbacks();
            req.options.mode.should.equal('callbacks');
        });

         it('use streams', function() {
            req.useStreams();
            req.options.mode.should.equal('streams');
        });

    });

    describe('method', function() {
        var req = requesty.new();

        describe('auth', function() {
            var authResult = req.auth('usern@me', 'p@ssword');
            var withOptions = requesty.new().auth({
                user: 'usern@me',
                password: 'p@ssword'
            });

            it('return req instance for fluid api chain', function() {
                authResult.should.be.equal(req);
            });

            it('save user in options', function() {
                authResult.options.auth.user.should.be.equal('usern@me');
            });

            it('save password in options', function() {
                authResult.options.auth.password.should.be.equal('p@ssword');
            });

            it('has a default type of basic', function() {
                authResult.options.auth.type.should.be.equal('basic');
            });

            describe('with options', function() {

                it('save user in options', function() {
                    withOptions.options.auth.user.should.be.equal('usern@me');
                });

                it('save password in options', function() {
                    withOptions.options.auth.password.should.be.equal('p@ssword');
                });

                it('has a default type of basic', function() {
                    withOptions.options.auth.type.should.be.equal('basic');
                });
            });

        });

        describe('get', function() {
            var getReturn = req.get();

            it('return req instance for fluid api chain', function() {
                getReturn.should.be.equal(req);
            });

            it('same method to options', function() {
                getReturn.options.method.should.be.equal('GET');
            });

        });



        describe('using', function() {
            var usingResult = req.using('http://localhost');
            var withOptions = requesty.new().using({
                scheme: 'https:',
                hostname: 'www.parro.it',
                port: 1000,
                path: '/test'
            });

            it('return req instance for fluid api chain', function() {
                usingResult.should.be.equal(req);
            });

            it('save scheme in options', function() {
                usingResult.options.scheme.should.be.equal('http:');
            });

            it('save hostname in options', function() {
                usingResult.options.hostname.should.be.equal('localhost');
            });

            it('has a default port of 80 for http', function() {
                usingResult.options.port.should.be.equal(80);
            });

            it('has a default path of /', function() {
                usingResult.options.path.should.be.equal('/');
            });

            describe('with options', function() {

                it('save scheme in options', function() {
                    withOptions.options.scheme.should.be.equal('https:');
                });

                it('save hostname in options', function() {
                    withOptions.options.hostname.should.be.equal('www.parro.it');
                });

                it('save port of in options', function() {
                    withOptions.options.port.should.be.equal(1000);
                });

                it('save path in options', function() {
                    withOptions.options.path.should.be.equal('/test');
                });
            });

        });

        describe('proxy', function() {
            var proxyResult = req.proxy('proxy.host-na.me', 'usern@me', 'p@ssword');
            var withOptions = requesty.new().proxy({
                hostname: 'proxy.host-na.me',
                user: 'usern@me',
                password: 'p@ssword'
            });

            it('return req instance for fluid api chain', function() {
                proxyResult.should.be.equal(req);
            });

            it('save user in options', function() {
                proxyResult.options.proxy.user.should.be.equal('usern@me');
            });

            it('save password in options', function() {
                proxyResult.options.proxy.password.should.be.equal('p@ssword');
            });

            it('save hostname in options', function() {
                proxyResult.options.proxy.hostname.should.be.equal('proxy.host-na.me');
            });

            it('has a default type of basic', function() {
                proxyResult.options.proxy.type.should.be.equal('basic');
            });

            describe('with options', function() {

                it('save user in options', function() {
                    withOptions.options.proxy.user.should.be.equal('usern@me');
                });

                it('save password in options', function() {
                    withOptions.options.proxy.password.should.be.equal('p@ssword');
                });

                it('save hostname in options', function() {
                    withOptions.options.proxy.hostname.should.be.equal('proxy.host-na.me');
                });

                it('has a default type of basic', function() {
                    withOptions.options.proxy.type.should.be.equal('basic');
                });
            });

        });

    });

});
