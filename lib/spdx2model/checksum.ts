// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { SpdxChecksum } from "../api/spdx-document";

export enum ChecksumAlgorithm {
  "SHA1" = "SHA1",
  "BLAKE3" = "BLAKE3",
  "SHA3-384" = "SHA3-384",
  "SHA256" = "SHA256",
  "SHA384" = "SHA384",
  "BLAKE2b-512" = "BLAKE2b-512",
  "BLAKE2b-256" = "BLAKE2b-256",
  "SHA3-512" = "SHA3-512",
  "MD2" = "MD2",
  "ADLER32" = "ADLER32",
  "MD4" = "MD4",
  "SHA3-256" = "SHA3-256",
  "BLAKE2b-384" = "BLAKE2b-384",
  "SHA512" = "SHA512",
  "MD6" = "MD6",
  "MD5" = "MD5",
  "SHA224" = "SHA224",
}

export class Checksum {
  algorithm: ChecksumAlgorithm;
  value: string;

  constructor(algorithm: ChecksumAlgorithm, value: string) {
    this.algorithm = algorithm;
    this.value = value;
  }

  static fromSpdxChecksum(checksum: SpdxChecksum): Checksum {
    const checksumAlgorithm =
      ChecksumAlgorithm[
        checksum.checksumAlgorithm as keyof typeof ChecksumAlgorithm
      ];
    if (!checksumAlgorithm) {
      throw new Error(
        "Invalid checksum algorithm: " + checksum.checksumAlgorithm,
      );
    }
    return new Checksum(checksumAlgorithm, checksum.checksumValue);
  }

  static fromSpdxChecksums(
    checksums: SpdxChecksum[] | SpdxChecksum,
  ): Checksum[] {
    if (Array.isArray(checksums)) {
      return checksums.map((checksum) => Checksum.fromSpdxChecksum(checksum));
    } else {
      return [Checksum.fromSpdxChecksum(checksums)];
    }
  }
}
