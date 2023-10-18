import type { Document } from "../spdx2model/document";
import * as fs from "fs/promises";
import { JsonDocument } from "../converters/json/document";

export async function writeSBOM(
  document: Document,
  location: string,
): Promise<void> {
  // TODO: Validate document
  const convertedDocument = JsonDocument.fromDocument(document);
  const content = JSON.stringify(convertedDocument, null, 2);
  await fs.writeFile(location, content);
}
