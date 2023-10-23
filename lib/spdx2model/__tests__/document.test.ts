import { DocumentCreationInfo } from "../document-creation-info";
import { Actor, ActorType } from "../actor";

test("Add data license to document when initiating", () => {
  const documentCreationInfo = new DocumentCreationInfo(
    "SPDX-2.3",
    "my name",
    "urn:namespace:9c297b20-a92e-4f58-822d-8b83ef105384",
    [new Actor("the creator", ActorType.Person)],
    new Date(),
    {
      created: new Date(),
    },
  );

  expect(documentCreationInfo.dataLicense).toBe("CC0-1.0");
});
