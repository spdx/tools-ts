import { DocumentCreationInfo } from "../document-creation-info";
import { Actor, ActorType } from "../actor";

test("Add data license to document when initiating", () => {
  const documentCreationInfo = new DocumentCreationInfo(
    "my name",
    "my namespace",
    new Actor("the creator", ActorType.Person),
    {
      spdxVersion: "2.3",
      created: new Date(),
    },
  );
  expect(documentCreationInfo.dataLicense).toBe("CC0-1.0");
});
