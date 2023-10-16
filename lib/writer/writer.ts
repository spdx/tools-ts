import type { Document } from "../spdx2model/document";
import * as fs from "fs";
import { JsonDocument } from "../converters/json/schema";

export function writeSBOM(document: Document, location: string): void {
  // TODO: Validate document
  const convertedDocument = JsonDocument.fromDocument(document);
  const content = JSON.stringify(convertedDocument, null, 2);
  fs.writeFileSync(location, content);
}
