export class Checksum {
  algorithm: string;
  value: string;

  constructor(algorithm: string, value: string) {
    this.algorithm = algorithm;
    this.value = value;
  }
}
