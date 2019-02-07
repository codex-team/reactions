const Fingerprint2 = require('fingerprintjs2');

// 87a8f6c9b54915290579537bc0994a4d

export default class Fingerprint {
  public static getFingerprint (): Promise<string> {
    return new Promise((resolve, reject) => {
      Fingerprint2.get((components) => {
        console.log(components); // an array of components: {key: ..., value: ...}
        let values = components.map((component) => {
          return component.value;
        });
        let murmurHash = Fingerprint2.x64hash128(values.join(''), 31);
        console.log(murmurHash);
        resolve(murmurHash);
      });
    });
  }

}
