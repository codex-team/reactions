/** Info about the reaction */
export default class Reaction {

  /**
   * Rate of the reaction
   *
   * @type {number}
   * @private
   */
  private _rate: number
  
  /**
   * Personal reaction of the user true or false
   *
   * @type {boolean}
   * @private
   */
  private _vote: boolean

  /**
   * Creates an instance of Reaction
   *
   * @this {Reaction}
   * @param {number} rate - value of the counter
   * @param {boolean} vote - reaction of the user
   */
  constructor (rate: number, vote: boolean) {
    this._rate = rate
    this._vote = vote
  }

  /**
   * Returns the value of the counter
   *
   * @return {number} - the value of the counter
   */
  public get rate (): number {
    return this._rate
  }

  /**
   * Returns the vote of the user
   *
   * @return {boolean} - the vote of the user
   */
  public get vote (): boolean {
    return this._vote
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
