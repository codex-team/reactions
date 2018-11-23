import Socket from './socket/index';
import Identifier from './identifier';
import DOM from './utils/dom';

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
  public static userId: number | string = localStorage.getItem('reactionsUserId') || Reactions.getRandomValue();

  /**
   * URl of server
   */
  public static serverURL: string = 'localhost:3000';

  /**
   * Class for connection
   */
  private static socket: Socket = new Socket(Reactions.serverURL);

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
   * Return random number
   */
  private static getRandomValue (): number {
    return window.crypto.getRandomValues(new Uint32Array(1))[0];
  }

  /**
   * Set new value of counter stored in localStorage
   * @param {string} key - field name in localStorage.
   * @param {string} choice - true-set vote , false-remove vote..
   */
  private saveValue (key: string | number, choice: boolean): void {
    const type = choice ? 'vote' : 'unvote';
    const message = {
      'type': type,
      'reaction': String(key),
      'moduleId': this.id,
      'userId': Reactions.userId
    };
    Reactions.socket.send(message);
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
   * Number of picked element
   */
  private _picked: number;

  private get picked () {
    return this._picked;
  }

  private set picked (value: number) {
    localStorage.setItem(`pickedOn${String(this.id)}`, String(value));
    this._picked = value;
  }

  /**
   * Array of counters elements
   */
  private reactions: Array<{ counter: HTMLElement; emoji: HTMLElement }> = [];

  /**
   * Elements holder
   */
  private wrap: HTMLElement;

  /**
   * Module identifier
   */
  public id: Identifier;

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

    this.id = new Identifier(data.id);

    data.reactions.forEach((item: string, i: number) => {
      this.reactions.push(this.addReaction(item, i));
    });

    let lsPicked: number = parseInt(localStorage.getItem(`pickedOn${String(this.id)}`),10);
    let votedReactionId: number = isNaN(lsPicked) ? undefined : lsPicked;
    this.update({
      votedReactionId: votedReactionId
    });

    /** Get picked reaction */
    Reactions.socket.socket.on('new message', (msg: any): void => {
      if (msg.id === this.id) {
        return;
      }

      switch (msg.type) {
        case 'update':
          this.update(msg);
          break;
      }
    });
    if (parent) {
      parent.append(this.wrap);
    } else {
      throw new Error('Parent element is not found');
    }

    /** Set user id on close page */
    localStorage.setItem('reactionsUserId', String(Reactions.userId));
  }

  /**
   * Set seleced reaction and votes
   * @param {object} msg - contain options
   * @param {number} msg.votedReactionId - number of picked reaction
   * @param {number[]} msg.reactions - values of votes
   */
  private update (msg: UpdateOptions) {
    if (this.picked !== undefined) {
      this.reactions[this.picked].emoji.classList.remove(Reactions.CSS.picked);
      this.reactions[this.picked].counter.classList.remove(Reactions.CSS.votesPicked);
    }

    this.picked = msg.votedReactionId;
    this.lastReactionsVotes = msg.reactions;

    if (this.picked !== undefined) {
      this.reactions[this.picked].emoji.classList.add(Reactions.CSS.picked);
      this.reactions[this.picked].counter.classList.add(Reactions.CSS.votesPicked);
    }

    if (msg.reactions !== undefined) {
      this.reactions.forEach((reaction) => {
        let value = msg.reactions[reaction.emoji.textContent];
        if (value !== undefined) {
          reaction.counter.textContent = String(value);
        }
      });
    }
  }

  /**
   * Create and insert reactions button
   * @param {string} item - emoji from data.reactions array.
   * @param {string} i - array counter.
   * @returns {object} containing pair of emoji element and it's counter
   */
  public addReaction (item: any, i: number): { counter: HTMLElement; emoji: HTMLElement } {
    const reactionContainer: HTMLElement = DOM.make('div', Reactions.CSS.reactionContainer);
    const emoji: HTMLElement = DOM.make('div', Reactions.CSS.emoji, {
      textContent: item
    });

    emoji.addEventListener('click', (click: Event) => this.reactionClicked(i));

    const counter: HTMLElement = DOM.make('span', Reactions.CSS.votes, { textContent: 0 });

    reactionContainer.append(emoji);
    reactionContainer.append(counter);
    this.wrap.append(reactionContainer);

    return { emoji, counter };
  }

  /**
   * Processing click on emoji
   * @param {string} index - index of reaction clicked by user.
   */
  public reactionClicked (index: number): void {
    /** If there is no previously picked reaction */
    if (this.picked === undefined) {
      this.vote(index);
      this.update({ votedReactionId: index });
      return;
    }
    /** If clicked reaction and previosly picked reaction are not the same */
    if (this.picked !== index) {
      this.vote(index);
      this.unvote(this.picked);

      this.update({ votedReactionId: index });
      return;
    }

    /* If clicked reaction and previosly picked reaction are the same*/
    this.saveValue(index, false);
    this.unvote(index);
    this.update({ votedReactionId: undefined });
  }

  /**
   * Decrease counter
   * @param {string} index - index of unvoted reaction.
   */
  public unvote (index: number): void {
    const votes: number = +this.reactions[index].counter.textContent - 1;

    this.reactions[index].counter.textContent = String(votes);
  }

  /**
   * Increase counter
   * @param {string} index - index of voted reaction.
   */
  public vote (index: number): void {
    const votes: number = +this.reactions[index].counter.textContent + 1;

    this.saveValue(index, true);
    this.reactions[index].counter.textContent = String(votes);
  }
}
