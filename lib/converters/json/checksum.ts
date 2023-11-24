// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { Checksum } from "../../spdx2model/checksum";

export class JsonChecksum {
  algorithm: string;
  checksumValue: string;

  constructor(algorithm: string, checksumValue: string) {
    this.algorithm = algorithm;
    this.checksumValue = checksumValue;
  }

  static fromChecksum(checksum: Checksum): JsonChecksum {
    return new JsonChecksum(checksum.algorithm, checksum.value);
  }
}
