import { describe, expect, test } from "bun:test";
import { AirinApiError } from "@airin/core/api-error";
import { isMfaEnrollmentError, needsMfaEnrollment } from "./mfa";

describe("needsMfaEnrollment", () => {
  test("is true only when required and not enrolled", () => {
    expect(needsMfaEnrollment(null)).toBe(false);
    expect(needsMfaEnrollment({ mfaEnrolled: false, mfaRequired: true })).toBe(
      true
    );
    expect(needsMfaEnrollment({ mfaEnrolled: true, mfaRequired: true })).toBe(
      false
    );
    expect(needsMfaEnrollment({ mfaEnrolled: false, mfaRequired: false })).toBe(
      false
    );
  });
});

describe("isMfaEnrollmentError", () => {
  test("matches the enrollment lock message", () => {
    expect(
      isMfaEnrollmentError(
        new AirinApiError(
          "Complete MFA enrollment before accessing this resource.",
          403
        )
      )
    ).toBe(true);
    expect(isMfaEnrollmentError(new Error("Not found"))).toBe(false);
  });
});
