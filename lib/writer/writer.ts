import type { Document } from '../spdx2model/document'
import * as fs from 'fs'
import { convertDocument } from '../converters/json/converter'

export function writeSBOM (document: Document, location: string): void {
  // TODO: Validate document
  const convertedDocument = convertDocument(document)
  const content = JSON.stringify(convertedDocument, null, 2)
  fs.writeFileSync(location, content)
}
