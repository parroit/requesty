/*
 * requesty
 * https://github.com/parroit/requesty
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

var url = require('url');
var Promise = require('bluebird');
var coreRequest = require('./core');
var coreRequestPromised = Promise.promisify(coreRequest); 
var utils = require('./utils');

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
    //console.log(uri)

    if (typeof uri === 'object') {
        uriOptions = uri;
        //console.dir(uri);
    } else {
        uriOptions = {};
        var part = url.parse(uri);
        //console.dir(part);
        uriOptions.scheme = part.protocol || 'http:';
        uriOptions.host = uriOptions.hostname = (part.hostname);
        uriOptions.path = part.path || '/';
        uriOptions.port = part.port || (uriOptions.scheme === 'http:' ? 80 : 443);
        uriOptions.method = this.options.method || 'GET';

    }

    utils.assign(this.options, uriOptions);


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
    this.options = this.options.original;
    delete this.options.original;

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

Request.prototype.build = function() {
    var options = utils.assign({}, this.options);
    return function(body,cb){
        return requesty.new(options).send(body,cb);
    };
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

    this.options.headers = utils.assign(this.options.headers, headers);
    //console.log('headers: ' +JSON.stringify(this.options.headers,null,4));
    return this;
};

Request.prototype.send = function(body, cb) {
    var opt = this.options;
    if (opt.mode !== 'promises' && opt.mode !== 'callbacks'  && opt.mode !== 'streams') {
        throw new Error('Unknown mode ' + opt.mode);
    }

    if (typeof body === 'function') {
        cb = body;
        body = null;
    }
    
    if (body && typeof body === 'object' ) {
        if (body.original){
            delete body.original;    
        }
        
        body = JSON.stringify(body);    
    }
    
    opt.body = body;
    opt.original = this.options;


    
    opt.headers = utils.assign(opt.headers, {});

    if (body) {
        
        this.headers('content-length', Buffer.byteLength(body));
    } else {
        delete this.options.headers['content-length'];
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
        
        var host = opt.host || opt.hostname;
        var path = opt.path;
        this.headers('host', host);

        opt.host = opt.hostname = opt.proxy.hostname;
        opt.path = opt.scheme + '//' + host + opt.path + (opt.query || '');
        //console.log('was host:%s, path:%s -> now is:%s',host,path,opt.path);
        opt.port = opt.proxy.port;

        if (opt.proxy.user) {
            //console.log('setto auth')
            var buff = new Buffer(opt.proxy.user + ':' + opt.proxy.password);
            var auth = 'Basic ' + buff.toString('base64');
            this.headers('proxy-authorization', auth);

        }

        
    }

    //console.dir(this.options)
    
    if (this.options.mode === 'callbacks') {
        return coreRequest(opt, cb);
    }

    if (this.options.mode === 'promises') {
        
        return coreRequestPromised(opt);
        
    }

    if (this.options.mode === 'streams') {
        
        return coreRequest(opt);
        
    }


};



function requesty(uri, method, headers, body) {
    var req = requesty.new()
        .using(uri)
        .method(method || 'GET')
        .headers(headers)
        .send(body);

    return req;
   
}

requesty.new = function(options) {
    return new Request(options);
};

requesty.Request = Request;

module.exports = requesty;
