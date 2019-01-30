import Socket from './socket';
import Identifier from './identifier';
import DOM from './utils/dom';
import Common from './utils/common';
import Storage from './utils/storage';
import Fingerprint from './utils/fingerprint';

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
  reaction: number;

  /** Values of votes */
  reactions?: {[key: string]: number};
}

/**
 * Type of input data
 */
interface ReactionsConfig {
  /** Selector of root element */
  parent: string | HTMLElement;

  /** Array of emoji symbols */
  reactions: string[];

  /** Title text */
  title?: string;

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
  public static userId: number | string = Storage.getItem('reactionsUserId') || Common.getRandomValue().toString();

  /**
   * Class for connection
   */
  private static socket: Socket = new Socket(process.env.SERVER_URL);

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
      container: 'reactions__container',
      wrapper: 'reactions'
    };
  }

  /**
   * Set userId
   * @param {number} userId
   */
  public static setUserId (userId: number) {
    Reactions.userId = String(userId);
  }

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
  private reactions: {[emodji: string]: {counter: HTMLElement, emoji: HTMLElement; } } = {};

  /**
   * Elements used by module
   */
  private nodes: {[key: string]: HTMLElement} = {
    wrap: null,
    container: null
  };

  /**
   * Create a reactions module.
   * @param {object} data - object containing emojis, title and parent element.
   * @param {string} data.parent - element where module is inserted.
   * @param {string[]} data.reactions - list of emojis.
   * @param {string} [data.title] - title.
   * @param {string | number} [data.id] - module identifier.
   * @throws Will throw an error if parent element is not found.
   */
  public constructor (data: ReactionsConfig) {
    this.id = new Identifier(data.id);

    this.nodes.wrap = DOM.make('div', Reactions.CSS.wrapper);

    let parent: HTMLElement;

    if (data.parent instanceof HTMLElement) {
      parent = data.parent;
    } else {
      parent = document.querySelector(data.parent);
    }

    if (data.title) {
      const pollTitle = this.createTitle(data.title);

      this.nodes.wrap.append(pollTitle);
    }

    this.nodes.container = DOM.make('div', Reactions.CSS.container);

    data.reactions.forEach((item: string) => {
      const hash = this.getEmojiHash(item);

      if (!(hash in this.reactions)) {
        this.reactions[hash] = this.addReaction(item, hash);
      }
    });

    this.nodes.wrap.append(this.nodes.container);

    Fingerprint.getHash().then((hash) => {
      console.log('hash from module', hash);
    });
    /** Connect with server */
    Reactions.socket.send({
      type : 'initialization',
      title: data.title,
      options: data.reactions.reduce((options, reaction) => {
        options[this.getEmojiHash(reaction)] = 0;
        return options;
      }, {}),
      id: this.id,
      userId: Reactions.userId
    });

    const savedPicked = Storage.getInt(this.getStorageKey());

    if (savedPicked && savedPicked in this.reactions) {
      this.update({
        reaction: savedPicked,
        userId: Reactions.userId
      });
    }

    /** Get picked reaction */
    Reactions.socket.socket.on('update', (msg: any): void => {
      if (!msg || msg.id !== this.id.toString()) {
        return;
      }

      this.update(msg);
    });

    if (parent) {
      parent.append(this.nodes.wrap);
    } else {
      throw new Error('Parent element is not found');
    }

    /** Set user id on close page */
    Storage.setItem('reactionsUserId', Reactions.userId);
  }

  /**
   * Create and insert reactions button
   * @param {string} item - emoji from data.reactions array.
   * @param {string} hash - hash of emoji
   * @returns {object} containing pair of emoji element and it's counter
   */
  public addReaction (item: any, hash: number): { counter: HTMLElement; emoji: HTMLElement } {
    const reactionContainer: HTMLElement = DOM.make('div', Reactions.CSS.reactionContainer);
    const emoji: HTMLElement = DOM.make('div', Reactions.CSS.emoji, {
      textContent: item
    });

    emoji.addEventListener('click', () => this.reactionClicked(hash));

    const counter: HTMLElement = DOM.make('span', Reactions.CSS.votes, { textContent: 0 });

    reactionContainer.append(emoji);
    reactionContainer.append(counter);
    this.nodes.container.append(reactionContainer);

    return { emoji, counter };
  }

  /**
   * Processing click on emoji
   * @param {number} hash - hash of emoji.
   */
  public reactionClicked (hash: number): void {
    this.update({ userId: Reactions.userId, reaction: hash });

    this.saveValue(hash, this.picked !== undefined);
  }

  /**
   * Increase counter
   * @param {string} hash - hash of voted emoji.
   */
  public vote (hash: number): void {
    const votes: number = +this.reactions[hash].counter.textContent + 1;

    this.reactions[hash].counter.textContent = votes.toString();
  }

  /**
   * Decrease counter
   * @param {string} hash - hash of unvoted reaction.
   */
  public unvote (hash: number): void {
    const votes: number = +this.reactions[hash].counter.textContent - 1;

    this.reactions[hash].counter.textContent = votes.toString();
  }

  private createTitle (title: string): HTMLElement {
    return DOM.make('span', Reactions.CSS.title, { textContent: title });
  }

  /**
   * Set new value of counter stored
   * @param {string} key - field name.
   * @param {string} choice - true-set vote , false-remove vote..
   */
  private saveValue (key: string | number, choice: boolean): void {
    const type = choice ? 'vote' : 'unvote';

    const message = {
      type: type,
      reaction: key.toString(),
      id: this.id,
      userId: Reactions.userId
    };

    Reactions.socket.send(message);
  }

  /**
   * Set selected reaction and votes
   * @param {object} msg - contain options
   * @param {number} msg.reaction - number of picked reaction
   * @param {object} msg.options - object with counters values for reactions
   * @param {number} msg.options[hash] - counter value for certain reaction
   */
  private update (msg) {
    if (msg.options) {
      this.setOptions(msg.options);
    }

    if (msg.userId === Reactions.userId) {
      if (!msg.reaction) {
        this.applyVotedStyles();
        Storage.removeItem(this.getStorageKey());
        return;
      }

      /** If there is no previously picked reaction */
      if (this.picked === undefined) {

        this.picked = +msg.reaction;

        this.applyVotedStyles(this.picked);

        if (!msg.options) {
          this.vote(+msg.reaction);
        }

        return;
      }

      /** If clicked reaction and previously picked reaction are not the same */
      if (this.picked !== msg.reaction) {
        const oldValue = this.picked;
        this.picked = +msg.reaction;

        /** If it is not message from server, options are omitted */
        if (!msg.options) {
          this.unvote(oldValue);
          this.vote(this.picked);
        }
        this.applyVotedStyles(this.picked);

        return;
      }

      /* If clicked reaction and previously picked reaction are the same */
      if (!msg.options) {
        this.applyVotedStyles();
        this.unvote(+msg.reaction);
        this.picked = undefined;
      }
    }

  }

  /**
   * Updates counters styles
   * @param {number} picked - hash of picked emoji
   */
  private applyVotedStyles (picked?: number) {
    Object
      .values(this.reactions)
      .forEach(({ emoji, counter }: {emoji: HTMLElement, counter: HTMLElement}) => {
        emoji.classList.remove(Reactions.CSS.picked);
        counter.classList.remove(Reactions.CSS.votesPicked);
      });

    if (!picked) {
      return;
    }

    this.reactions[picked].emoji.classList.add(Reactions.CSS.picked);
    this.reactions[picked].counter.classList.add(Reactions.CSS.votesPicked);
  }

  /**
   * Update values of reactions` counters
   * @param options - object with emoji hash as key and counter as value
   */
  private setOptions (options: {[key: number]: number}) {
    for (const hash in this.reactions) {
      let value = +options[hash];

      if (value !== undefined) {
        this.reactions[hash].counter.textContent = value.toString();
      }
    }
  }

  private get picked () {
    return this._picked;
  }

  private set picked (value: number) {
    Storage.setItem(this.getStorageKey() , value);
    this._picked = value;
  }

  /**
   * Returns storage key for last user`s reaction
   *
   * @param {string | number} userId - id of user.
   * @param {string} id - id of module.
   * @returns {string} storage key.
   */
  private getStorageKey () {
    return `User:${Reactions.userId}:PickedOn:${this.id.toString()}`;
  }

  /**
   * Returns hash of emoji
   *
   * @param {string} emoji
   *
   * @return {string} - emoji hash
   */
  private getEmojiHash (emoji: string): number {
    const multiplier = 3;
    let hash = 1;

    for (let i = 0; i < emoji.length; i++) {
      hash += multiplier * hash + emoji.codePointAt(i);
    }

    return hash;
  }
}
