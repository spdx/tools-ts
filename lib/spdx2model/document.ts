import type { Package } from './package'
import { Relationship } from './relationship'
import { writeSBOM } from '../writer/writer'
import { DocumentCreationInfo } from './document-creation-info'
import type { DocumentCreationInfoOptions } from './document-creation-info'

interface DocumentOptions {
  packages: Package[]
  relationships: Relationship[]
}

export class Document {
  creationInfo: DocumentCreationInfo
  packages: Package[]
  relationships: Relationship[]

  constructor (creationInfo: DocumentCreationInfo, options?: Partial<DocumentOptions>) {
    this.creationInfo = creationInfo
    this.packages = options?.packages ?? []
    this.relationships = options?.relationships ?? []
  }
}

// TODO: Could be part of Document instead of inheriting from it.
export class SPDXDocument extends Document {
  static createDocument (name: string, namespace: string, creator: string, options?: Partial<DocumentCreationInfoOptions>): SPDXDocument {
    const creationInfo = new DocumentCreationInfo(
      name,
      namespace,
      creator,
      options)
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
