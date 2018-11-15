"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var ReactionsModule_1 = require("../src/ReactionsModule");
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
mocha_1.describe('Reactions module', function () {
    mocha_1.describe('Constructor', function () {
        var dom = new JSDOM("<!doctype html><html><body><div id=\"parent-element\"/></div></body></html>");
        // Storage Mock
        function storageMock() {
            var storage = {};
            return {
                setItem: function (key, value) {
                    storage[key] = value || '';
                },
                getItem: function (key) {
                    return key in storage ? storage[key] : null;
                },
                removeItem: function (key) {
                    delete storage[key];
                },
                get length() {
                    return Object.keys(storage).length;
                },
                key: function (i) {
                    var keys = Object.keys(storage);
                    return keys[i] || null;
                }
            };
        }
        // @ts-ignore
        global.window = dom.window;
        // @ts-ignore
        dom.window.localStorage = storageMock();
        // @ts-ignore
        global.window.localStorage = dom.window.localStorage;
        // window.localStorage = storageMock();
        var testData = {
            parent: '#parent-element',
            title: 'Test title',
            reactions: ['👍', '👎', '🤙'],
            id: 'Test id'
        };
        var reactionsWindow = new ReactionsModule_1.default(testData);
        mocha_1.it('should be an instance of Reactions', function () {
            chai_1.expect(reactionsWindow).to.be.an.instanceOf('Reactions');
        });
        mocha_1.it('parent element should contain wrapper for module', function () {
            chai_1.assert.isNotNull(document.querySelector(testData.parent).querySelector(ReactionsModule_1.default.CSS.wrapper));
        });
        mocha_1.it('wrapper should contain span with title', function () {
            chai_1.assert.isNotNull(document.querySelector(ReactionsModule_1.default.CSS.wrapper).querySelector(ReactionsModule_1.default.CSS.title));
            chai_1.assert.equal(document.querySelector(ReactionsModule_1.default.CSS.wrapper).querySelector(ReactionsModule_1.default.CSS.title).textContent, testData.title);
        });
    });
});
//# sourceMappingURL=test-reactions.js.map