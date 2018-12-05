import Socket from './socket/index';
import Identifier from './identifier';
import DOM from './utils/dom';
import Common from './utils/common';
import Storage from './utils/storage';

/**
 * Type of style holder
 */
interface Styles {
  [key: string]: string;
}

/**
 * Type of update options
 */
interface UpdateOptions {
  /** Number of picked reaction */
  votedReactionId: number;

  /** Values of votes */
  reactions?: {[key: string]: number};
}

/**
 * Type of input data
 */
interface ReactionsConfig {
  /** Selector of root element */
  parent: string;

  /** Array of emoji symbols */
  reactions: string[];

  /** Title text */
  title: string;

  /** Id for module */
  id?: string | number;
}

/**
 * @class Reactions
 * @classdesc Representing a reactions
 */
export default class Reactions {
  /**
   *  User id for save user reaction
   */
  public static userId: number | string = Storage.getItem('reactionsUserId') || Common.getRandomValue();

  /**
   * Class for connection
   */
  private static socket: Socket = new Socket(process.env.serverURL);

  /**
   * Returns style name
   */
  public static get CSS (): Styles {
    return {
      emoji: 'reactions__counter-emoji',
      picked: 'reactions__counter-emoji--picked',
      reactionContainer: 'reactions__counter',
      title: 'reactions__title',
      votes: 'reactions__counter-votes',
      votesPicked: 'reactions__counter-votes--picked',
      wrapper: 'reactions'
    };
  }

  /**
   * Set userId
   * @param {number} userId
   */
  public static setUserId (userId: number) {
    Reactions.userId = userId;
  }

  /**
   * Array of number of reactions votes
   */
  public lastReactionsVotes: {[key: string]: number};

  /**
   * Module identifier
   */
  public id: Identifier;

  /**
   * Number of picked element
   */
  private _picked: number;

  /**
   * Array of counters elements
   */
  private reactions /*: Array<{ counter: HTMLElement; emoji: HTMLElement }>*/ = {};

  /**
   * Elements holder
   */
  private wrap: HTMLElement;

  /**
   * Create a reactions module.
   * @param {object} data - object containing emojis, title and parent element.
   * @param {string} data.parent - element where module is inserted.
   * @param {string[]} data.reactions - list of emojis.
   * @param {string} data.title - title.
   * @param {string | number} data.id - module identifier.
   * @throws Will throw an error if parent element is not found.
   */
  public constructor (data: ReactionsConfig) {
    this.id = new Identifier(data.id);

    /** Connect with server */
    Reactions.socket.send({
      'type' : 'initialization',
      'moduleId': this.id,
      'userId': Reactions.userId
    });

    this.wrap = DOM.make('div', Reactions.CSS.wrapper);
    const parent: HTMLElement = document.querySelector(data.parent);

    const pollTitle: HTMLElement = DOM.make('span', Reactions.CSS.title, { textContent: data.title });

    this.wrap.append(pollTitle);

    data.reactions.forEach((item: string, i: number) => {
      this.reactions[item.codePointAt(0)] = this.addReaction(item, item.codePointAt(0));
    });

    if (Storage.getInt(`User${Reactions.userId}PickedOn${String(this.id)}`)) {
      this.update({
        votedReactionId: Storage.getInt(`User${Reactions.userId}PickedOn${String(this.id)}`),
        userId: Reactions.userId
      });
    }
    /** Get picked reaction */
    Reactions.socket.socket.on('update', (msg: any): void => {
      if (msg.moduleId === this.id) {
        return;
      }

      if (msg.type === 'vote' || msg.type === 'unvote') {
        this.update(msg);
      }
    });

    if (parent) {
      parent.append(this.wrap);
    } else {
      throw new Error('Parent element is not found');
    }

    /** Set user id on close page */
    Storage.setItem('reactionsUserId', Reactions.userId);
  }

  /**
   * Create and insert reactions button
   * @param {string} item - emoji from data.reactions array.
   * @param {string} code - code of emoji and reactions object key.
   * @returns {object} containing pair of emoji element and it's counter
   */
  public addReaction (item: any, code: number): { counter: HTMLElement; emoji: HTMLElement } {
    const reactionContainer: HTMLElement = DOM.make('div', Reactions.CSS.reactionContainer);
    const emoji: HTMLElement = DOM.make('div', Reactions.CSS.emoji, {
      textContent: item
    });

    emoji.addEventListener('click', (click: Event) => this.reactionClicked(code));

    const counter: HTMLElement = DOM.make('span', Reactions.CSS.votes, { textContent: 0 });

    reactionContainer.append(emoji);
    reactionContainer.append(counter);
    this.wrap.append(reactionContainer);

    return { emoji, counter };
  }

  /**
   * Processing click on emoji
   * @param {number} code - code of emoji and reactions object key.
   */
  public reactionClicked (code: number): void {
    this.update({ userId: Reactions.userId, votedReactionId: code });

    this.saveValue(code, this.picked !== undefined);
  }

  /**
   * Increase counter
   * @param {string} code - code of voted emoji and reactions object key.
   */
  public vote (code: number): void {
    const votes: number = +this.reactions[code].counter.textContent + 1;

    this.reactions[code].counter.textContent = String(votes);
  }

  /**
   * Decrease counter
   * @param {string} code - code of unvoted reaction.
   */
  public unvote (code: number): void {
    const votes: number = +this.reactions[code].counter.textContent - 1;

    this.reactions[code].counter.textContent = String(votes);
  }

  /**
   * Set new value of counter stored
   * @param {string} key - field name.
   * @param {string} choice - true-set vote , false-remove vote..
   */
  private saveValue (key: string | number, choice: boolean): void {
    const type = choice ? 'vote' : 'unvote';
    let counters = {};
    for (const key in this.reactions) {
      counters[key] = +this.reactions[key].counter.textContent;
    }
    const message = {
      'type': type,
      'votedReactionId': String(key),
      'reactions': counters,
      'moduleId': this.id,
      'userId': Reactions.userId
    };
    Reactions.socket.send(message);
  }

  /**
   * Set selected reaction and votes
   * @param {object} msg - contain options
   * @param {number} msg.votedReactionId - number of picked reaction
   * @param {number[]} msg.reactions - values of votes
   */
  private update (msg) {
    if (Reactions.userId === msg.userId) {
      /** If there is no previously picked reaction */
      if (this.picked === undefined) {

        this.picked = +msg.votedReactionId;

        this.reactions[this.picked].emoji.classList.add(Reactions.CSS.picked);
        this.reactions[this.picked].counter.classList.add(Reactions.CSS.votesPicked);

        this.vote(+msg.votedReactionId);

        return;
      }
      /** If clicked reaction and previously picked reaction are not the same */
      if (this.picked !== msg.votedReactionId) {
        this.reactions[this.picked].emoji.classList.remove(Reactions.CSS.picked);
        this.reactions[this.picked].counter.classList.remove(Reactions.CSS.votesPicked);

        this.unvote(this.picked);
        this.picked = +msg.votedReactionId;

        this.reactions[this.picked].emoji.classList.add(Reactions.CSS.picked);
        this.reactions[this.picked].counter.classList.add(Reactions.CSS.votesPicked);

        this.vote(+msg.votedReactionId);
        return;
      }

      /* If clicked reaction and previously picked reaction are the same*/
      this.reactions[this.picked].emoji.classList.remove(Reactions.CSS.picked);
      this.reactions[this.picked].counter.classList.remove(Reactions.CSS.votesPicked);
      this.unvote(+msg.votedReactionId);

      this.picked = undefined;
    } else {
      for (const code in this.reactions) {
        let value = +msg.reactions[code];
        if (value !== undefined) {
          this.reactions[code].counter.textContent = String(value);
        }
      }
    }
  }

  private get picked () {
    return this._picked;
  }

  private set picked (value: number) {
    Storage.setItem(`User${Reactions.userId}PickedOn${String(this.id)}`, value);
    this._picked = value;
  }
}
