// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { PackageVerificationCode } from "../../spdx2model/package";

export class JsonPackageVerificationCode {
  packageVerificationCodeValue: string;
  packageVerificationCodeExcludedFiles?: string[];

  constructor(
    packageVerificationCodeValue: string,
    packageVerificationCodeExcludedFiles?: string[],
  ) {
    this.packageVerificationCodeValue = packageVerificationCodeValue;
    this.packageVerificationCodeExcludedFiles =
      packageVerificationCodeExcludedFiles;
  }

  static fromPackageVerificationCode(
    packageVerificationCode: PackageVerificationCode,
  ): JsonPackageVerificationCode {
    return new JsonPackageVerificationCode(
      packageVerificationCode.value,
      packageVerificationCode.excludedFiles,
    );
  }
}
