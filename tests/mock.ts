import { JSDOM } from 'jsdom';
import * as wcrypto from '@trust/webcrypto';

// Storage Mock
class LocalStorageMock {
  private store: object;

  constructor () {
    this.store = {};
  }

  clear () {
    this.store = {};
  }

  getItem (key) {
    return this.store[key] || null;
  }

  setItem (key, value) {
    this.store[key] = value.toString();
  }

  removeItem (key) {
    delete this.store[key];
  }
}

function domMock () {
  let dom = new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <div class="parent-element"/></div>
      </body>
    </html>`,
    { url: 'http://test.test' });
// @ts-ignore
  global.window = dom.window;
// @ts-ignore
  global.document = dom.window.document;
// @ts-ignore
  window.crypto = wcrypto;
// @ts-ignore
  global.localStorage = storageMock();

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

export { LocalStorageMock, domMock, deleteMock };
