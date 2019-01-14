/**
 * @class Common
 * @classdesc Include different functions
 */
export default class Common {
  /**
   * Return random number
   */
  public static getRandomValue (): number {
    return window.crypto.getRandomValues(new Uint32Array(1))[0];
  }
}
