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

  /**
   * Returns a function, that, as long as it continues to be invoked, will not
   * be triggered. The function will be called after it stops being called for
   * N milliseconds. If `immediate` is passed, trigger the function on the
   * leading edge, instead of the trailing. From Underscore.js
   */
  public static debounce (func: any, wait: number, immediate: boolean = false) {
    let timeout;
    return function () {
      let context = this;
      let args = arguments;

      let later = () => {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };

      if (immediate && !timeout) {
        func.apply(context, args);
      }

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}
