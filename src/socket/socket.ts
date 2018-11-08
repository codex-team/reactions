import * as io from 'socket.io-client'
const EventEmitter = require('event-emitter-es6')
import Reaction from './../reaction/reaction.ts'

/** Instrument to create socket connection */
export default class Socket extends EventEmitter {

  /** Socket which connects to the server */
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

    const classPointer = this
    this.socket.on('message', (msg: Reaction[]) => classPointer.emit('message', msg))

  }

  /**
   * Sends index of the reaction to the server
   *
   * @this {Socket}
   * @this {number} ind - index of the reaction
   */
  send (ind: number): void {
    this.socket.send(ind)
  }

}
