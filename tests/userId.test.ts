import { after, describe, it } from 'mocha';
import { assert } from 'chai';
import { domMock, deleteMock } from './mock';

describe('setUserId', () => {
  let Reactions;
  let testData;
  let testReactions;
  const testUserId: number = 1111;

  before(() => {
    domMock();

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

    Reactions.setUserId(testUserId);
    testReactions = new Reactions(testData);

    assert.equal(localStorage.getItem('reactionsUserId'), String(testUserId));
  });
});
