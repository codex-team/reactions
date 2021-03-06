/**
 * @class Identifier
 * @classdesc Representing identifier for Reactions module
 */
export default class Identifier {

  private id: string | number;
  /**
   * Create an identifier for Reactions module
   * If id is undefined, URL will be hashed with md5 and used as id
   * @param id {string} - User id for Reactions module.
   */
  public constructor (id?: string | number) {
    this.id = id || this.getURL();
  }

  /**
   * Returns URL, where this Reactions module located
   * @returns {string}
   */
  private getURL (): string {
    return document.location.host + document.location.pathname;
  }

  /**
   * Returns string representation of Identifier for JSON serializing
   * @returns {string}
   */
  public toJSON (): string {
    return String(this.id);
  }

  /**
   * Returns string representation of Identifier
   * @returns {string}
   */
  public toString (): string {
    return String(this.id);
  }
}
