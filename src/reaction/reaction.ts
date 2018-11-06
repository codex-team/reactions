/**
 * Info about the reaction
 */
export default class Reaction {

  value: number
  userReaction: boolean

  /**
   * Creates an instance of Reaction
   *
   * @this {Reaction}
   * @param {number}  value - value of the counter
   * @param {boolean} userReaction - reaction of the user
   */
  constructor (value: number, userReaction: boolean) {
    this.value = value
    this.userReaction = userReaction
  }

  /**
   * Returns value of the counter
   */
  getRate (): number {
    return this.value
  }

  /**
   * Returns reactions of the user
   */
  isVoted (): boolean {
    return this.userReaction
  }

  /**
   * Returns string representation of the Reaction
   */
  toString (): string {
    return this.getRate() + ' ' + this.isVoted() + '\n'
  }

}
