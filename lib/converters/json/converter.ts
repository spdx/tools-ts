import type { Document } from '../../spdx2model/document'
import { JsonChecksum, JsonDocument, JsonDocumentCreationInfo, JsonPackage, JsonRelationship } from './schema'

export function convertDocument (document: Document): JsonDocument {
  const jsonCreationInfo = new JsonDocumentCreationInfo(
    document.creationInfo.created,
    document.creationInfo.creators
  )

  const jsonPackages: JsonPackage[] = []
  document.packages.forEach((pkg) => {
    const jsonChecksums: JsonChecksum[] = []
    pkg.checksums.forEach((checksum) => {
      jsonChecksums.push(new JsonChecksum(
        checksum.algorithm,
        checksum.value
      ))
    })

    jsonPackages.push(new JsonPackage(
      pkg.name,
      pkg.downloadLocation.toString(),
      pkg.spdxId,
      pkg.filesAnalyzed,
      jsonChecksums,
      // TODO: Fill in licenseInfoFromFiles
      [],
      [],
      []
    ))
  })

  const jsonRelationships: JsonRelationship[] = []
  document.relationships.forEach((relationship) => {
    jsonRelationships.push(new JsonRelationship(
      relationship.spdxElementId,
      relationship.relatedSpdxElementId,
      relationship.relationshipType
    ))
  })

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
