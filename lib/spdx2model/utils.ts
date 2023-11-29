// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

export const NOASSERTION = "NOASSERTION";
export const NONE = "NONE";

export class SpdxNoAssertion {
  toString(): string {
    return NOASSERTION;
  }
}

export class SpdxNone {
  toString(): string {
    return NONE;
  }
}

export type ConverterFunction<T> = (entry: string) => T;

export function toSpdxType<T = string>(
  entry: string,
  converter?: ConverterFunction<T>,
): T | string | SpdxNoAssertion | SpdxNone {
  const defaultConverter = (entry: string): string => {
    return entry;
  };
  if (entry === NOASSERTION) {
    return new SpdxNoAssertion();
  } else if (entry === NONE) {
    return new SpdxNone();
  } else {
    return converter ? converter(entry) : defaultConverter(entry);
  }
}

export function validateSpdxNoAssertion(
  value: string | SpdxNoAssertion | SpdxNone,
): void {
  if (!(value instanceof SpdxNoAssertion)) {
    throw new Error(`Invalid entry: ${value.toString()} is not allowed.`);
  }
}
