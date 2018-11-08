import * as io from 'socket.io-client'
const EventEmitter = require('event-emitter-es6')
import Reaction from './../reaction/reaction.ts'

/** Instrument to create socket connection */
export default class Socket extends EventEmitter {

  /**
   * Socket which connects to the server
   *
   * @type {SocketIOClient.Socket}
   * @private
   */
  private socket: SocketIOClient.Socket

  /**
   * Creates an instance of Socket
   *
   * @this {Socket}
   * @param {string} url - a url of the server
   * @param {function} update - a function which gets data and updates counters
   */
  constructor (url: string) {

    super()
    this.socket = io(url)

    this.socket.on('message', (msg: Reaction[]) => this.emit('message', msg))

  }

  /**
   * Sends index of the reaction to the server
   *
   * @this {Socket}
   * @this {number} index - index of the reaction
   */
  send (index: number): void {
    this.socket.send(index)
  }

}
