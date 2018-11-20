import * as io from 'socket.io-client'
const EventEmitter = require('event-emitter-es6')
import Reaction from './../reaction/index.ts'

/** Instrument to create socket connection */
export default class Socket extends EventEmitter {

  /**
   * Socket which connects to the server
   *
   * @type {SocketIOClient.Socket}
   * @private
   */
  public socket: SocketIOClient.Socket

  /**
   * Creates an instance of Socket
   *
   * @this {Socket}
   * @param {string} url - a url of the server
   */
  constructor (url: string) {

    super()
    this.socket = io(url)

    this.socket.on('message', (msg: Reaction[]) => this.message(msg))

  }

  /**
   * Sends index of the reaction to the server
   *
   * @this {Socket}
   * @param {number} index - index of the reaction
   */
  send (index: object): void {
    this.socket.send(index)
  }

  /**
   * Calls 'message' event
   *
   * @this {Socket}
   * @param {Reaction[]} reactions - an array with info about reactions
   * @private
   */
  private message (reactions: Reaction[]) {
    this.emit('message', reactions)
  }

}
