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

function curry(fn, thisContext) {
	var arity = fn.length;
	
	function curryCall(/*args...*/){
		var args = slice.call(arguments);
		
		if (args.length == arity) {
			return fn.apply(thisContext, args);
		}

		if (args.length < arity) {
			return function(/*newArgs...*/) {
				
				var allArgs = concat.apply(args,arguments);
				
				return curryCall.apply(null,allArgs);
			};
		}

		throw new Error('Too many arguments supplied.');

	}

	return curryCall;

}

module.exports = {
    assign: assign,
    curry: curry
};
