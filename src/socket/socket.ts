import * as io from 'socket.io-client'
const EventEmitter = require('event-emitter-es6')
import Reaction from './../reaction/reaction.ts'

/**
 * Instrument to create socket connection
 */
export default class Socket extends EventEmitter {

  socket: SocketIOClient.Socket

  /**
   * Creates an instance of Socket
   *
   * @this {Socket}
   * @param {string} serverIP - IP of the server
   * @param {function} update - function which gets data and updates counters
   */
  constructor (serverIP: string) {

    super()
    this.socket = io(serverIP)

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
