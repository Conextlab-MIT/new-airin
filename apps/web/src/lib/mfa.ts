import { formatError } from "@/lib/client";

/** Platform policy requires MFA and this account has not finished enrollment. */
export function needsMfaEnrollment(
  user: { mfaEnrolled?: boolean; mfaRequired?: boolean } | null | undefined
): boolean {
  return user?.mfaRequired === true && user?.mfaEnrolled !== true;
}

export function isMfaEnrollmentError(error: unknown): boolean {
  return formatError(error).includes("Complete MFA enrollment");
}
