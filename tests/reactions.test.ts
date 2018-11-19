import * as wcrypto from '@trust/webcrypto';
import { JSDOM } from 'jsdom';
import { describe, it, before, after } from 'mocha';
import { expect, assert } from 'chai';

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

let dom = new JSDOM(`<!doctype html><html><body><div class="parent-element"/></div></body></html>`, { url: 'http://test.test' });
// @ts-ignore
global.window = dom.window;
// @ts-ignore
global.document = dom.window.document;
// @ts-ignore
window.crypto = wcrypto;
// @ts-ignore
global.localStorage = storageMock();

import Reactions from '../src/ReactionsModule';

describe('Reactions module', () => {
  // before(() => {});

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

  // const testUserId: string = '1111';
  // localStorage.setItem('reactionsUserId', testUserId);

  const testData = {
    parent: '.parent-element',
    title: 'Test title',
    reactions: ['👍', '👎', '🤙'],
    id: 'Test id'
  };

  let testReactions = new Reactions(testData);
  testData.parent = 'parent-element';
  const parent: Element = document.getElementsByClassName(testData.parent)[0];
  const wrapper: Element = document.getElementsByClassName(Reactions.CSS.wrapper)[0];
  const title: Element = document.getElementsByClassName(Reactions.CSS.title)[0];
  const counter: HTMLCollection = document.getElementsByClassName(Reactions.CSS.reactionContainer);
  const emoji: HTMLCollection = document.getElementsByClassName(Reactions.CSS.emoji);
  const votes: HTMLCollection = document.getElementsByClassName(Reactions.CSS.votes);

  describe('Constructor', () => {

    it('should create an instance of Reactions', () => {
      expect(testReactions).to.be.an.instanceOf(Reactions);
    });

    it('should throw an error if parent is undefined', () => {
      const wrongData = {
        parent: '.wrong-parent-element',
        title: 'Test title',
        reactions: ['👍', '👎', '🤙'],
        id: 'Test id'
      };

      const wrongReactions = function () { new Reactions(wrongData); };
      expect(wrongReactions).to.throw(Error, 'Parent element is not found');
    });

    it('parent element should contain wrapper for module', () => {
      assert.equal(parent.getElementsByClassName(Reactions.CSS.wrapper)[0], wrapper);
    });

    it('wrapper should contain span with title', () => {
      assert.equal(wrapper.getElementsByClassName(Reactions.CSS.title)[0], title);
      assert.equal(title.textContent, testData.title);
    });

    it(`wrapper should contain ${testData.reactions.length} reactions with emoji and counters`, () => {
      testData.reactions.forEach((item: string, i: number) => {

        assert.equal(counter[i].getElementsByClassName(Reactions.CSS.votes)[0], votes[i]);
        assert.equal(wrapper.getElementsByClassName(Reactions.CSS.reactionContainer)[i], counter[i]);
        assert.equal(counter[i].getElementsByClassName(Reactions.CSS.emoji)[0], emoji[i]);
      });
    });
  });

  describe('Check UserId', () => {
    it('should set random id', () => {
      assert.isOk(localStorage.getItem('reactionsUserId'));
      console.log(localStorage.getItem('reactionsUserId'));
    });
  });

  describe('reactionClicked', () => {
    let testIndex: number = 0;
    testReactions.reactionClicked(testIndex);

    it('should correctly process firstly picked reaction', () => {

      const emojiCurrent = counter[testIndex].getElementsByClassName(Reactions.CSS.emoji)[0];
      const votesCurrent = counter[testIndex].getElementsByClassName(Reactions.CSS.votes)[0];

      assert.isOk(emojiCurrent.classList.contains(Reactions.CSS.picked));
      assert.isOk(votesCurrent.classList.contains(Reactions.CSS.votesPicked));
    });

    it('should correctly process another reaction', () => {
      const testPicked: number = 0;
      testIndex = 1;
      testReactions.reactionClicked(1);

      const emojiCurrent = counter[testIndex].getElementsByClassName(Reactions.CSS.emoji)[0];
      const votesCurrent = counter[testIndex].getElementsByClassName(Reactions.CSS.votes)[0];
      const emojiPicked = counter[testPicked].getElementsByClassName(Reactions.CSS.emoji)[0];
      const votesPicked = counter[testPicked].getElementsByClassName(Reactions.CSS.votes)[0];

      assert.isNotOk(emojiPicked.classList.contains(Reactions.CSS.picked));
      assert.isNotOk(votesPicked.classList.contains(Reactions.CSS.votesPicked));

      assert.isOk(emojiCurrent.classList.contains(Reactions.CSS.picked));
      assert.isOk(votesCurrent.classList.contains(Reactions.CSS.votesPicked));

      assert.equal(document.getElementsByClassName(Reactions.CSS.picked).length, 1);

    });

    it('should correctly process again picked reaction', () => {
      testReactions.reactionClicked(testIndex);

      console.log(document.getElementsByClassName(Reactions.CSS.picked).length);

      const emojiList = counter[testIndex].getElementsByClassName(Reactions.CSS.emoji);
      const votesList = counter[testIndex].getElementsByClassName(Reactions.CSS.votes);

      assert.isNotOk(emojiList[0].classList.contains(Reactions.CSS.picked));
      assert.isNotOk(votesList[0].classList.contains(Reactions.CSS.votesPicked));
    });

  });
});
