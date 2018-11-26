/**
 * @class Common
 * @classdesc Include different functions
 */
export default class Storage {
  /**
   * Get number or undefined
   * @param {string | number} key - key of storage
   */
  public static getInt (key: string | number): number {
    let item: number = parseInt(Storage.getItem(key),10);
    return isNaN(item) ? undefined : item;
  }
  /**
   * Get value by key
   * @param {string | number} key - key of storage
   */
  public static getItem (key: string | number): string {
    let result: string = localStorage.getItem(String(key));
    if (result === null) { result = undefined; }
    return result;
  }
  /**
   * Set value by key
   * @param key - key of storage
   * @param value - setting value
   */
  public static setItem (key: string | number, value: string | number): void {
    localStorage.setItem(String(key), String(value));
  }
}
