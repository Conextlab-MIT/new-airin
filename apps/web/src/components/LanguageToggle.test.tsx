import { afterEach, expect, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { LocaleProvider } from "@/context/locale-context";
import { LanguageToggle } from "./LanguageToggle";

const cleanups: Array<() => Promise<void>> = [];

afterEach(async () => {
  for (const cleanup of cleanups.splice(0)) {
    await cleanup();
  }
});

async function renderToggle() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  cleanups.push(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  await act(async () =>
    root.render(
      <LocaleProvider>
        <LanguageToggle />
      </LocaleProvider>
    )
  );

  const tile = (label: string) =>
    [...container.querySelectorAll<HTMLButtonElement>("button")].find(
      (button) => button.textContent?.trim() === label
    );

  return { tile };
}

test("LanguageToggle selects EN", async () => {
  const { tile } = await renderToggle();
  const en = tile("EN");
  expect(en).toBeTruthy();

  await act(async () => {
    en?.click();
  });

  expect(en?.getAttribute("aria-pressed")).toBe("true");
  expect(document.documentElement.lang).toBe("en");
});
