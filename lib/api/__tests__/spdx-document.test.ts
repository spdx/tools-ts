import { SPDXDocument } from "../spdx-document";

test("generates valid namespace from document name", () => {
  const documentName = "-!+My:first test-Name";
  const document = SPDXDocument.createDocument(documentName, {
    name: "test creator",
    type: "Person",
  });
  expect(document.creationInfo.documentNamespace.substring(0, 23)).toBe(
    "urn:My-first-test-Name",
  );
});
