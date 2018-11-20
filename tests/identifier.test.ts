import {after, before, describe, it} from 'mocha';
import { expect } from 'chai';
import { domMock } from './mock';

describe('Identifier class', () => {
  let Identifier;

  before(function () {
    domMock();

    Identifier = require('../src/identifier').default;
  });

  after(() => {
    // @ts-ignore
    delete global.window;
    // @ts-ignore
    delete global.document;
    // @ts-ignore
    delete global.localStorage;
    // @ts-ignore
    delete global.crypto;
  });

  describe('Should create identifier instance with given string id', () => {
    const stringId: string = 'test id';

    it('toJSON should return id string', () => {
      const testIdentifier = new Identifier(stringId);

      expect(testIdentifier.toJSON()).to.equal(stringId);
    });

    it('toString should return id string', () => {
      const testIdentifier = new Identifier(stringId);

      expect(testIdentifier.toString()).to.equal(stringId);
    });
  });

  describe('Should create identifier instance with given number id', () => {
    const numberId: number = 1111;

    it('should return string representation of Identifier for JSON serializing', () => {
      const testIdentifier = new Identifier(numberId);

      expect(testIdentifier.toJSON()).to.equal(String(numberId));
    });

    it('should return string representation of Identifier', () => {
      const testIdentifier = new Identifier(numberId);

      expect(testIdentifier.toString()).to.equal(String(numberId));
    });
  });

  describe('Should create identifier instance by url', () => {
    it('should return string representation of Identifier for JSON serializing', () => {
      const testIdentifier = new Identifier();

      expect(testIdentifier.toJSON()).to.equal('http://test.test/');
    });

    it('should return string representation of Identifier', () => {
      const testIdentifier = new Identifier();

      expect(testIdentifier.toString()).to.equal('http://test.test/');
    });
  });
});
