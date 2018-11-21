import { describe, it, before, after } from 'mocha';
import { expect, assert } from 'chai';
import { domMock, deleteMock } from './mock';
import DOM from '../src/utils/dom';

describe('Reactions module', () => {
  let Reactions;
  let testData;
  let testReactions;

  let parent: Element;
  let wrapper: Element;
  let title: Element;
  let counter: HTMLCollection;
  let emoji: HTMLCollection;
  let votes: HTMLCollection;

  before(() => {
    domMock();

    Reactions = require('../src/ReactionsModule').default;

    testData = {
      parent: '.parent-element',
      title: 'Test title',
      reactions: ['👍', '👎', '🤙'],
      id: 'Test id'
    };

    testReactions = new Reactions(testData);

    testData.parent = 'parent-element';

    parent = document.getElementsByClassName(testData.parent)[0];
    wrapper = document.getElementsByClassName(Reactions.CSS.wrapper)[0];
    title = document.getElementsByClassName(Reactions.CSS.title)[0];
    counter = document.getElementsByClassName(Reactions.CSS.reactionContainer);
    emoji = document.getElementsByClassName(Reactions.CSS.emoji);
    votes = document.getElementsByClassName(Reactions.CSS.votes);
  });

  after(() => {
    deleteMock();
  });

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

    it(`wrapper should contain reactions with emoji and counters`, () => {
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
    });
  });

  describe('DOM.make', () => {
    it('should correctly create elements with multiple classes', () => {
      const testClassList: string[] = ['test1', 'test2', 'test3'];
      const testElement: HTMLElement = DOM.makeElement('div', testClassList);

      console.log(testElement.classList, testClassList);
      assert.equal(testElement.classList.length, testClassList.length);
      for (const i in testClassList) {
        assert.equal(testElement.classList[i], testClassList[i]);
      }
    });
  });

  describe('reactionClicked', () => {
    let testIndex: number = 0;

    it('should correctly process firstly picked reaction', () => {
      testReactions.reactionClicked(testIndex);

      const emojiCurrent = counter[testIndex].getElementsByClassName(Reactions.CSS.emoji)[0];
      const votesCurrent = counter[testIndex].getElementsByClassName(Reactions.CSS.votes)[0];

      assert.isOk(emojiCurrent.classList.contains(Reactions.CSS.picked));
      assert.isOk(votesCurrent.classList.contains(Reactions.CSS.votesPicked));
    });

    it('should correctly process another reaction', () => {
      const testPicked: number = testIndex;

      testIndex += 1;
      testReactions.reactionClicked(testIndex);

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

      const emojiList = counter[testIndex].getElementsByClassName(Reactions.CSS.emoji);
      const votesList = counter[testIndex].getElementsByClassName(Reactions.CSS.votes);

      assert.isNotOk(emojiList[0].classList.contains(Reactions.CSS.picked));
      assert.isNotOk(votesList[0].classList.contains(Reactions.CSS.votesPicked));
    });
  });
});
