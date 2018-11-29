import { describe, it, before, after } from 'mocha';
import { assert } from 'chai';
import { LocalStorageMock } from './mock';
describe('Storage', () => {
  let Storage;
  (<any> global).localStorage = new LocalStorageMock();
  before(() => {
    Storage = require('../src/utils/storage').default;
  });
  describe('getItem',() => {
    localStorage.setItem('5','test');
    it('should correctly return value from localStorage', () => {
      assert.equal(Storage.getItem('5'), 'test');
      assert.equal(Storage.getItem(5), 'test');
    });
    it('should return undefined if key is wrong', () => {
      assert.equal(Storage.getItem('wrong'), undefined);
    });
  });
  describe('setItem',() => {
    it('should correctly set value', () => {
      Storage.setItem(5,3);
      assert.equal(localStorage.getItem('5'), '3');
    });
  });
  describe('getInt',() => {
    localStorage.setItem('test','5');
    it('should correctly return integer from localStorage', () => {
      assert.equal(Storage.getItem('test'), 5);
    });
    it('should return undefined if key or value is wrong', () => {
      assert.equal(Storage.getItem('wrong'), undefined);
      localStorage.setItem('test','test5');
      assert.equal(Storage.getInt('test'), undefined);
    });
  });
});
