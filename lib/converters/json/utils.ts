// SPDX-FileCopyrightText: 2023 spdx contributors
//
// SPDX-License-Identifier: MIT

export function formatDatetime(datetime: Date): string {
  return datetime.toISOString().split(".")[0] + "Z";
}
