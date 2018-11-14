"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Info about the reaction */
var Reaction = /** @class */ (function () {
    /**
     * Creates an instance of Reaction
     *
     * @this {Reaction}
     * @param {number} rate - value of the counter
     * @param {boolean} voted - reaction of the user
     */
    function Reaction(rate, voted) {
        this._rate = rate;
        this._voted = voted;
    }
    Object.defineProperty(Reaction.prototype, "rate", {
        /**
         * Returns the value of the counter
         *
         * @return {number} - the value of the counter
         */
        get: function () {
            return this._rate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Reaction.prototype, "voted", {
        /**
         * Returns the vote of the user
         *
         * @return {boolean} - the vote of the user
         */
        get: function () {
            return this._voted;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Calculates string representation of the Reaction
     *
     * @override
     * @return {string} - string representation
     */
    Reaction.prototype.toString = function () {
        return '[object Reaction]';
    };
    return Reaction;
}());
exports.default = Reaction;
//# sourceMappingURL=index.js.map