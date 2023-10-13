import type { Package } from './package'
import { Relationship } from './relationship'
import { writeSBOM } from '../writer/writer'

interface DocumentCreationInfoOptions {
  spdxVersion: string
  spdxId: string
  documentNamespace: string
  created: string
}

// TODO: Could live in a separate file
export class DocumentCreationInfo {
  spdxVersion: string
  spdxId: string
  name: string
  documentNamespace: string
  created: string
  creator: string
  dataLicense: string = 'CC0-1.0'

  constructor (name: string, creator: string, documentCreationInfo: Partial<DocumentCreationInfoOptions>) {
    this.spdxVersion = documentCreationInfo.spdxVersion ?? 'SPDX-2.3'
    this.spdxId = documentCreationInfo.spdxId ?? 'SPDXRef-DOCUMENT'
    this.created = documentCreationInfo.created ?? new Date().toISOString()
    this.creator = creator
    this.documentNamespace = documentCreationInfo.documentNamespace ?? 'https://my.namespace'
    this.name = name
  }
}

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

export interface CreateDocumentOptions {
  spdxVersion: string
  spdxId: string
  documentNamespace: string
  creator: string
  created: string
}

// TODO: Could be part of Document instead of inheriting from it.
export class SPDXDocument extends Document {
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
