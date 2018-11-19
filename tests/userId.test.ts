import * as wcrypto from '@trust/webcrypto';
import { JSDOM } from 'jsdom';
import { describe, it } from 'mocha';
import { assert } from 'chai';

// Storage Mock
function storageMock () {
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
    get length () {
      return Object.keys(storage).length;
    },
    key: (i) => {
      const keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}

const dom = new JSDOM(`<!doctype html><html><body><div class="test-parent"/></div></body></html>`,
  { url: 'http://testlink.ru' });

// @ts-ignore
global.window = dom.window;
// @ts-ignore
global.document = dom.window.document;
// @ts-ignore
dom.localStorage = storageMock();
// @ts-ignore
window.crypto = wcrypto;
// @ts-ignore
global.localStorage = dom.localStorage;

localStorage.setItem('reactionsUserId', '1111');

import Reactions from '../src/ReactionsModule';

describe('setUserId', () => {

  after(() => {
    // @ts-ignore
    delete global.window;
    // @ts-ignore
    delete global.document;
    // @ts-ignore
    delete global.localStorage;
  });

  const testData = {
    parent: '.test-parent',
    title: 'Test title',
    reactions: ['👍', '👎', '🤙'],
    id: 'Test id'
  };

  it('should return id from ls', () => {
    const testReactions = new Reactions(testData);

    console.log(testReactions);
    console.log(localStorage.getItem('reactionsUserId'));
    assert.isOk(localStorage.getItem('reactionsUserId'));
  });

});
