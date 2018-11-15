import {describe, it} from 'mocha';
import {expect} from 'chai';
import Identifier from '../src/identifier';
import * as jsdom from 'jsdom';
const {JSDOM} = jsdom;


describe('Identifier class', function () {
  describe('Should create identifier instance with given string id', function () {
    const stringId: string = 'test id';
    const identifier: Identifier = new Identifier(stringId);

    it('should return id string', () => {
      expect(identifier.toJSON()).to.equal(stringId)
    });

    it('should return id string', () => {
      expect(identifier.toString()).to.equal(stringId)
    });
  });

  describe('Should create identifier instance with given number id', function () {
    const numberId: number = 1111;
    const identifier: Identifier = new Identifier(numberId);

    it('should return string representation of Identifier for JSON serializing', () => {
      expect(identifier.toJSON()).to.equal(numberId)
    });

    it('should return string representation of Identifier', () => {
      expect(identifier.toString()).to.equal(numberId)
    });
  });

  describe('Should create identifier instance by url', function () {
    const testUrl = 'http://testurl.com/test';
    const dom = new JSDOM(``, {url: testUrl});
    // @ts-ignore
    global.document = dom.window.document;

    const identifier = new Identifier();

    it('should return string representation of Identifier for JSON serializing', () => {
      expect(identifier.toJSON()).to.equal(testUrl)
    });

    it('should return string representation of Identifier', () => {
      expect(identifier.toString()).to.equal(testUrl)
    });
  })
});