import { afterEach, describe, expect, test } from "bun:test";
import {
  getInitialUiMode,
  persistUiMode,
  UI_MODE_STORAGE_KEY,
} from "@/lib/ui-mode";

afterEach(() => {
  localStorage.removeItem(UI_MODE_STORAGE_KEY);
});

describe("ui-mode", () => {
  test("defaults to owner when nothing is stored", () => {
    expect(getInitialUiMode()).toBe("owner");
  });

  test("reads a stored advanced mode", () => {
    persistUiMode("advanced");
    expect(getInitialUiMode()).toBe("advanced");
  });
});
