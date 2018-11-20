import { JSDOM } from 'jsdom';
import * as wcrypto from '@trust/webcrypto';

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

function domMock () {
  let dom = new JSDOM(`<!doctype html><html><body><div class="parent-element"/></div></body></html>`,
    { url: 'http://test.test' });
// @ts-ignore
  global.window = dom.window;
// @ts-ignore
  global.document = dom.window.document;
// @ts-ignore
  window.crypto = wcrypto;
// @ts-ignore
  global.localStorage = storageMock();

  // localStorage.setItem('reactionsUserId', String(1111));
}

function deleteMock () {
  // @ts-ignore
  delete global.window;
  // @ts-ignore
  delete global.document;
  // @ts-ignore
  delete global.localStorage;
  // @ts-ignore
  delete global.crypto;
}

export { storageMock, domMock, deleteMock };
