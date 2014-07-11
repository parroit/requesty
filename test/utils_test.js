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

var utils = require('../lib/utils');

describe('utils', function() {
    
    it('is defined', function() {
        utils.should.be.an('object');
    });

    describe('assign', function() {
    	var target1 = {a:'a'};
    	var target2 = {a:'a',b:'c'};
	    var results1 = utils.assign(target1,{b:'b'});
	    var results2 = utils.assign(target2,{b:'b'});

	    it('is defined', function() {
	        utils.assign.should.be.an('function');
	    });

	    it('return target', function() {
	    	results1.should.be.equal(target1);
	    });

	    it('add source props to target', function() {
	    	results1.b.should.be.equal('b');
	    });

	    it('overwrite target props', function() {
	    	results2.b.should.be.equal('b');
	    });

	});


	describe('curry', function() {
    	var sum = utils.curry(function(a,b){
    		return a+b;
    	});

    	var sum3 = sum(3);
    	var result = sum3(5);


	    it('is defined', function() {
	        utils.curry.should.be.an('function');
	    });

	    it('return result when all args supplied', function() {
	        result.should.be.equal(8);
	    });

	    it('return partial applyed fn when not all args supplied', function() {
	        sum3.should.be.a('function');
	    });

	});


});