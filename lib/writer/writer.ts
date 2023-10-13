import type { Document } from '../model/document'
import * as fs from 'fs'

export function writeSBOM (document: Document, location: string): void {
  // TODO: Validate document
  const content = JSON.stringify(document, null, 2)
  fs.writeFileSync(location, content)
}
