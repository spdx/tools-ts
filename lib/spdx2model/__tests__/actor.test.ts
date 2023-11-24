// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { Actor, ActorType } from "../actor";

describe("Actor", () => {
  it("Creates correct actor from api", () => {
    const testName = "name";
    const testType = "Person";
    expect(
      Actor.fromSpdxActor({ name: testName, type: testType }),
    ).toStrictEqual(new Actor(testName, ActorType.Person));
  });

  it("Throws for invalid actor type from api", () => {
    expect(() =>
      Actor.fromSpdxActor({ name: "name", type: "invalid" }),
    ).toThrow("Invalid actor type: invalid");
  });

  it("Creates multiple correct actors from api", () => {
    const testName = "name";
    const testType = "Person";
    expect(
      Actor.fromSpdxActors([{ name: testName, type: testType }]),
    ).toStrictEqual([new Actor(testName, ActorType.Person)]);
  });

  it("Provides tools actor", () => {
    expect(Actor.tools()).toStrictEqual(
      new Actor("SPDX Tools TS", ActorType.Tool),
    );
  });

  it("Converts to serializable string", () => {
    expect(
      new Actor("name", ActorType.Person, "test@mail.com").toString(),
    ).toStrictEqual("Person: name (test@mail.com)");
  });
});
