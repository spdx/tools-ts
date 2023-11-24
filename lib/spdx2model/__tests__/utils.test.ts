// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import {
  SpdxNoAssertion,
  SpdxNone,
  toSpdxType,
  validateSpdxNoAssertion,
} from "../utils";

describe("toSpdxType", () => {
  it("Returns SpdxNoAssertion for NOASSERTION", () => {
    expect(toSpdxType("NOASSERTION")).toStrictEqual(new SpdxNoAssertion());
  });

  it("Returns SpdxNone for NONE", () => {
    expect(toSpdxType("NONE")).toStrictEqual(new SpdxNone());
  });

  it("Returns the default converter", () => {
    expect(toSpdxType("test")).toBe("test");
  });

  it("Returns the custom converter", () => {
    const testValue = "test";
    const testConverter = (entry: string): string => {
      return entry + " converter";
    };
    expect(toSpdxType(testValue, testConverter)).toBe("test converter");
  });
});

describe("validateSpdxNoAssertion", () => {
  it("Throws for string", () => {
    expect(() => {
      validateSpdxNoAssertion("test");
    }).toThrow("Invalid entry: test is not allowed.");
  });

  it("Throws for SPDX none type", () => {
    expect(() => {
      validateSpdxNoAssertion(new SpdxNone());
    }).toThrow("Invalid entry: NONE is not allowed.");
  });

  it("Does not throw for SPDX no assertion type", () => {
    expect(() => {
      validateSpdxNoAssertion(new SpdxNoAssertion());
    }).not.toThrow();
  });
});
