/*
 * requesty
 * https://github.com/parroit/requesty
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

var concat = [].concat;
var slice = [].slice;

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


module.exports = {
    assign: assign,
    curry: require('chilli')
};
