import { afterEach, describe, expect, test } from "bun:test";
import { getInitialTheme, THEME_STORAGE_KEY } from "@/lib/theme";

afterEach(() => {
  localStorage.removeItem(THEME_STORAGE_KEY);
});

describe("theme defaults", () => {
  test("defaults to light when nothing is stored", () => {
    expect(getInitialTheme()).toBe("light");
  });
});
