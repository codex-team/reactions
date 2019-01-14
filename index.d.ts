/**
 * Module configuration
 */
export interface ReactionsConfig {
  /** Selector of root element */
  parent: string;

  /** Array of emoji symbols */
  reactions: string[];

  /** Title text */
  title?: string;

  /** Id for module */
  id?: string | number;
}

declare class Reactions {
  /**
   * Current user id
   */
  static userId: number | string;

  constructor(config: ReactionsConfig)

  /**
   * Set current user id
   * @param {string | number} id
   */
  static setUserId(id: string | number);
}

export as namespace Reactions;
export default Reactions;
