"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var identifier_1 = require("../src/identifier");
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
mocha_1.describe('Identifier class', function () {
    mocha_1.describe('Should create identifier instance with given string id', function () {
        var stringId = 'test id';
        var identifier = new identifier_1.default(stringId);
        mocha_1.it('should return id string', function () {
            chai_1.expect(identifier.toJSON()).to.equal(stringId);
        });
        mocha_1.it('should return id string', function () {
            chai_1.expect(identifier.toString()).to.equal(stringId);
        });
    });
    mocha_1.describe('Should create identifier instance with given number id', function () {
        var numberId = 1111;
        var identifier = new identifier_1.default(numberId);
        mocha_1.it('should return string representation of Identifier for JSON serializing', function () {
            chai_1.expect(identifier.toJSON()).to.equal(numberId);
        });
        mocha_1.it('should return string representation of Identifier', function () {
            chai_1.expect(identifier.toString()).to.equal(numberId);
        });
    });
    mocha_1.describe('Should create identifier instance by url', function () {
        var testUrl = 'http://testurl.com/test';
        var dom = new JSDOM("", { url: testUrl });
        // @ts-ignore
        global.document = dom.window.document;
        var identifier = new identifier_1.default();
        mocha_1.it('should return string representation of Identifier for JSON serializing', function () {
            chai_1.expect(identifier.toJSON()).to.equal(testUrl);
        });
        mocha_1.it('should return string representation of Identifier', function () {
            chai_1.expect(identifier.toString()).to.equal(testUrl);
        });
    });
});
//# sourceMappingURL=test-identifier.js.map