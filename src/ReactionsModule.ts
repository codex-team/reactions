import Identifier from './identifier.ts';
import Socket from './socket/index.ts';
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
 * Type of style holder
 */
interface Styles {
  [key: string]: string;
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
    const message = {
      'choice': choice,
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
   * Number of picked element
   */
  private picked: number = undefined;

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
  private id: Identifier;

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
      'moduleId': this.id,
      'userId': Reactions.userId
    });

    /** Get picked reaction */
    Reactions.socket.socket.on('new message',(msg: any) => {
      console.log(msg);
      if (msg.id === this.id) {
        this.picked = msg.votedReactionId;
        this.reactions[this.picked].emoji.classList.add(Reactions.CSS.picked);
        this.reactions[this.picked].counter.classList.add(Reactions.CSS.votesPicked);
        msg.reactions.forEach((value,index) =>
          this.reactions[index].counter.textContent = value);
      }
    });

    this.wrap = this.createElement('div', Reactions.CSS.wrapper);
    const parent: HTMLElement = document.querySelector(data.parent);

    const pollTitle: HTMLElement = this.createElement('span', Reactions.CSS.title, { textContent: data.title });

    this.wrap.append(pollTitle);

    this.id = new Identifier(data.id);

    data.reactions.forEach((item: string, i: number) => {
      this.reactions.push(this.addReaction(item, i));
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
   * Create and insert reactions button
   * @param {string} item - emoji from data.reactions array.
   * @param {string} i - array counter.
   * @returns {object} containing pair of emoji element and it's counter
   */
  public addReaction (item: any, i: number): { counter: HTMLElement; emoji: HTMLElement } {
    const reactionContainer: HTMLElement = this.createElement('div', Reactions.CSS.reactionContainer);
    const emoji: HTMLElement = this.createElement('div', Reactions.CSS.emoji, {
      textContent: item
    });

    emoji.addEventListener('click', (click: Event) => this.reactionClicked(i));

    const counter: HTMLElement = this.createElement('span', Reactions.CSS.votes);

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
      return;
    }
    /** If clicked reaction and previosly picked reaction are not the same */
    if (this.picked !== index) {
      this.vote(index);
      this.unvote(this.picked);

      return;
    }

    /* If clicked reaction and previosly picked reaction are the same*/
    this.saveValue(index, false);
    this.unvote(index);
  }

  /**
   * Decrease counter and remove highlight
   * @param {string} index - index of unvoted reaction.
   */
  public unvote (index: number): void {
    const votes: number = +this.reactions[index].counter.textContent - 1;

    this.reactions[index].emoji.classList.remove(Reactions.CSS.picked);
    this.reactions[index].counter.classList.remove(Reactions.CSS.votesPicked);
    this.reactions[index].counter.textContent = String(votes);
  }

  /**
   * Increase counter and highlight emoji
   * @param {string} index - index of voted reaction.
   */
  public vote (index: number): void {
    const votes: number = +this.reactions[index].counter.textContent + 1;

    this.reactions[index].emoji.classList.add(Reactions.CSS.picked);
    this.saveValue(index, true);
    this.reactions[index].counter.classList.add(Reactions.CSS.votesPicked);
    this.reactions[index].counter.textContent = String(votes);
  }

  /**
   * Making creation of dom elements easier
   * @param {string} elName - string containing tagName.
   * @param {array|string} classList - string containing classes names for new element.
   * @param {string} attrList - string containing attributes names for new element.
   */
  private createElement (elName: string, classList?: string[] | string, attrList?: object): HTMLElement {
    const el: HTMLElement = document.createElement(elName);

    if (classList) {
      if (Array.isArray(classList)) {
        el.classList.add(...classList);
      } else {
        el.classList.add(classList);
      }
    }

    for (const attrName in attrList) {
      if (attrList.hasOwnProperty(attrName)) {
        el[attrName] = attrList[attrName];
      }
    }
    return el;
  }
}
