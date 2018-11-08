/**
 * Info about the reaction
 */
export default class Reaction {

  private value: number
  private vote: boolean

  /**
   * Creates an instance of Reaction
   *
   * @this {Reaction}
   * @param {number}  value - value of the counter
   * @param {boolean} vote - reaction of the user
   */
  constructor (value: number, vote: boolean) {
    this.value = value
    this.vote = vote
  }

  /**
   * Returns the value of the counter
   *
   * @return {number} - the value of the counter
   */
  public getRate (): number {
    return this.value
  }

  /**
   * Returns the vote of the user
   *
   * @return {boolean} - the vote of the user
   */
  public isVoted (): boolean {
    return this.vote
  }

  /**
   * Calculates string representation of the Reaction
   * 
   * @override
   * @return {string} - string representation
   */
  public toString (): string {
    return '[object Reaction]';
  }

}
