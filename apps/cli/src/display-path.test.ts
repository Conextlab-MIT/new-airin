import { describe, expect, test } from "bun:test";
import { homedir } from "node:os";
import { join } from "node:path";
import { formatCliDisplayPath } from "./display-path";

describe("isCliVerbose", () => {});

describe("formatCliDisplayPath", () => {
  const home = homedir();

  const soulDir = join(
    home,
    ".airin",
    "orgs",
    "org_052abc599f8446afb7fde999214c776c",
    "profiles",
    "linus-torvalds"
  );

  const configPath = join(home, ".airin", "config.ini");

  test("masks home, org id, and profile id by default", () => {
    expect(formatCliDisplayPath(soulDir)).toBe(
      "~/.airin/orgs/<org>/profiles/<profile>"
    );
  });

  test("masks config path home without inventing org segments", () => {
    expect(formatCliDisplayPath(configPath)).toBe("~/.airin/config.ini");
  });

  test("masks foreign home prefixes", () => {
    expect(
      formatCliDisplayPath("/Users/other/.airin/orgs/org_abc/profiles/bot")
    ).toBe("~/.airin/orgs/<org>/profiles/<profile>");
  });
});
