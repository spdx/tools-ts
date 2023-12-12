// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { RelationshipOptions } from "../spdx2model/relationship";
import { Relationship } from "../spdx2model/relationship";
import type { PackageVerificationCode } from "../spdx2model/package";
import { Package } from "../spdx2model/package";
import { Document } from "../spdx2model/document";
import { DocumentCreationInfo } from "../spdx2model/document-creation-info";
import { File } from "../spdx2model/file";
import { OtherLicensingInfo } from "../spdx2model/other-licensing-info";

export interface SpdxActor {
  name: string;
  type: string;
  email?: string;
}

export interface SpdxDocumentReference {
  documentRefId: string;
  documentUri: string;
  checksumValue: string;
  checksumAlgorithm: string;
}

export interface SpdxChecksum {
  checksumValue: string;
  checksumAlgorithm: string;
}

export interface SpdxExternalPackageReference {
  referenceType: string;
  referenceLocator: string;
  referenceCategory: string;
  comment?: string;
}

export interface CreateDocumentOptions {
  spdxVersion: string;
  spdxId: string;
  creators: SpdxActor | SpdxActor[];
  created: Date;
  namespace: string;
  externalDocumentRefs: SpdxDocumentReference[];
  creatorComment: string;
  licenseListVersion: string;
  documentComment: string;
}

export interface AddPackageOptions {
  downloadLocation: string;
  spdxId: string;
  version: string;
  fileName: string;
  supplier?: SpdxActor | string;
  originator?: SpdxActor | string;
  filesAnalyzed: boolean;
  verificationCode: PackageVerificationCode;
  checksums: SpdxChecksum[];
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
  externalReferences: SpdxExternalPackageReference[];
  attributionTexts: string[];
  primaryPackagePurpose: string;
  releaseDate: Date;
  builtDate: Date;
  validUntilDate: Date;
}

export interface AddFileOptions {
  spdxId: string;
  fileTypes: string[];
  licenseConcluded: string;
  licenseInfoInFiles: string[];
  licenseComment: string;
  copyrightText: string;
  comment: string;
  notice: string;
  contributors: string[];
  attributionTexts: string[];
}

export interface AddOtherLicensingInfoOptions {
  licenseId: string;
  extractedText: string;
  licenseName: string;
  crossReferences: string[];
  comment: string;
}

export class SPDXDocument extends Document {
  static createDocument(
    name: string,
    options?: Partial<CreateDocumentOptions>,
  ): SPDXDocument {
    const creationInfo = DocumentCreationInfo.fromApi(name, options);
    return new SPDXDocument(creationInfo);
  }

  addPackage(name: string, options?: Partial<AddPackageOptions>): Package {
    const pkg = Package.fromApi(name, options);
    this.packages.push(pkg);
    return pkg;
  }

  addFile(
    name: string,
    checksums: [SpdxChecksum] | SpdxChecksum,
    options?: Partial<AddFileOptions>,
  ): File {
    const file = File.fromApi(name, checksums, options);
    this.files.push(file);
    return file;
  }

  addRelationship(
    spdxElement: Document | Package | File | string,
    relatedSpdxElement: Document | Package | File | string,
    relationshipType: string,
    options?: Partial<RelationshipOptions>,
  ): this {
    const relationship = Relationship.fromApi(
      spdxElement,
      relatedSpdxElement,
      relationshipType,
      options,
    );
    this.relationships.push(relationship);
    return this;
  }

  addOtherLicensingInformation(
    options?: Partial<AddOtherLicensingInfoOptions>,
  ): this {
    const otherLicensingInfo = OtherLicensingInfo.fromApi(options);
    this.otherLicensingInfo.push(otherLicensingInfo);
    return this;
  }

  validate(allowInvalid: boolean = true): void {
    const validationIssues = this.collectValidationIssues();
    if (validationIssues.length > 0) {
      const validationMessage =
        "Document is invalid: " + validationIssues.join("\n");
      if (!allowInvalid) {
        throw new Error(validationMessage);
      }
      console.error(validationMessage);
    }
  }

  async write(location: string, allowInvalid: boolean = false): Promise<void> {
    this.validate(allowInvalid);
    await this.writeFile(location);
  }

  writeSync(location: string, allowInvalid: boolean = false): void {
    this.validate(allowInvalid);
    this.writeFile(location)
      .then(() => {
        console.log("Wrote SBOM successfully: " + location);
      })
      .catch((error) => {
        console.error("Error writing sample SBOM: " + error);
      });
  }
}
