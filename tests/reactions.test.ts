import * as wcrypto from '@trust/webcrypto';
// Storage Mock
function storageMock() {
  const storage = {};

  return {
    setItem: (key, value) => {
      storage[key] = value || '';
    },
    getItem: (key) => {
      return key in storage ? storage[key] : null;
    },
    removeItem: (key) => {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: (i) => {
      const keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}

import {JSDOM} from 'jsdom';
const dom = new JSDOM(`<!doctype html><html><body><div class="parent-element"/></div></body></html>`,
  {url: 'http://testlink.ua'});

// @ts-ignore
dom.localStorage = storageMock();
// @ts-ignore
global.window= dom.window;
// @ts-ignore
global.document = dom.window.document;
// @ts-ignore
window.crypto = wcrypto;
// @ts-ignore
global.localStorage = dom.localStorage;



import {describe, it} from 'mocha';
import {expect, assert} from 'chai';
import Reactions from '../src/ReactionsModule';
import {url} from "inspector";
import doc = Mocha.reporters.doc;


describe('Reactions module', () => {
  describe('Constructor', () => {
    const testData = {
      parent: '.parent-element',
      title: 'Test title',
      reactions: ['👍', '👎', '🤙'],
      id: 'Test id'
    };

    const reactionsWindow = new Reactions(testData);
    testData.parent = 'parent-element';
    const parent = document.getElementsByClassName(testData.parent)[0];
    const wrapper = document.getElementsByClassName(Reactions.CSS.wrapper)[0];
    const title = document.getElementsByClassName(Reactions.CSS.title)[0];




    it('should be an instance of Reactions', () => {
      expect(reactionsWindow).to.be.an.instanceOf(Reactions);
    });

    it('parent element should contain wrapper for module', () => {
      assert.equal(parent.getElementsByClassName(Reactions.CSS.wrapper)[0], wrapper);
    });

    it('wrapper should contain span with title', () => {
      assert.equal(wrapper.getElementsByClassName(Reactions.CSS.title)[0], title);
      assert.equal(title.textContent, testData.title);
    });


  });



});

