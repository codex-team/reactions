import * as wcrypto from '@trust/webcrypto';
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

import { JSDOM } from 'jsdom';
const dom = new JSDOM(`<!doctype html><html><body><div class="parent-element"/></div></body></html>`,
  { url: 'http://testlink.ua' });

// @ts-ignore
dom.localStorage = storageMock();
// @ts-ignore
global.window = dom.window;
// @ts-ignore
global.document = dom.window.document;
// @ts-ignore
window.crypto = wcrypto;
// @ts-ignore
global.localStorage = dom.localStorage;

import { describe, it } from 'mocha';
import { expect, assert } from 'chai';

const testUserId: number = 1111;
localStorage.setItem('reactionsUserId', String(testUserId));

import Reactions from '../src/ReactionsModule';

const testData = {
  parent: '.parent-element',
  title: 'Test title',
  reactions: ['👍', '👎', '🤙'],
  id: 'Test id'
};
const testReactions = new Reactions(testData);
testData.parent = 'parent-element';
const parent: Element = document.getElementsByClassName(testData.parent)[0];
const wrapper: Element = document.getElementsByClassName(Reactions.CSS.wrapper)[0];
const title: Element = document.getElementsByClassName(Reactions.CSS.title)[0];
const counter: HTMLCollection = document.getElementsByClassName(Reactions.CSS.reactionContainer);
const emoji: HTMLCollection = document.getElementsByClassName(Reactions.CSS.emoji);
const votes: HTMLCollection = document.getElementsByClassName(Reactions.CSS.votes);

describe('Reactions module', () => {

  describe('Constructor', () => {

    it('should create an instance of Reactions', () => {
      expect(testReactions).to.be.an.instanceOf(Reactions);
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

  describe('setUserId', () => {
    it('should set used id', () => {
      assert.equal(localStorage.getItem('reactionsUserId'), String(testUserId));
    });
  });

  describe('reactionClicked', () => {
    let testIndex: number = 0;

    it('should correctly process firstly picked reaction', () => {
      testReactions.reactionClicked(testIndex);

      assert.isOk(counter[testIndex].getElementsByClassName(Reactions.CSS.emoji)[0].classList
        .contains(Reactions.CSS.picked));
      assert.isOk(counter[testIndex].getElementsByClassName(Reactions.CSS.votes)[0].classList
        .contains(Reactions.CSS.votesPicked));
    });

    it('should correctly process another reaction', () => {
      const testPicked: number = 0;
      testIndex = 1;
      testReactions.reactionClicked(testIndex);

      assert.isNotOk(counter[testPicked].getElementsByClassName(Reactions.CSS.emoji)[0].classList
        .contains(Reactions.CSS.picked));
      assert.isNotOk(counter[testPicked].getElementsByClassName(Reactions.CSS.votes)[0].classList
        .contains(Reactions.CSS.votesPicked));

      assert.isOk(counter[testIndex].getElementsByClassName(Reactions.CSS.emoji)[0].classList
        .contains(Reactions.CSS.picked));
      assert.isOk(counter[testIndex].getElementsByClassName(Reactions.CSS.votes)[0].classList
        .contains(Reactions.CSS.votesPicked));

      assert.equal(document.getElementsByClassName(Reactions.CSS.picked).length, 1);

    });

    it('should correctly process again picked reaction', () => {
      testReactions.reactionClicked(testIndex);

      assert.isNotOk(counter[testIndex].getElementsByClassName(Reactions.CSS.emoji)[0].classList
        .contains(Reactions.CSS.picked));
      assert.isNotOk(counter[testIndex].getElementsByClassName(Reactions.CSS.votes)[0].classList
        .contains(Reactions.CSS.votesPicked));
    });

  });
});
