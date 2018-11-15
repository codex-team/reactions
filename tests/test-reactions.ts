import {describe, it} from 'mocha';
import {expect, assert} from 'chai';
import Reactions from '../src/ReactionsModule';
import * as jsdom from 'jsdom';
const {JSDOM} = jsdom;

describe('Reactions module', function () {
  describe('Constructor', function () {
    const dom = new JSDOM(`<!doctype html><html><body><div id="parent-element"/></div></body></html>`);

    // Storage Mock
    function storageMock() {
      var storage = {};

      return {
        setItem: function(key, value) {
          storage[key] = value || '';
        },
        getItem: function(key) {
          return key in storage ? storage[key] : null;
        },
        removeItem: function(key) {
          delete storage[key];
        },
        get length() {
          return Object.keys(storage).length;
        },
        key: function(i) {
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

    const testData = {
      parent: '#parent-element',
      title: 'Test title',
      reactions: ['👍', '👎', '🤙'],
      id: 'Test id'
    };

    const reactionsWindow = new Reactions(testData);

    it('should be an instance of Reactions', () => {
      expect(reactionsWindow).to.be.an.instanceOf('Reactions');
    });

    it('parent element should contain wrapper for module', () => {
      assert.isNotNull(document.querySelector(testData.parent).querySelector(Reactions.CSS.wrapper));
    });

    it('wrapper should contain span with title', () => {
      assert.isNotNull(document.querySelector(Reactions.CSS.wrapper).querySelector(Reactions.CSS.title));
      assert.equal(document.querySelector(Reactions.CSS.wrapper).querySelector(Reactions.CSS.title).textContent,
        testData.title);
    });
  });



});

