import * as io from 'socket.io-client'
import Reaction from './../reaction/reaction.ts'

/**
 * Instrument to create socket connection
 */
export default class Socket {

  update: (reactions: Reaction[]) => void
  socket: SocketIOClient.Socket

  /**
   * Creates an instance of Socket
   *
   * @this {Socket}
   * @param {string} serverIP - IP of the server
   * @param {function} update - function which gets data and updates counters
   */
  constructor (serverIP: string, update: (reactions: Reaction[]) => void) {

    this.socket = io(serverIP)
    this.update = update

    this.socket.on('message', (msg: Reaction[]) => update(msg))

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
