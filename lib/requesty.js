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
    this.options.mode = this.options.mode || 'promises';
}

Request.prototype.useCallbacks = function() {
    this.options.mode = 'callbacks';
    return this;
};

Request.prototype.useStreams = function() {
    this.options.mode = 'streams';
    return this;
};

Request.prototype.usePromises = function() {
    this.options.mode = 'promises';
    return this;
};


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

Request.prototype.method = function(methodName, uri) {
    this.options.method = methodName.toUpperCase();
    if (uri) {
        this.using(uri);
    }
    return this;
};

Request.prototype.unproxy = function() {
    var proxyOptions;
    var opt = this.options;
    opt.host = opt.hostname = opt.headers.host;
    var parts = url.parse(opt.path);
    opt.path = parts.path;
    opt.port = parts.port || 80;
   
    return this;
};
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

Request.prototype.headers = function(name, value) {
    var headers;

    if (typeof name === 'undefined' && typeof value === 'undefined') {
        return this;
    }

    if (typeof name === 'object' && typeof value === 'undefined') {
        
        headers = name;

    } else {

        if (typeof name !== 'string') {
            throw new TypeError('String name expected.');
        }

        if (typeof value !== 'string' && typeof value !== 'number') {
            throw new TypeError('String or number value expected, got ' + value);
        }

        headers = {};

        headers[name] = value;

    }

    this.options.headers = assign(this.options.headers, headers);
    //console.log('headers: ' +JSON.stringify(this.options.headers,null,4));
    return this;
};

Request.prototype.send = function(body, success, failure) {
    if (this.options.mode !== 'promises' && this.options.mode !== 'callbacks') {

        throw new Error('Unknown mode ' + this.options.mode);
    }

    if (typeof body === 'function') {
        failure = success;
        success = body;
        body = null;
    }

    var opt = this.options;
    opt.headers = assign(opt.headers, {});

    if (body) {
        opt.body = body;
        this.headers('content-length', Buffer.byteLength(body));
    }


    if (!opt.proxy && process.env.http_proxy) {
        var proxy = url.parse(process.env.http_proxy);
        

        opt.proxy = {
            user: proxy.auth.split(':')[0],
            password: proxy.auth.split(':')[1],
            hostname: proxy.hostname,
            port: proxy.port
        };
    }


    if (opt.proxy) {
        //console.dir(opt.proxy)
        var host = opt.host || opt.hostname;
        this.headers('host', host);

        opt.host = opt.hostname = opt.proxy.hostname;
        opt.path = opt.scheme + '//' + host + opt.path + (opt.query || '');
        opt.port = opt.proxy.port;

        if (opt.proxy.user) {
            //console.log('setto auth')
            var buff = new Buffer(opt.proxy.user + ':' + opt.proxy.password);
            var auth = 'Basic ' + buff.toString('base64');
            this.headers('authorization', auth);

        }

        
    }

    

    if (this.options.mode === 'callbacks') {
        return coreRequest(opt, success, failure);
    }

    if (this.options.mode === 'promises') {
        return new Promise(coreRequest(opt));
    }


};



function requesty(uri, method, headers, body) {
    var req = requesty.new()
        .using(uri)
        .method(method || 'GET')
        .headers(headers)
        .send(body);

    return req;
    /*
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
    */
}

requesty.new = function(options) {
    return new Request(options);
};

module.exports = requesty;
