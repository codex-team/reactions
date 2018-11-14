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
 * @classdesc Perpesenting a reactions
 */
export default class Reactions {
  /** User id */
  private static userId: number = Reactions.getCounter('userId');

  /**
   * Returns style name 
   */
  public static get CSS (): Styles {
    return {
      emoji: 'counter__emoji',
      picked: 'counter__emoji--picked',
      reactionContainer: 'counter',
      title: 'reactions__title',
      votes: 'counter__votes',
      votesPicked: 'counter__votes--picked',
      wrapper: 'reactions'
    };
  }

  /**
   * Return value of counter stored in localStorage
   * @param {string} key - field name in localStorage.
   */
  private static getCounter(key: string): number {
    return parseInt(window.localStorage.getItem(key), 10);
  }

  /** 
   * Set new value of counter stored in localStorage
   * @param {string} key - field name in localStorage.
   * @param {string} value - new field value.
   */
  private static setCounter(key: string, value: string | number): void {
    window.localStorage.setItem(key, String(value));
  }
  
  /**
   * Set userId 
   * @param {number} userId
   */
  public static setUserId(userId: number) {
    this.userId = userId
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
   * Create a reactions module.
   * @param {object} data - object containing emojis, title and parent element.
   * @param {string} data.parent - element where module is inserted.
   * @param {string[]} data.reactions - list of emojis.
   * @param {string} data.title - title.
   * @throws Will throw an error if parent element is not found.
   */
  public constructor (data: ReactionsConfig) {
    this.wrap = this.createElement('div', Reactions.CSS.wrapper);
    const parent: HTMLElement = document.querySelector(data.parent);

    const pollTitle: HTMLElement = this.createElement('span', Reactions.CSS.title, { textContent: data.title });

    this.wrap.append(pollTitle);

    data.reactions.forEach((item: string, i: number) => {
      this.reactions.push(this.addReaction(item, i));
    });

    if (parent) {
      parent.append(this.wrap);
    } else {
      throw new Error('Parent element is not found');
    }

    /** Set user id on close page */
    window.addEventListener('unload', () => {
      Reactions.setCounter('userId', Reactions.userId);
    });
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
    if (this.picked === i)emoji.classList.add(Reactions.CSS.picked);
    const storageKey: string = 'reactionIndex' + i;

    emoji.addEventListener('click', (click: Event) => this.reactionClicked(i));
    let votes: number = Reactions.getCounter(storageKey);

    if (!votes) {
      votes = 0;
      Reactions.setCounter(storageKey, votes);
    }

    const counter: HTMLElement = this.createElement('span', Reactions.CSS.votes, { textContent: votes });
    if (this.picked===i) counter.classList.add(Reactions.CSS.votesPicked);

    reactionContainer.append(emoji);
    reactionContainer.append(counter);
    this.wrap.append(reactionContainer);

    return { emoji, counter };
  }

  /** 
   * Processing click on emoji
   * @param {string} index - index of reaction clicked by user.
   */
  public reactionClicked(index: number): void {
    /** If there is no previously picked reaction */
    if (this.picked === undefined) {
      this.vote(index);
      this.picked = index;
      return;
    }
    /** If clicked reaction and previosly picked reaction are not the same */
    if (this.picked !== index) { 
      this.vote(index);
      this.unvote(this.picked);
      this.picked = index;

      return;
    }

    /* If clicked reaction and previosly picked reaction are the same*/
    this.unvote(index);
    this.picked = undefined;
  }

  /**   
   * Decrease counter and remove highlight
   * @param {string} index - index of unvoted reaction.
   */
  public unvote (index: number): void {
    const storageKey: string = 'reactionIndex' + index;
    const votes: number = Reactions.getCounter(storageKey) - 1;

    this.reactions[index].emoji.classList.remove(Reactions.CSS.picked);
    Reactions.setCounter(storageKey, votes);
    this.reactions[index].counter.classList.remove(Reactions.CSS.votesPicked);
    this.reactions[index].counter.textContent = String(votes);
  }

  /** 
   * Increase counter and highlight emoji
   * @param {string} index - index of voted reaction.
   */
  public vote (index: number): void {
    const storageKey: string = 'reactionIndex' + index;
    const votes: number = Reactions.getCounter(storageKey) + 1;

    this.reactions[index].emoji.classList.add(Reactions.CSS.picked);
    Reactions.setCounter(storageKey, votes);
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