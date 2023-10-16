import type { Document } from "../../spdx2model/document";
import { JsonDocumentCreationInfo } from "./document-creation-info";
import { JsonPackage } from "./package";
import { JsonRelationship } from "./relationship";

export class JsonDocument {
  SPDXID: string;
  spdxVersion: string;
  name: string;
  documentNamespace: string;
  dataLicense: string;
  creationInfo: JsonDocumentCreationInfo;
  packages: JsonPackage[];
  relationships: JsonRelationship[];
  externalDocumentRefs?: string;
  comment?: string;

  constructor(
    spdxID: string,
    spdxVersion: string,
    name: string,
    documentNamespace: string,
    dataLicense: string,
    creationInfo: JsonDocumentCreationInfo,
    packages: JsonPackage[],
    relationships: JsonRelationship[],
    externalDocumentRefs?: string,
    comment?: string,
  ) {
    this.SPDXID = spdxID;
    this.spdxVersion = spdxVersion;
    this.name = name;
    this.documentNamespace = documentNamespace;
    this.dataLicense = dataLicense;
    this.externalDocumentRefs = externalDocumentRefs;
    this.comment = comment;
    this.creationInfo = creationInfo;
    this.packages = packages;
    this.relationships = relationships;
  }

  static fromDocument(document: Document): JsonDocument {
    const jsonCreationInfo: JsonDocumentCreationInfo =
      JsonDocumentCreationInfo.fromDocument(document);
    const jsonPackages: JsonPackage[] = document.packages.map((pkg) =>
      JsonPackage.fromPackage(pkg),
    );
    const jsonRelationships: JsonRelationship[] = document.relationships.map(
      (relationship) => JsonRelationship.fromRelationship(relationship),
    );

    return new JsonDocument(
      document.creationInfo.spdxId,
      document.creationInfo.spdxVersion,
      document.creationInfo.name,
      document.creationInfo.documentNamespace,
      document.creationInfo.dataLicense,
      jsonCreationInfo,
      jsonPackages,
      jsonRelationships,
    );
  }
}
