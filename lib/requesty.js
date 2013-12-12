var url = require('url'),
    _ = require("lodash"),
    Promise = require('promise'),
    https = require("https"),
    concat = require("concat-stream"),
    codes = require('http-status-codes-json'),
    zlib = require('zlib'),
    http = require("http");

function _uriToOptions(uri, method) {

    uri = url.parse(uri);


    return {
        scheme: uri.protocol || "http",
        hostname: uri.hostname,
        host: uri.hostname,
        port: uri.port || (uri.protocol === "https:" ? 443 : 80),
        path: uri.pathname + (uri.search || ""),
        method: method
    };
}

function concatStream(res,uri,resolve,reject) {

    return concat(function (output) {

        var result;
        var contentType = res.headers["content-type"];
        if (/^application\/json/.test(contentType))
            result = JSON.parse(output);
        else
            result = output;

        if (res.statusCode == 302) {

            var originalUri = url.parse(uri);
            originalUri.pathname = res.headers.location;
            var locationUri = url.format(originalUri);
            //console.log(locationUri)
            requesty(locationUri,"GET").then(resolve,reject);

        } else if (Math.round(res.statusCode / 100) == 2) {

            resolve({
                data: result,
                headers: res.headers
            });

        } else {
            var error = new Error(res.statusCode + ": " + codes[res.statusCode]);
            error.statusCode = res.statusCode;
            reject(error);
        }

    });
}

function requesty(uri, method, headers, body) {


    var options = _uriToOptions(uri, method);
    if (body) {
        headers = _.extend(headers, {"content-length": body.length});
    }

    if (headers) {
        options = _.extend(options, {headers: headers});
    }
    //console.dir(options)
    return new Promise(function (resolve, reject) {
        var protocol;
        if (options.scheme == "http:")
            protocol = http;
        else
            protocol = https;


        var req = protocol.request(options, function (res) {


            if (res.headers["content-encoding"] == "gzip") {
                res.pipe(zlib.createGunzip()).pipe(concatStream(res,uri,resolve,reject));
            } else {
                res.setEncoding && res.setEncoding('utf8');
                res.pipe(concatStream(res,uri,resolve,reject));
            }


        });

        req.on('error', function (err) {
            reject(err);
        });

        if (body) {

            req.write(body);
        }

        req.end();
    });

}

module.exports =requesty;