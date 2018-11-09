/**
 * Type of input data
 */
import Identifier from "./identifier";
/**
 * @class Reactions
 * @classdesc Representing a reactions
 */
export default class Reactions {
    /**
     * Create a reactions poll.
     * @param {object} data - object containing emojis, title and parent element.
     * @param {string} data.parent - element where module is inserted.
     * @param {string[]} data.reactions - list of emojis.
     * @param {string} data.title - title.
     * @param {string} data.id - module identifier.
     * @throws Will throw an error if parent element is not found.
     */
    constructor(data) {
        /**
         * Number of picked element
         */
        this.picked = undefined;
        /**
         * Array of counters elements
         */
        this.reactions = [];
        this.wrap = this.createElement('div', Reactions.CSS.wrapper);
        const parent = document.querySelector(data.parent);
        const pollTitle = this.createElement('span', Reactions.CSS.title, { textContent: data.title });
        this.wrap.appendChild(pollTitle);
        data.reactions.forEach((item, i) => {
            this.reactions.push(this.addReaction(item, i));
        });
        this.setIdentifier(data.id);
        if (parent) {
            parent.appendChild(this.wrap);
        }
        else {
            throw new Error('Parent element is not found');
        }
    }
    /**
     * Returns style name
     */
    static get CSS() {
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
     * Create and insert reactions button
     * @param {string} item - emoji from data.reactions array.
     * @param {string} i - array counter.
     * @returns {object} containing pair of emoji element and it's counter
     */
    addReaction(item, i) {
        const reactionContainer = this.createElement('div', Reactions.CSS.reactionContainer);
        const emoji = this.createElement('div', Reactions.CSS.emoji, {
            textContent: item
        });
        const storageKey = 'reactionIndex' + i;
        emoji.addEventListener('click', (click) => this.reactionClicked(i));
        let votes = this.getCounter(storageKey);
        if (!votes) {
            votes = 0;
            this.setCounter(storageKey, votes);
        }
        const counter = this.createElement('span', Reactions.CSS.votes, { textContent: votes });
        reactionContainer.appendChild(emoji);
        reactionContainer.appendChild(counter);
        this.wrap.appendChild(reactionContainer);
        return { emoji, counter };
    }
    /**
     * Processing click on emoji
     * @param {string} index - index of reaction clicked by user.
     */
    reactionClicked(index) {
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
    unvote(index) {
        const storageKey = 'reactionIndex' + index;
        const votes = this.getCounter(storageKey) - 1;
        this.reactions[index].emoji.classList.remove(Reactions.CSS.picked);
        this.setCounter(storageKey, votes);
        this.reactions[index].counter.classList.remove(Reactions.CSS.votesPicked);
        this.reactions[index].counter.textContent = String(votes);
    }
    /**
     * Increase counter and highlight emoji
     * @param {string} index - index of voted reaction.
     */
    vote(index) {
        const storageKey = 'reactionIndex' + index;
        const votes = this.getCounter(storageKey) + 1;
        this.reactions[index].emoji.classList.add(Reactions.CSS.picked);
        this.setCounter(storageKey, votes);
        this.reactions[index].counter.classList.add(Reactions.CSS.votesPicked);
        this.reactions[index].counter.textContent = String(votes);
    }
    /**
     * Making creation of dom elements easier
     * @param {string} elName - string containing tagName.
     * @param {array|string} classList - string containing classes names for new element.
     * @param {string} attrList - string containing attributes names for new element.
     */
    createElement(elName, classList, attrList) {
        const el = document.createElement(elName);
        if (classList) {
            if (Array.isArray(classList)) {
                el.classList.add(...classList);
            }
            else {
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
    /**
     * Return value of counter stored in localStorage
     * @param {string} key - field name in localStorage.
     */
    getCounter(key) {
        return parseInt(window.localStorage.getItem(key), 10);
    }
    /**
     * Set new value of counter stored in localStorage
     * @param {string} key - field name in localStorage.
     * @param {string} value - new field value.
     */
    setCounter(key, value) {
        window.localStorage.setItem(key, String(value));
    }
    /**
     * Create instance of Identifier and set user id or
     * URL hash as Reactions id
     * @param idValue {string} - Value to be used as Reactions id
     */
    setIdentifier(idValue) {
        this.id = new Identifier(idValue).id;
    }
}
//# sourceMappingURL=main.js.map