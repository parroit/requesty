/*
 * requesty
 * https://github.com/parroit/requesty
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';
var zlibPath = 'zlib';
var zlib;
var concat;
if (typeof window === 'undefined') {
    zlib = require(zlibPath);
    concat = require('concat-stream');
}


var http = require('http');
var https = require('https');
var url = require('url');
var codes = require('./http_status_codes');
var utils = require('./utils');
var Transform = require('stream').Transform;

function HttpError(message) {
    this.name = 'HttpError';
    this.message = message;
    Error.call(message);
    this.stack = (new Error()).stack;
}
HttpError.prototype = new Error();


function coreRequest(options, cb) {
    var protocol;
    if (options.scheme.indexOf('https') === 0) {
        protocol = https;
        options.scheme = 'https';
    } else {
        protocol = http;
        options.scheme = 'http';
    }

    options.rejectUnauthorized = false;

    var resultStream;

    if (options.mode === 'streams') {
        resultStream = new Transform();
        resultStream._transform = function(chunk, encoding, callback) {

            this.push(chunk);
            callback();

        };

    }

    if (options.auth && options.auth.type === 'basic') {
        var buff;

        if (typeof window === 'undefined') {
            buff = new Buffer(options.auth.user + ':' + options.auth.password).toString('base64');
        } else {
            /* global window */
            buff = window.btoa(options.auth.user + ':' + options.auth.password);
        }

        var auth = 'Basic ' + buff;
        options.headers.Authorization = auth;
    }

    var req = protocol.request(options, function(res) {
        if (res.statusCode === 302) {

            var requesty = require('./requesty');

            var newReq = requesty.new(options).unproxy();
            //console.log('location: %s',res.headers.location);
            newReq.options.path = newReq.options.pathname = res.headers.location;

            newReq.useCallbacks();
            return newReq.send(
                options.body,
                cb
            );
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
            //console.log(res.statusCode + ': ' + codes[res.statusCode]);
            var error = new HttpError(res.statusCode + ': ' + codes[res.statusCode]);
            error.statusCode = res.statusCode;
            return cb(error);
        }

        function serveResponse(output) {
            var result;
            var contentType = (res.headers && res.headers['content-type']) ||
                'text/plain';

            if (/^application\/json/.test(contentType)) {
                result = JSON.parse(output);
            } else {
                result = output;
            }

            cb(null, {
                data: result,
                headers: res.headers
            });

        }

        if (options.mode !== 'streams') {

            var plainStream = res;
            if (zlib && res.headers && res.headers['content-encoding'] === 'gzip') {
                plainStream = res.pipe(zlib.createGunzip());
            } else {
                if (res.setEncoding) {
                    res.setEncoding('utf8');
                }
            }

            if (concat) {
                var concatRes = concat(serveResponse);
                plainStream.pipe(concatRes);
            } else {
                res.on('data', serveResponse);
            }


            

        } else {
            res.pipe(resultStream);
        }





    });

    req.on('error', function(err) {

        cb(err);
    });

    if (options.body) {
        req.write(options.body);
    }

    req.end();


    return resultStream;
}

module.exports = coreRequest;
