"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class Reactions
 * @classdesc Representing a reactions
 */
var Reactions = /** @class */ (function () {
    /**
     * Create a reactions module.
     * @param {object} data - object containing emojis, title and parent element.
     * @param {string} data.parent - element where module is inserted.
     * @param {string[]} data.reactions - list of emojis.
     * @param {string} data.title - title.
     * @param {string | number} data.id - module identifier.
     * @throws Will throw an error if parent element is not found.
     */
    function Reactions(data) {
        var _this = this;
        /**
         * Number of picked element
         */
        this.picked = undefined;
        /**
         * Array of counters elements
         */
        this.reactions = [];
        this.wrap = this.createElement('div', Reactions.CSS.wrapper);
        var parent = document.querySelector(data.parent);
        var pollTitle = this.createElement('span', Reactions.CSS.title, { textContent: data.title });
        this.wrap.append(pollTitle);
        data.reactions.forEach(function (item, i) {
            _this.reactions.push(_this.addReaction(item, i));
        });
        this.id = new Identifier(data.id);
        if (parent) {
            parent.append(this.wrap);
        }
        else {
            throw new Error('Parent element is not found');
        }
    }
    Object.defineProperty(Reactions, "CSS", {
        /**
         * Returns style name
         */
        get: function () {
            return {
                emoji: 'counter__emoji',
                picked: 'counter__emoji--picked',
                reactionContainer: 'counter',
                title: 'reactions__title',
                votes: 'counter__votes',
                votesPicked: 'counter__votes--picked',
                wrapper: 'reactions'
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Create and insert reactions button
     * @param {string} item - emoji from data.reactions array.
     * @param {string} i - array counter.
     * @returns {object} containing pair of emoji element and it's counter
     */
    Reactions.prototype.addReaction = function (item, i) {
        var _this = this;
        var reactionContainer = this.createElement('div', Reactions.CSS.reactionContainer);
        var emoji = this.createElement('div', Reactions.CSS.emoji, {
            textContent: item
        });
        var storageKey = 'reactionIndex' + i;
        emoji.addEventListener('click', function (click) { return _this.reactionClicked(i); });
        var votes = this.getCounter(storageKey);
        if (!votes) {
            votes = 0;
            this.setCounter(storageKey, votes);
        }
        var counter = this.createElement('span', Reactions.CSS.votes, { textContent: votes });
        reactionContainer.append(emoji);
        reactionContainer.append(counter);
        this.wrap.append(reactionContainer);
        return { emoji: emoji, counter: counter };
    };
    /**
     * Processing click on emoji
     * @param {string} index - index of reaction clicked by user.
     */
    Reactions.prototype.reactionClicked = function (index) {
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
    };
    /**
     * Decrease counter and remove highlight
     * @param {string} index - index of unvoted reaction.
     */
    Reactions.prototype.unvote = function (index) {
        var storageKey = 'reactionIndex' + index;
        var votes = this.getCounter(storageKey) - 1;
        this.reactions[index].emoji.classList.remove(Reactions.CSS.picked);
        this.setCounter(storageKey, votes);
        this.reactions[index].counter.classList.remove(Reactions.CSS.votesPicked);
        this.reactions[index].counter.textContent = String(votes);
    };
    /**
     * Increase counter and highlight emoji
     * @param {string} index - index of voted reaction.
     */
    Reactions.prototype.vote = function (index) {
        var storageKey = 'reactionIndex' + index;
        var votes = this.getCounter(storageKey) + 1;
        this.reactions[index].emoji.classList.add(Reactions.CSS.picked);
        this.setCounter(storageKey, votes);
        this.reactions[index].counter.classList.add(Reactions.CSS.votesPicked);
        this.reactions[index].counter.textContent = String(votes);
    };
    /**
     * Making creation of dom elements easier
     * @param {string} elName - string containing tagName.
     * @param {array|string} classList - string containing classes names for new element.
     * @param {string} attrList - string containing attributes names for new element.
     */
    Reactions.prototype.createElement = function (elName, classList, attrList) {
        var _a;
        var el = document.createElement(elName);
        if (classList) {
            if (Array.isArray(classList)) {
                (_a = el.classList).add.apply(_a, classList);
            }
            else {
                el.classList.add(classList);
            }
        }
        for (var attrName in attrList) {
            if (attrList.hasOwnProperty(attrName)) {
                el[attrName] = attrList[attrName];
            }
        }
        return el;
    };
    /**
     * Return value of counter stored in localStorage
     * @param {string} key - field name in localStorage.
     */
    Reactions.prototype.getCounter = function (key) {
        return parseInt(window.localStorage.getItem(key), 10);
    };
    /**
     * Set new value of counter stored in localStorage
     * @param {string} key - field name in localStorage.
     * @param {string} value - new field value.
     */
    Reactions.prototype.setCounter = function (key, value) {
        window.localStorage.setItem(key, String(value));
    };
    return Reactions;
}());
exports.default = Reactions;
//# sourceMappingURL=main.js.map