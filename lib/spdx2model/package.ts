// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { Actor } from "./actor";
import { Checksum } from "./checksum";
import type { SpdxNone } from "./utils";
import { SpdxNoAssertion, toSpdxType, validateSpdxNoAssertion } from "./utils";
import { v4 as uuidv4 } from "uuid";
import type { AddPackageOptions, SpdxActor } from "../api/spdx-document";
import { ExternalPackageRef } from "./external-package-reference";

export interface PackageOptions {
  spdxId: string;
  version: string;
  fileName: string;
  downloadLocation: string | SpdxNoAssertion | SpdxNone;
  supplier: Actor | SpdxNoAssertion;
  originator: Actor | SpdxNoAssertion;
  filesAnalyzed: boolean;
  verificationCode: PackageVerificationCode;
  checksums: Checksum[];
  homepage: string | SpdxNoAssertion | SpdxNone;
  sourceInfo: string;
  licenseConcluded: string | SpdxNoAssertion | SpdxNone;
  licenseInfoFromFiles: Array<string | SpdxNoAssertion | SpdxNone>;
  licenseDeclared: string | SpdxNoAssertion | SpdxNone;
  licenseComment: string;
  copyrightText: string | SpdxNoAssertion | SpdxNone;
  summary: string;
  description: string;
  comment: string;
  externalReferences: ExternalPackageRef[];
  attributionTexts: string[];
  primaryPackagePurpose: PackagePurpose;
  releaseDate: Date;
  builtDate: Date;
  validUntilDate: Date;
}

export enum PackagePurpose {
  APPLICATION = "APPLICATION",
  FRAMEWORK = "FRAMEWORK",
  LIBRARY = "LIBRARY",
  CONTAINER = "CONTAINER",
  OPERATING_SYSTEM = "OPERATING_SYSTEM",
  DEVICE = "DEVICE",
  FIRMWARE = "FIRMWARE",
  SOURCE = "SOURCE",
  ARCHIVE = "ARCHIVE",
  FILE = "FILE",
  INSTALL = "INSTALL",
  OTHER = "OTHER",
}

export interface PackageVerificationCode {
  value: string;
  excludedFiles?: string[];
}

export function formatPackagePurpose(purpose: string): PackagePurpose {
  const packagePurpose = PackagePurpose[purpose as keyof typeof PackagePurpose];
  if (!packagePurpose) {
    throw new Error("Invalid package purpose: " + purpose);
  }
  return packagePurpose;
}

export function formatVendor(
  vendor: SpdxActor | string | undefined,
): Actor | SpdxNoAssertion | undefined {
  if (!vendor) {
    return undefined;
  } else if (typeof vendor === "string") {
    const spdxVendor = toSpdxType(vendor);
    validateSpdxNoAssertion(spdxVendor);
    return spdxVendor;
  } else {
    const spdxVendor = Actor.fromSpdxActor(vendor);
    validateVendorType(spdxVendor);
    return spdxVendor;
  }
}

export function validateVendorType(vendor: Actor): void {
  if (vendor.type !== "Organization" && vendor.type !== "Person") {
    throw new Error(`Invalid vendor type: ${vendor.type}`);
  }
}

export class Package {
  name: string;
  downloadLocation: string | SpdxNoAssertion | SpdxNone;
  spdxId: string;
  version?: string;
  fileName?: string;
  supplier?: Actor | SpdxNoAssertion;
  originator?: Actor | SpdxNoAssertion;
  filesAnalyzed: boolean;
  verificationCode?: PackageVerificationCode;
  checksums: Checksum[];
  homepage?: string | SpdxNoAssertion | SpdxNone;
  sourceInfo?: string;
  licenseConcluded?: string | SpdxNoAssertion | SpdxNone;
  licenseInfoFromFiles: Array<string | SpdxNoAssertion | SpdxNone>;
  licenseDeclared?: string | SpdxNoAssertion | SpdxNone;
  licenseComment?: string;
  copyrightText?: string | SpdxNoAssertion | SpdxNone;
  summary?: string;
  description?: string;
  comment?: string;
  externalReferences: ExternalPackageRef[];
  attributionTexts: string[];
  primaryPackagePurpose?: PackagePurpose;
  releaseDate?: Date;
  builtDate?: Date;
  validUntilDate?: Date;

  constructor(name: string, options?: Partial<PackageOptions>) {
    this.name = name;
    this.downloadLocation = options?.downloadLocation ?? new SpdxNoAssertion();
    this.spdxId = options?.spdxId ?? "SPDXRef-" + uuidv4();
    this.version = options?.version ?? undefined;
    this.fileName = options?.fileName ?? undefined;
    this.supplier = options?.supplier ?? undefined;
    this.originator = options?.originator ?? undefined;
    this.filesAnalyzed = options?.filesAnalyzed ?? false;
    this.verificationCode = options?.verificationCode ?? undefined;
    this.checksums = options?.checksums ?? [];
    this.homepage = options?.homepage ?? undefined;
    this.sourceInfo = options?.sourceInfo ?? undefined;
    this.licenseConcluded = options?.licenseConcluded ?? undefined;
    this.licenseInfoFromFiles = options?.licenseInfoFromFiles ?? [];
    this.licenseDeclared = options?.licenseDeclared ?? undefined;
    this.licenseComment = options?.licenseComment ?? undefined;
    this.copyrightText = options?.copyrightText ?? undefined;
    this.summary = options?.summary ?? undefined;
    this.description = options?.description ?? undefined;
    this.comment = options?.comment ?? undefined;
    this.externalReferences = options?.externalReferences ?? [];
    this.attributionTexts = options?.attributionTexts ?? [];
    this.primaryPackagePurpose = options?.primaryPackagePurpose ?? undefined;
    this.releaseDate = options?.releaseDate ?? undefined;
    this.builtDate = options?.builtDate ?? undefined;
    this.validUntilDate = options?.validUntilDate ?? undefined;
  }

  static fromApi(name: string, options?: Partial<AddPackageOptions>): Package {
    return new Package(name, {
      spdxId: options?.spdxId,
      version: options?.version,
      fileName: options?.fileName,
      downloadLocation:
        options?.downloadLocation && toSpdxType(options.downloadLocation),
      supplier: formatVendor(options?.supplier),
      originator: formatVendor(options?.originator),
      filesAnalyzed: options?.filesAnalyzed,
      verificationCode: options?.verificationCode,
      checksums:
        options?.checksums && Checksum.fromSpdxChecksums(options.checksums),
      homepage: options?.homepage && toSpdxType(options.homepage),
      sourceInfo: options?.sourceInfo,
      licenseConcluded:
        options?.licenseConcluded && toSpdxType(options.licenseConcluded),
      licenseInfoFromFiles: options?.licenseInfoFromFiles?.map((license) =>
        toSpdxType(license),
      ),
      licenseDeclared:
        options?.licenseDeclared && toSpdxType(options.licenseDeclared),
      licenseComment: options?.licenseComment,
      copyrightText:
        options?.copyrightText && toSpdxType(options.copyrightText),
      summary: options?.summary,
      description: options?.description,
      comment: options?.comment,
      externalReferences:
        options?.externalReferences &&
        ExternalPackageRef.fromSpdxExternalPackageRefs(
          options.externalReferences,
        ),
      attributionTexts: options?.attributionTexts,
      primaryPackagePurpose: options?.primaryPackagePurpose
        ? formatPackagePurpose(options.primaryPackagePurpose)
        : undefined,
      releaseDate: options?.releaseDate,
      builtDate: options?.builtDate,
      validUntilDate: options?.validUntilDate,
    });
  }
}
