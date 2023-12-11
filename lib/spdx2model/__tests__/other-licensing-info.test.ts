// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

import { OtherLicensingInfo } from "../other-licensing-info";
import { SpdxNoAssertion } from "../utils";

describe("OtherLicensingInfo", () => {
  it("Creates correct describes other license info from api with options", () => {
    const licenseId = "LicenseRef-test-id";
    const extractedText = "This is the license text";
    const crossReferences = ["https://example.com"];
    const comment = "This is a comment";

    expect(
      OtherLicensingInfo.fromApi({
        licenseId,
        extractedText,
        licenseName: "NOASSERTION",
        crossReferences,
        comment,
      }),
    ).toStrictEqual(
      new OtherLicensingInfo({
        licenseId,
        extractedText,
        licenseName: new SpdxNoAssertion(),
        crossReferences,
        comment,
      }),
    );
  });
});
