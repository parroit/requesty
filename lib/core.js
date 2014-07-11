/*
 * requesty
 * https://github.com/parroit/requesty
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';
var zlib = require('zlib');
var http = require('http');
var https = require('https');
var concat = require('concat-stream');
var url = require('url');
var codes = require('./http_status_codes');
var utils = require('./utils');
var through2 = require('through2');

function concatStream(res, resolve, reject) {
    return concat(function(output) {
        var result;
        var contentType = (res.headers && res.headers['content-type']) ||
            'text/plain';

        if (/^application\/json/.test(contentType)) {
            result = JSON.parse(output);
        } else {
            result = output;
        }

        resolve({
            data: result,
            headers: res.headers
        });

    });
}

function coreRequest(options, resolve, reject) {
    var protocol;

    if (options.scheme.indexOf('http') === 0) {
        protocol = http;
        options.scheme = 'http';
    } else {
        protocol = https;
        options.scheme = 'https';
    }

    options.rejectUnauthorized = false;

    var resultStream;

    if (options.mode === 'streams') {
        resultStream = through2(function(chunk, enc, callback) {

            this.push(chunk);
            callback();

        });
    
    }
    
    var req = protocol.request(options, function(res) {
        console.log(res.statusCode);
        if (res.statusCode === 302) {

            var requesty = require('./requesty');
            
            var newReq = requesty.new(options).unproxy();
            //console.log('location: %s',res.headers.location);
            newReq.options.path = newReq.options.pathname = res.headers.location;

            newReq.useCallbacks();
            return newReq.send(
                options.body,
                resolve,
                reject
            );
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {

            var error = new Error(res.statusCode + ': ' + codes[res.statusCode]);
            error.statusCode = res.statusCode;
            return reject(error);
        }

        

        if (options.mode !== 'streams') {
            
            var plainStream = res;
            if (res.headers && res.headers['content-encoding'] === 'gzip') {
                plainStream = res.pipe(zlib.createGunzip());
            } else {
                if (res.setEncoding) {
                    res.setEncoding('utf8');
                }
            }
            
            var concatRes = concatStream(res, resolve, reject);
            plainStream.pipe(concatRes);
            
        }





    });

    req.on('error', function(err) {
        
        reject(err);
    });

    if (options.body) {
        req.write(options.body);
    }

    req.end();


    return resultStream;
}

module.exports = utils.curry(coreRequest);
