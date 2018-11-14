"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var io = require("socket.io-client");
var EventEmitter = require('event-emitter-es6');
/** Instrument to create socket connection */
var Socket = /** @class */ (function (_super) {
    __extends(Socket, _super);
    /**
     * Creates an instance of Socket
     *
     * @this {Socket}
     * @param {string} url - a url of the server
     */
    function Socket(url) {
        var _this = _super.call(this) || this;
        _this.socket = io(url);
        _this.socket.on('message', function (msg) { return _this.message(msg); });
        return _this;
    }
    /**
     * Sends index of the reaction to the server
     *
     * @this {Socket}
     * @param {number} index - index of the reaction
     */
    Socket.prototype.send = function (index) {
        this.socket.send(index);
    };
    /**
     * Calls 'message' event
     *
     * @this {Socket}
     * @param {Reaction[]} reactions - an array with info about reactions
     * @private
     */
    Socket.prototype.message = function (reactions) {
        this.emit('message', reactions);
    };
    return Socket;
}(EventEmitter));
exports.default = Socket;
//# sourceMappingURL=index.js.map