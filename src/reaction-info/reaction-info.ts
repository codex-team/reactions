/**
 * Info about the reaction
 */
export default class ReactionInfo {

  value: number;
  userReaction: boolean;
  
  /**
   * Creates an instance of ReactionInfo
   *
   * @this {ReactionInfo}
   * @param {number}  value - value of the counter
   * @param {boolean} userReaction - reaction of the user
   */
  constructor(value: number, userReaction: boolean) {
    this.value = value;
    this.userReaction = userReaction;
  }

  /**
   * Returns value of the counter
   */
  getRate(): number {
    return this.value;
  }

  /**
   * Returns reactions of the user
   */
  isVoted(): boolean {
    return this.userReaction;
  }

  /**
   * Returns string representation of the ReactionInfo
   */
  toString(): string {
    return this.getRate() + ' ' + this.isVoted() + '\n';
  }

}
