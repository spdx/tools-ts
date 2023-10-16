import type { Document } from '../../spdx2model/document'
import type { Checksum, Package } from '../../spdx2model/package'
import type { Relationship } from '../../spdx2model/relationship'

export class JsonDocument {
  SPDXID: string
  spdxVersion: string
  name: string
  documentNamespace: string
  dataLicense: string
  creationInfo: JsonDocumentCreationInfo
  packages: JsonPackage[]
  relationships: JsonRelationship[]
  externalDocumentRefs?: string
  comment?: string

  constructor (spdxID: string,
    spdxVersion: string,
    name: string,
    documentNamespace: string,
    dataLicense: string,
    creationInfo: JsonDocumentCreationInfo,
    packages: JsonPackage[],
    relationships: JsonRelationship[],
    externalDocumentRefs?: string,
    comment?: string) {
    this.SPDXID = spdxID
    this.spdxVersion = spdxVersion
    this.name = name
    this.documentNamespace = documentNamespace
    this.dataLicense = dataLicense
    this.externalDocumentRefs = externalDocumentRefs
    this.comment = comment
    this.creationInfo = creationInfo
    this.packages = packages
    this.relationships = relationships
  }

  static fromDocument (document: Document): JsonDocument {
    const jsonCreationInfo: JsonDocumentCreationInfo = JsonDocumentCreationInfo.fromDocument(document)
    const jsonPackages: JsonPackage[] = document.packages.map(pkg => JsonPackage.fromPackage(pkg))
    const jsonRelationships: JsonRelationship[] = document.relationships.map(relationship => JsonRelationship.fromRelationship(relationship))

    return new JsonDocument(
      document.creationInfo.spdxId,
      document.creationInfo.spdxVersion,
      document.creationInfo.name,
      document.creationInfo.documentNamespace,
      document.creationInfo.dataLicense,
      jsonCreationInfo,
      jsonPackages,
      jsonRelationships
    )
  }
}

export class JsonDocumentCreationInfo {
  created: string
  creators: string[]
  comment?: string
  licenseListVersion?: string

  constructor (created: string, creators: string[], comment?: string, licenseListVersion?: string) {
    this.created = created
    this.creators = creators
    this.comment = comment
    this.licenseListVersion = licenseListVersion
  }

  static fromDocument (document: Document): JsonDocumentCreationInfo {
    return new JsonDocumentCreationInfo(
      document.creationInfo.created,
      document.creationInfo.creators
    )
  }
}

export class JsonPackage {
  name: string
  downloadLocation: string
  SPDXID: string
  filesAnalyzed: boolean
  checksums: JsonChecksum[]
  licenseInfoFromFiles: string[]
  externalRefs: string[]
  attributionTexts: string[]

  constructor (name: string,
    downloadLocation: string,
    SPDXID: string,
    filesAnalyzed: boolean,
    checksums: JsonChecksum[],
    licenseInfoFromFiles: string[],
    externalRefs: string[],
    attributionTexts: string[]) {
    this.name = name
    this.downloadLocation = downloadLocation
    this.SPDXID = SPDXID
    this.filesAnalyzed = filesAnalyzed
    this.checksums = checksums
    this.licenseInfoFromFiles = licenseInfoFromFiles
    this.externalRefs = externalRefs
    this.attributionTexts = attributionTexts
  }

  static fromPackage (pkg: Package): JsonPackage {
    const jsonChecksums: JsonChecksum[] = pkg.checksums.map(checksum => JsonChecksum.fromChecksum(checksum))

    return new JsonPackage(
      pkg.name,
      pkg.downloadLocation.toString(),
      pkg.spdxId,
      pkg.filesAnalyzed,
      jsonChecksums,
      // TODO: Fill in licenseInfoFromFiles
      [],
      [],
      []
    )
  }
}

export class JsonChecksum {
  algorithm: string
  checksumValue: string

  constructor (algorithm: string, checksumValue: string) {
    this.algorithm = algorithm
    this.checksumValue = checksumValue
  }

  static fromChecksum (checksum: Checksum): JsonChecksum {
    return new JsonChecksum(
      checksum.algorithm,
      checksum.value
    )
  }
}

export class JsonRelationship {
  spdxElementId: string
  relatedSpdxElement: string
  relationshipType: string
  comment?: string

  constructor (spdxElementId: string, relatedSpdxElement: string, relationshipType: string, comment?: string) {
    this.spdxElementId = spdxElementId
    this.comment = comment
    this.relatedSpdxElement = relatedSpdxElement
    this.relationshipType = relationshipType
  }

  static fromRelationship (relationship: Relationship): JsonRelationship {
    return new JsonRelationship(
      relationship.spdxElementId,
      relationship.relatedSpdxElementId,
      relationship.relationshipType
    )
  }
}
