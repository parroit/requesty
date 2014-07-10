/*
 * requesty
 * https://github.com/parroit/requesty
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

var Promise = require('promise');
var url = require('url');
var coreRequest = require('./core');

function assign(target, source) {
    var index = -1,
        props = Object.keys(source),
        length = props.length;

    if (!target) {
        target = {};
    }

    while (++index < length) {
        var key = props[index];
        target[key] = source[key];
    }
    return target;
}

function Request(options) {
    this.options = options || {};
}

Request.prototype.auth = function(user, password) {
    var authOptions;
    if (typeof user === 'object' && typeof password === 'undefined') {
        authOptions = user;
        authOptions.type = authOptions.type || 'basic';

    } else {
        authOptions = {
            user: user,
            password: password,
            type: 'basic'
        };
    }

    this.options.auth = authOptions;
    return this;
};

Request.prototype.using = function(uri) {
    var uriOptions;
    if (typeof uri === 'object') {
        uriOptions = uri;
    } else {
        uriOptions = {};
        var part = url.parse(uri);

        uriOptions.scheme = part.protocol || 'http:';
        uriOptions.host = uriOptions.hostname = (part.host || part.hostname);
        uriOptions.path = part.path || '/';
        uriOptions.port = part.port || (uriOptions.scheme === 'http:' ? 80 : 553);
        uriOptions.method = this.options.method || 'GET';

    }

    assign(this.options, uriOptions);


    return this;
};

function buildHttpMethod(methodName) {
    Request.prototype[methodName] = function(uri) {
        this.options.method = methodName.toUpperCase();
        if (uri) {
            this.using(uri);
        }
        return this;
    };
}

[
    'get',
    'post',
    'put',
    'delete',
    'options',
    'head'
].forEach(buildHttpMethod);



Request.prototype.proxy = function(hostname, user, password) {
    var proxyOptions;

    if (
        typeof hostname === 'object' &&
        typeof user === 'undefined' &&
        typeof password === 'undefined'
    ) {

        proxyOptions = hostname;
        proxyOptions.type = proxyOptions.type || 'basic';

        if (!proxyOptions.hostname) {
            throw new Error('hostname must be supplied.');
        }

    } else {

        proxyOptions = {
            hostname: hostname,
            user: user,
            password: password,
            type: 'basic'
        };

    }

    this.options.proxy = proxyOptions;
    return this;
};

Request.prototype.headers = function(name,value){
    var header = {};
    header[name] = value;

    assign(this.options.headers, header);
};

Request.prototype.send = function(body) {
    var opt = this.options;
    assign(opt.headers, {});
    
    if (body) {
        
        this.headers( 'content-length', Buffer.byteLength(body) );
    }

    if (opt.proxy) {
        var host = opt.host || opt.hostname;
        this.headers( 'host', host );

        opt.host = opt.hostname = opt.proxy.hostname;
        opt.path = opt.scheme + host + '/' + opt.path + (opt.query || '');
        
        if (opt.proxy.user) {
            var buff = new Buffer(opt.proxy.user+ ':' +opt.proxy.password);
            var auth = 'Basic ' + buff.toString('base64');
            this.headers( 'authorization', Buffer.byteLength(body) );

        }
        
    }

    return new Promise(coreRequest(opt));
};



function requesty(uri, method, headers, body) {

    uri = url.parse(uri);

    var options = {
        scheme: uri.protocol || 'http',
        hostname: uri.hostname,
        host: uri.hostname,
        port: uri.port || (uri.protocol === 'https:' ? 443 : 80),
        path: uri.pathname + (uri.search || ''),
        method: method,
        uri: uri
    };

    if (body) {
        options.body = body;
        headers = assign(headers, {
            'content-length': Buffer.byteLength(body)
        });
    }

    if (headers) {
        options = assign(options, {
            headers: headers
        });
    }

    return new Promise(coreRequest(options));
}

requesty.new = function(options) {
    return new Request(options);
};

module.exports = requesty;
