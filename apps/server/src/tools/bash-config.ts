export type BashBackendKind = "host" | "remote";

export type BashSandboxNetwork = "off" | "public";

export function resolveBashBackend(
  env: NodeJS.ProcessEnv = process.env
): BashBackendKind {
  const raw = env.AIRIN_BASH_BACKEND?.trim().toLowerCase();

  if (!raw || raw === "host") {
    return "host";
  }

  if (raw === "remote") {
    return raw;
  }

  throw new Error(
    `Invalid AIRIN_BASH_BACKEND="${env.AIRIN_BASH_BACKEND}". Use "host" or "remote".`
  );
}

/** Off unless the operator opts in; only the remote backend reads it. */
export function resolveBashSandboxNetwork(
  env: NodeJS.ProcessEnv = process.env
): BashSandboxNetwork {
  const raw = env.AIRIN_BASH_SANDBOX_NETWORK?.trim().toLowerCase();

  if (!raw || raw === "off") {
    return "off";
  }

  if (raw === "public") {
    return raw;
  }

  throw new Error(
    `Invalid AIRIN_BASH_SANDBOX_NETWORK="${env.AIRIN_BASH_SANDBOX_NETWORK}". Use "off" or "public".`
  );
}

/**
 * Custom tools and non-global skill code run as host subprocesses. An operator
 * who picks the remote backend has moved tenant code off the host, so that
 * code is refused instead of running here with the server's permissions.
 */
export const REMOTE_BACKEND_HOST_CODE_REFUSAL =
  "This code would run on the Airin server, but this server runs tenant code only in its remote sandbox (AIRIN_BASH_BACKEND=remote). Use the bash tool instead.";

export const TENANT_BASH_DISABLED =
  "The bash tool is turned off on this server (AIRIN_TENANT_BASH=0).";

/**
 * On by default. A deployment where org admins are not the operator sets
 * AIRIN_TENANT_BASH=0, because bash runs as the server process and reaches
 * config.ini, every org's workspace and the server network.
 */
export function isTenantBashEnabled(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const raw = env.AIRIN_TENANT_BASH?.trim().toLowerCase();

  if (!raw || raw === "1" || raw === "true" || raw === "on") {
    return true;
  }

  if (raw === "0" || raw === "false" || raw === "off") {
    return false;
  }

  throw new Error(
    `Invalid AIRIN_TENANT_BASH="${env.AIRIN_TENANT_BASH}". Use "0" to turn the bash tool off for org profiles.`
  );
}
