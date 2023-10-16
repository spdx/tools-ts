export class Checksum {
  algorithm: string;
  value: string;

  constructor(algorithm: string, value: string) {
    this.algorithm = algorithm;
    this.value = value;
  }

  toString(): string {
    return this.algorithm + ": " + this.value;
  }
}
