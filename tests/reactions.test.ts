import { describe, it, before, after } from 'mocha';
import { expect, assert } from 'chai';
import { LocalStorageMock, domMock, deleteMock } from './mock';

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

    (global as any).localStorage = new LocalStorageMock();

    Reactions = require('../src/ReactionsModule').default;

    testData = {
      parent: '.parent-element',
      title: 'Test title',
      reactions: ['👍', '👎', '🤙'],
      id: 'Test id'
    };

    testReactions = new Reactions(testData);

    console.log(testReactions);

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

  describe('reactionClicked', () => {
    function getEmojiHash (emoji) {
      const multiplier = 3;
      let hash = 1;

      for (let i = 0; i < emoji.length; i++) {
        hash += multiplier * hash + emoji.codePointAt(i);
      }
      return hash;
    }

    const fakeChoice = getEmojiHash('👍');

    it('should correctly process firstly picked reaction', () => {

      testReactions.reactionClicked(fakeChoice);

      const emojiCurrent = counter[0].getElementsByClassName(Reactions.CSS.emoji)[0];
      const votesCurrent = counter[0].getElementsByClassName(Reactions.CSS.votes)[0];

      assert.isOk(emojiCurrent.classList.contains(Reactions.CSS.picked));
      assert.isOk(votesCurrent.classList.contains(Reactions.CSS.votesPicked));
    });

    it('should correctly process another reaction', () => {
      const newFakeChoice = getEmojiHash('👎');

      testReactions.reactionClicked(newFakeChoice);

      const lastChoiceEmoji = counter[0].getElementsByClassName(Reactions.CSS.emoji)[0];
      const lastChoiceCounter = counter[0].getElementsByClassName(Reactions.CSS.votes)[0];
      const emojiPicked = counter[1].getElementsByClassName(Reactions.CSS.emoji)[0];
      const votesPicked = counter[1].getElementsByClassName(Reactions.CSS.votes)[0];

      assert.isOk(emojiPicked.classList.contains(Reactions.CSS.picked));
      assert.isOk(votesPicked.classList.contains(Reactions.CSS.votesPicked));

      assert.isNotOk(lastChoiceEmoji.classList.contains(Reactions.CSS.picked));
      assert.isNotOk(lastChoiceCounter.classList.contains(Reactions.CSS.votesPicked));

      assert.equal(document.getElementsByClassName(Reactions.CSS.picked).length, 1);
    });

    it('should correctly process again picked reaction', () => {
      const newFakeChoice = getEmojiHash('👎');
      testReactions.reactionClicked(newFakeChoice);

      const emojiList = counter[1].getElementsByClassName(Reactions.CSS.emoji);
      const votesList = counter[1].getElementsByClassName(Reactions.CSS.votes);

      assert.isNotOk(emojiList[0].classList.contains(Reactions.CSS.picked));
      assert.isNotOk(votesList[0].classList.contains(Reactions.CSS.votesPicked));
    });

    it('should correct save picked reaction in localStorage', () => {
      testReactions.reactionClicked(fakeChoice);

      assert.equal(parseInt(localStorage.getItem(`User:${Reactions.userId}:PickedOn:${String(testReactions.id)}`), 10), fakeChoice);

      testReactions.reactionClicked(fakeChoice);

      assert.isNaN(parseInt(localStorage.getItem(`User:${Reactions.userId}:PickedOn:${String(testReactions.id)}`), 10));
    });
  });
});
