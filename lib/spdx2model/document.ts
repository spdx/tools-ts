// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import type { Package } from "./package";
import type { Relationship } from "./relationship";
import type { DocumentCreationInfo } from "./document-creation-info";
import { JsonDocument } from "../converters/json/document";
import fs from "fs/promises";
import type { File } from "./file";
import type { OtherLicensingInfo } from "./other-licensing-info";

export interface DocumentOptions {
  packages: Package[];
  files: File[];
  relationships: Relationship[];
  otherLicensingInfo: OtherLicensingInfo[];
}

export function itemsHaveDuplicateId(
  spdxIds: Set<string>,
  items: File[] | Package[],
): boolean {
  return items.some((item) => {
    if (spdxIds.has(item.spdxId)) {
      return true;
    }
    spdxIds.add(item.spdxId);
    return false;
  });
}

export class Document {
  creationInfo: DocumentCreationInfo;
  packages: Package[];
  files: File[];
  relationships: Relationship[];
  otherLicensingInfo: OtherLicensingInfo[];

  constructor(
    creationInfo: DocumentCreationInfo,
    options?: Partial<DocumentOptions>,
  ) {
    this.creationInfo = creationInfo;
    this.packages = options?.packages ?? [];
    this.files = options?.files ?? [];
    this.relationships = options?.relationships ?? [];
    this.otherLicensingInfo = options?.otherLicensingInfo ?? [];
  }

  private hasMissingDescribesRelationships(): boolean {
    const hasOnlyOnePackage =
      this.packages.length === 1 && this.files.length === 0;
    const describesRelationships = this.relationships.filter(
      (relationship) => relationship.relationshipType === "DESCRIBES",
    );
    const describedByRelationships = this.relationships.filter(
      (relationship) => relationship.relationshipType === "DESCRIBED_BY",
    );

    return (
      !hasOnlyOnePackage &&
      describesRelationships.length === 0 &&
      describedByRelationships.length === 0
    );
  }

  private hasDuplicateSpdxIds(): boolean {
    const spdxIds = new Set<string>([this.creationInfo.spdxId]);
    return (
      itemsHaveDuplicateId(spdxIds, this.packages) ||
      itemsHaveDuplicateId(spdxIds, this.files)
    );
  }

  collectValidationIssues(): string[] {
    const validationIssues: string[] = [];
    if (this.creationInfo.spdxVersion !== "SPDX-2.3") {
      validationIssues.push(
        "Invalid SPDX version. Currently only SPDX-2.3 is supported.",
      );
    }
    if (this.hasMissingDescribesRelationships()) {
      validationIssues.push(
        "Missing DESCRIBES or DESCRIBED_BY relationships.\n" +
          "Document must have at least one DESCRIBES and one DESCRIBED_BY relationship, if there is not exactly one package present.",
      );
    }
    if (this.hasDuplicateSpdxIds()) {
      validationIssues.push(
        "Duplicate SPDX IDs for document, packages or files.",
      );
    }

    return validationIssues;
  }

  async writeFile(location: string): Promise<void> {
    const convertedDocument = JsonDocument.fromDocument(this);
    const content = JSON.stringify(convertedDocument, null, 2);
    await fs.writeFile(location, content);
  }
}
