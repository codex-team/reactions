"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class Identifier
 * @classdesc Representing identifier for Reactions module
 */
var Identifier = /** @class */ (function () {
    /**
     * Create an identifier for Reactions module
     * If id is undefined, URL will be hashed with md5 and used as id
     * @param id {string} - User id for Reactions module.
     */
    function Identifier(id) {
        this.id = id || this.getURL();
    }
    /**
     * Returns URL, where this Reactions module located
     * @returns {string}
     */
    Identifier.prototype.getURL = function () {
        return document.location.href;
    };
    /**
     * Returns string representation of Identifier for JSON serializing
     * @returns {string}
     */
    Identifier.prototype.toJSON = function () {
        return this.id;
    };
    /**
     * Returns string representation of Identifier
     * @returns {string}
     */
    Identifier.prototype.toString = function () {
        return this.id;
    };
    return Identifier;
}());
exports.default = Identifier;
//# sourceMappingURL=identifier.js.map