import * as io from 'socket.io-client'
import ReactionInfo from './../reaction-info/reaction-info.ts'

/**
 * Instrument to create socket connection
 */
export default class Socket {

  update: (reactions: ReactionInfo[]) => void
  socket: any

  /**
   * Creates an instance of Socket
   *
   * @this {Socket}
   * @param {string} serverIP - IP of the server
   * @param {function} update - function which gets data and updates counters
   */
  constructor (serverIP: string, update: (reactions: ReactionInfo[]) => void) {

    this.socket = io(serverIP)
    this.update = update

    this.socket.on('message', (msg: any) => update(msg))

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
