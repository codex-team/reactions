import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import { LocalStorageMock, domMock } from './mock';

describe('Storage', () => {
  let Storage;


  before(() => {
    (global as any).localStorage = new LocalStorageMock();
    // domMock();
    Storage = require('../src/utils/storage').default;
  });

  describe('getItem',() => {
    before(() => {
      localStorage.setItem('5','test');
    });

    it('should correctly return value from localStorage', () => {
      assert.equal(Storage.getItem('5'), 'test');
      assert.equal(Storage.getItem(5), 'test');
    });

    it('should return undefined if key is wrong', () => {
      assert.equal(Storage.getItem('wrong'), undefined);
    });
  });

  describe('setItem',() => {

    before(() => {
      Storage.setItem(5,3);
    });

    it('should correctly set value', () => {
      assert.equal(localStorage.getItem('5'), '3');
    });
  });

  describe('getInt',() => {

    before(() => {
      localStorage.setItem('test0','5');
      localStorage.setItem('test1','test5');
    });

    it('should correctly return integer from localStorage', () => {
      assert.equal(Storage.getItem('test0'), 5);
    });

    it('should return undefined if key or value is wrong', () => {
      assert.equal(Storage.getItem('wrong'), undefined);
      assert.equal(Storage.getInt('test1'), undefined);
    });
  });

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      Storage.setItem('test_key', 'test_value');
      assert.equal(Storage.getItem('test_key'), 'test_value');

      Storage.removeItem('test_key');
      assert.isUndefined(Storage.getItem('test_value'));
    })
  })
});
