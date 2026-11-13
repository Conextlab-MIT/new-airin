import { AirinApiError } from "@airin/core/api-error";

/** Platform policy requires MFA and this account has not finished enrollment. */
export function needsMfaEnrollment(
  user: { mfaEnrolled?: boolean; mfaRequired?: boolean } | null | undefined
): boolean {
  return user?.mfaRequired === true && user?.mfaEnrolled !== true;
}

export function isMfaEnrollmentError(error: AirinApiError | Error): boolean {
  return error instanceof AirinApiError && error.status === 403;
}
