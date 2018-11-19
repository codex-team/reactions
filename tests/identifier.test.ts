import { describe, it } from 'mocha';
import { expect } from 'chai';
import Identifier from '../src/identifier';
import { JSDOM } from 'jsdom';

describe('Identifier class', () => {

  after(() => {
    // @ts-ignore
    delete global.window;
    // @ts-ignore
    delete global.document;
    // @ts-ignore
  });

  describe('Should create identifier instance with given string id', () => {
    const stringId: string = 'test id';
    const identifier: Identifier = new Identifier(stringId);

    it('toJSON should return id string', () => {
      expect(identifier.toJSON()).to.equal(stringId);
    });

    it('toString should return id string', () => {
      expect(identifier.toString()).to.equal(stringId);
    });
  });

  describe('Should create identifier instance with given number id', () => {
    const numberId: number = 1111;
    const identifier: Identifier = new Identifier(numberId);

    it('should return string representation of Identifier for JSON serializing', () => {
      expect(identifier.toJSON()).to.equal(String(numberId));
    });

    it('should return string representation of Identifier', () => {
      expect(identifier.toString()).to.equal(String(numberId));
    });
  });

  describe('Should create identifier instance by url', () => {
    const testUrl = 'http://testurl.com/test';
    const dom = new JSDOM(``, { url: testUrl });
    // @ts-ignore
    global.document = dom.window.document;

    const identifier = new Identifier();

    it('should return string representation of Identifier for JSON serializing', () => {
      expect(identifier.toJSON()).to.equal(testUrl);
    });

    it('should return string representation of Identifier', () => {
      expect(identifier.toString()).to.equal(testUrl);
    });
  });
});
