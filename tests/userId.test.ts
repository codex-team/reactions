import { after, describe, it } from 'mocha';
import { assert } from 'chai';
import { domMock, deleteMock } from './mock';

describe('setUserId', () => {
  let Reactions;
  let testData;
  let testReactions;

  before(() => {
    domMock();

    localStorage.setItem('reactionsUserId', String(1111));

    Reactions = require('../src/ReactionsModule').default;
  });

  after(() => {
    deleteMock();
  });

  it('should return id from ls', () => {
    testData = {
      parent: '.parent-element',
      title: 'Test title',
      reactions: ['👍', '👎', '🤙', '👌'],
      id: 'Test id'
    };

    // @ts-ignore
    testReactions = new Reactions(testData);

    console.log(localStorage.getItem('reactionsUserId'));
    assert.isOk(localStorage.getItem('reactionsUserId'));
  });
});
