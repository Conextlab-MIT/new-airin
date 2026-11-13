import { expect, test } from "bun:test";
import { splitInlineHtmlBlocks } from "./inline-html-blocks";

test("splitInlineHtmlBlocks extracts fenced html", () => {
  const parts = splitInlineHtmlBlocks(
    "Here is a calculator:\n\n```html\n<button>1</button>\n```\n\nDone."
  );

  expect(parts).toEqual([
    { text: "Here is a calculator:\n\n", type: "markdown" },
    { html: "<button>1</button>", type: "html" },
    { text: "\n\nDone.", type: "markdown" },
  ]);
});

test("splitInlineHtmlBlocks treats a whole HTML document as html", () => {
  const parts = splitInlineHtmlBlocks(
    "<!DOCTYPE html><html><body>Hi</body></html>"
  );

  expect(parts).toEqual([
    { html: "<!DOCTYPE html><html><body>Hi</body></html>", type: "html" },
  ]);
});
