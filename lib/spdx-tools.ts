import { SPDXDocument as SPDX2Document } from './spdx2model/document'
import type { DocumentCreationInfoOptions } from './spdx2model/document-creation-info'

function parseMajorVersion (spdxVersion: string): number {
  return parseInt(spdxVersion.split('.')[0])
}

class SPDXProject {
  public static createDocument (name: string, namespace: string, creator: string, options?: Partial<DocumentCreationInfoOptions>): SPDX2Document {
    const spdxVersion = options?.spdxVersion
    if (spdxVersion && parseMajorVersion(spdxVersion) === 2) {
      return SPDX2Document.createDocument(name, namespace, creator, options)
    } else {
      throw new Error('Unsupported SPDX version')
    }
  }
}

const spdx = SPDXProject

export default spdx
