import { Document, DocumentCreationInfo } from './model/document'
import { writeSBOM } from './writer/writer'
import type { Package } from './model/package'
import { Relationship } from './model/relationship'

interface CreateDocumentOptions {
  spdxVersion: string
  spdxId: string
  documentNamespace: string
  creator: string
  created: string
}

class SPDXDocument extends Document {
  static createDocument (name: string, creator: string, options?: Partial<CreateDocumentOptions>): SPDXDocument {
    const creationInfo = new DocumentCreationInfo(
      name,
      creator,
      {
        spdxVersion: options?.spdxVersion,
        spdxId: options?.spdxId,
        documentNamespace: options?.documentNamespace,
        created: options?.created
      })
    return new SPDXDocument(creationInfo)
  }

  addRelationships (relationships: Relationship[]): void {
    this.relationships = this.relationships.concat(relationships)
  }

  addPackages (packages: Package[]): void {
    this.packages = this.packages.concat(packages)
    packages.forEach((pkg: Package) => {
      this.addRelationships([new Relationship(this.creationInfo.spdxId, 'DESCRIBES', pkg.spdxId)])
    })
  }

  write (location: string): void {
    writeSBOM(this, location)
  }
}

const sbom = SPDXDocument

export default sbom
