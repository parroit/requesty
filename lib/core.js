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

function concatStream(res, uri, resolve, reject) {
    return concat(function(output) {
        var result;
        var contentType = (res.headers && res.headers['content-type']) || 'text/plain';
        if (/^application\/json/.test(contentType)) {
            result = JSON.parse(output);
        } else {
            result = output;
        }
        if (res.statusCode === 302) {
            var originalUri = url.parse(uri);
            originalUri.pathname = res.headers.location;
            var locationUri = url.format(originalUri);
            var requesty = require('./requesty');
            requesty(locationUri, 'GET').then(resolve, reject);
        } else if (Math.round(res.statusCode / 100) === 2) {
            resolve({
                data: result,
                headers: res.headers
            });
        } else {
            var error = new Error(res.statusCode + ': ' + codes[res.statusCode]);
            error.statusCode = res.statusCode;
            reject(error);
        }
    });
}

function coreRequest(options) {
    return function(resolve, reject) {
        var protocol;
        if (options.scheme === 'http:') {
            protocol = http;
            options.scheme = 'http';
        } else {
            protocol = https;
            options.scheme = 'https';
        }
        options.rejectUnauthorized = false;
        var req = protocol.request(options, function(res) {
            if (res.headers && res.headers['content-encoding'] === 'gzip') {
                res.pipe(zlib.createGunzip()).pipe(concatStream(res, options.uri, resolve, reject));
            } else {
                if (res.setEncoding) {
                    res.setEncoding('utf8');
                }
                res.pipe(concatStream(res, options.uri, resolve, reject));
            }

            //console.dir( res.headers );
        });
        req.on('error', function(err) {
            reject(err);
        });
        if (options.body) {
            req.write(options.body);
        }
        req.end();
    };
}

module.exports = coreRequest;
