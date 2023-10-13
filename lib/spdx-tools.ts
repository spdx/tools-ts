import { SPDXDocument as SPDX2Document } from './spdx2model/document'
import type { CreateDocumentOptions } from './spdx2model/document'

function parseMajorVersion (spdxVersion: string): number {
  return parseInt(spdxVersion.split('.')[0])
}

class SPDXProject {
  public static createDocument (spdxVersion: string, name: string, creator: string, options?: Partial<CreateDocumentOptions>): SPDX2Document {
    if (parseMajorVersion(spdxVersion) === 2) {
      return SPDX2Document.createDocument(name, creator, options)
    } else {
      throw new Error('Unsupported SPDX version')
    }
  }
}

const spdx = SPDXProject

export default spdx
