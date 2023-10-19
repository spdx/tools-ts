import type { Package } from "./package";
import type { Relationship } from "./relationship";
import type { DocumentCreationInfo } from "./document-creation-info";
import { JsonDocument } from "../converters/json/document";
import fs from "fs/promises";

interface DocumentOptions {
  packages: Package[];
  relationships: Relationship[];
}

export class Document {
  creationInfo: DocumentCreationInfo;
  packages: Package[];
  // TODO: Implement
  files: string[];
  // TODO: Implement
  snippets: string[];
  relationships: Relationship[];

  constructor(
    creationInfo: DocumentCreationInfo,
    options?: Partial<DocumentOptions>,
  ) {
    this.creationInfo = creationInfo;
    this.packages = options?.packages ?? [];
    this.relationships = options?.relationships ?? [];
  }

  private hasMissingDescribesRelationships(): boolean {
    const hasOnlyOnePackage =
      this.packages.length === 1 &&
      this.files.length === 0 &&
      this.snippets.length === 0;
    const describesRelationships = this.relationships.filter(
      (relationship) => relationship.relationshipType === "DESCRIBES",
    );
    const describedByRelationships = this.relationships.filter(
      (relationship) => relationship.relationshipType === "DESCRIBED_BY",
    );

    return (
      !hasOnlyOnePackage &&
      !(
        describesRelationships.length > 0 || describedByRelationships.length > 0
      )
    );
  }

  private hasDuplicateSpdxIds(): boolean {
    const spdxIds: string[] = [];
    this.packages.forEach((pkg) => {
      if (spdxIds.includes(pkg.spdxId)) {
        return true;
      }
      spdxIds.push(pkg.spdxId);
    });
    // TODO: Uncomment when files and snippets are implemented
    // this.files.forEach((file) => {
    //   if (spdxIds.includes(file.spdxId)) {
    //     return true;
    //   }
    //   spdxIds.push(file.spdxId);
    // });
    // this.snippets.forEach((snippet) => {
    //   if (spdxIds.includes(snippet.spdxId)) {
    //     return true;
    //   }
    //   spdxIds.push(snippet.spdxId);
    // });
    this.relationships.forEach((relationship) => {
      if (spdxIds.includes(relationship.spdxElementId)) {
        return true;
      }
      spdxIds.push(relationship.spdxElementId);
    });
    return false;
  }

  validate(): string[] {
    const validationIssues: string[] = [];
    if (this.creationInfo.spdxVersion !== "SPDX-2.3") {
      validationIssues.concat(
        "Invalid SPDX version. Currently only SPDX-2.3 is supported.",
      );
    }
    if (this.hasMissingDescribesRelationships()) {
      validationIssues.concat(
        "Missing DESCRIBES or DESCRIBED_BY relationships.",
        "Document must have at least one DESCRIBES and one DESCRIBED_BY relationship, if there is not exactly one package present.",
      );
    }
    if (this.hasDuplicateSpdxIds()) {
      validationIssues.concat(
        "Duplicate SPDX IDs for packages, files, snippets or relationships.",
      );
    }

    return validationIssues;
  }

  async writeSBOM(location: string): Promise<void> {
    const convertedDocument = JsonDocument.fromDocument(this);
    const content = JSON.stringify(convertedDocument, null, 2);
    await fs.writeFile(location, content);
  }
}
