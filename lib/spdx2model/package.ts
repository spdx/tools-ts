import type { Actor } from "./actor";
import type { Checksum } from "./checksum";
import type { SpdxNone } from "./spdx-types";
import {
  SpdxNoAssertion,
  toSpdxType,
  validateSpdxNoAssertion,
} from "./spdx-types";
import { v4 as uuidv4 } from "uuid";

interface PackageOptions {
  spdxId: string;
  version: string;
  fileName: string;
  downloadLocation: string;
  supplier: Actor | string;
  originator: Actor | string;
  filesAnalyzed: boolean;
  verificationCode: PackageVerificationCode;
  checksums: Checksum[];
  homepage: string;
  sourceInfo: string;
  licenseConcluded: string;
  licenseInfoFromFiles: string[];
  licenseDeclared: string;
  licenseComment: string;
  copyrightText: string;
  summary: string;
  description: string;
  comment: string;
  externalReferences: string[];
  attributionTexts: string[];
  primaryPackagePurpose: PackagePurpose;
  releaseDate: Date;
  builtDate: Date;
  validUntilDate: Date;
}

enum PackagePurpose {
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

function formatVendor(
  vendor: Actor | string | undefined,
): Actor | SpdxNoAssertion | undefined {
  if (!vendor) {
    return undefined;
  } else if (typeof vendor === "string") {
    const spdxVendor = toSpdxType(vendor);
    validateSpdxNoAssertion(spdxVendor);
    return spdxVendor;
  } else {
    return vendor;
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
  // TODO: Implement LicenseExpression class
  licenseConcluded?: string | SpdxNoAssertion | SpdxNone;
  licenseInfoFromFiles: Array<string | SpdxNoAssertion | SpdxNone>;
  licenseDeclared?: string | SpdxNoAssertion | SpdxNone;
  licenseComment?: string;
  copyrightText?: string | SpdxNoAssertion | SpdxNone;
  summary?: string;
  description?: string;
  comment?: string;
  // TODO: Implement ExternalPackageRef class
  externalReferences: string[];
  attributionTexts: string[];
  primaryPackagePurpose?: PackagePurpose;
  releaseDate?: Date;
  builtDate?: Date;
  validUntilDate?: Date;

  constructor(name: string, options?: Partial<PackageOptions>) {
    this.name = name;
    this.downloadLocation = options?.downloadLocation
      ? toSpdxType(options.downloadLocation)
      : new SpdxNoAssertion();
    this.spdxId = options?.spdxId ?? "SPDXRef-" + uuidv4();
    this.version = options?.version ?? undefined;
    this.fileName = options?.fileName ?? undefined;
    this.supplier = formatVendor(options?.supplier);
    this.originator = formatVendor(options?.originator);
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
}
