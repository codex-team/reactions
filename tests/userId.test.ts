import { after, describe, it } from 'mocha';
import { assert } from 'chai';
import { domMock } from './mock';

describe('setUserId', () => {
  let Reactions;
  let testData;
  let testReactions;

  before(() => {
    domMock();

    localStorage.setItem('reactionsUserId', String(1111));

    Reactions = require('../src/ReactionsModule').default;

    testData = {
      parent: '.parent-element',
      title: 'Test title',
      reactions: ['👍', '👎', '🤙', '👌'],
      id: 'Test id'
    };
    // @ts-ignore
    testReactions = new Reactions(testData);
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

  it('should return id from ls', () => {
    console.log(localStorage.getItem('reactionsUserId'));
    assert.isOk(localStorage.getItem('reactionsUserId'));
  });
});
