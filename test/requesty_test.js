'use strict';

var expect = require("expect.js");
var requesty = require("../lib/requesty");


describe("requesty", function () {
    it("is defined", function () {
        expect(requesty).to.be.an('object');
    });
});
