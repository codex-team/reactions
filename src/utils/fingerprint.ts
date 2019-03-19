const Fingerprint2 = require('fingerprintjs2');

export default class Fingerprint {
  public static getFingerprint (): Promise<string> {
    return new Promise((resolve, reject) => {
      Fingerprint2.get((components) => {
        let values = components.map((component) => {
          return component.value;
        });
        let murmurHash = Fingerprint2.x64hash128(values.join(''), 31);
        resolve(murmurHash);
      });
    });
  }

}
