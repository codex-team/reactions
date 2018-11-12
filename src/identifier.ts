import * as md5 from 'md5';

/**
 * @class Identifier
 * @classdesc Representing identifier for Reactions module
 */
export default class Identifier {

  private id: string;
  /**
   * Create an identifier for Reactions module
   * If id is undefined, URL will be hashed with md5 and used as id
   * @param id {string} - User id for Reactions module.
   */
  public constructor (id) {
    if (id === undefined) {
      this.id = md5(this.getURL());
    } else {
      this.id = id;
    }
  }

  /**
   * Returns URL, where this Reactions module located
   * @returns {string}
   */
  private getURL(): string {
    return document.location.href;
  }

  /**
   * Returns instance of Identifier in JSON.
   * @returns {string}
   */
  public toJSON() {
    return this.id;
  }

  /**
   * Returns instance of Identifier in string.
   * @returns {string}
   */
  public toString() {
    return this.id;
  }
}