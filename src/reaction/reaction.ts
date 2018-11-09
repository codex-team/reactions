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
   * True if user've already answered to this poll
   *
   * @type {boolean}
   * @private
   */
  private _voted: boolean

  /**
   * Creates an instance of Reaction
   *
   * @this {Reaction}
   * @param {number} rate - value of the counter
   * @param {boolean} voted - reaction of the user
   */
  constructor (rate: number, voted: boolean) {
    this._rate = rate
    this._voted = voted
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
  public get voted (): boolean {
    return this._voted
  }

  /**
   * Calculates string representation of the Reaction
   *
   * @override
   * @return {string} - string representation
   */
  public toString (): string {
    return '[object Reaction]'
  }

}
