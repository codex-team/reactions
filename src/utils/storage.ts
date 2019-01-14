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
    return localStorage.getItem(key.toString()) || undefined;
  }
  /**
   * Set value by key
   * @param key - key of storage
   * @param value - setting value
   */
  public static setItem (key: string | number, value: string | number): void {
    localStorage.setItem(key.toString(), String(value));
  }

  public static removeItem (key: string | number): void {
    localStorage.removeItem(key.toString());
  }
}
