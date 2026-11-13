export const REDACTED_SECRET_VALUE = "••••••••";

/** Env vars that hold a secret and never reach a child process. */
export function isSecretEnvKey(key: string): boolean {
  return (
    key === "AIRIN_SECRETS_KEY" ||
    key === "AIRIN_SECRETS_KEY_NEXT" ||
    key === "AIRIN_EMAIL_PASSWORD" ||
    key === "AIRIN_EMAIL_PASSWORD_FILE" ||
    key.startsWith("AIRIN_PROVIDER_API_KEY_") ||
    key.startsWith("AIRIN_TOOL_API_KEY_") ||
    /(?:^|_)API_KEY(?:_FILE)?$/.test(key)
  );
}

/**
 * Airin's own credentials, by name shape, plus the secrets above. Bash,
 * coding agents and CLI installs never need them. Channel workers do, which
 * is why `isSecretEnvKey` stays the narrower list.
 */
export function isToolHiddenEnvKey(key: string): boolean {
  return (
    isSecretEnvKey(key) ||
    key === "TELEGRAM_MANAGER_WEBHOOK_SECRET" ||
    (key.startsWith("AIRIN_") &&
      /_(?:TOKEN|SECRET|PASSWORD|PASSWORD_HASH)(?:_FILE)?$/.test(key))
  );
}

/** Mask all but the last 4 characters; empty → null; short → full bullets. */
export function maskTrailingSecret(secret: string): string | null {
  const trimmed = secret.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.length <= 8) {
    return REDACTED_SECRET_VALUE;
  }

  return `${"•".repeat(Math.min(trimmed.length - 4, 12))}${trimmed.slice(-4)}`;
}
