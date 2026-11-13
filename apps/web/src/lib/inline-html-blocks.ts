/**
 * Split assistant markdown into text and fenced HTML widgets for inline
 * sandboxed rendering (ChatGPT/Claude-style interactive results).
 */

export type InlineContentPart =
  | { type: "markdown"; text: string }
  | { type: "html"; html: string };

const HTML_FENCE = /```(?:html|htm)\s*\n([\s\S]*?)```/gi;

/** Also accept a full document without a fence when clearly HTML. */
const LOOSE_HTML_DOC = /^\s*(?:<!DOCTYPE\s+html|<html[\s>])/i;

export function splitInlineHtmlBlocks(content: string): InlineContentPart[] {
  const parts: InlineContentPart[] = [];
  let lastIndex = 0;
  HTML_FENCE.lastIndex = 0;

  for (const match of content.matchAll(HTML_FENCE)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      const text = content.slice(lastIndex, index);

      if (text.trim()) {
        parts.push({ text, type: "markdown" });
      }
    }

    const html = match[1]?.trim() ?? "";

    if (html) {
      parts.push({ html, type: "html" });
    }

    lastIndex = index + match[0].length;
  }

  const rest = content.slice(lastIndex);

  if (rest.trim()) {
    if (parts.length === 0 && LOOSE_HTML_DOC.test(rest)) {
      parts.push({ html: rest.trim(), type: "html" });
    } else {
      parts.push({ text: rest, type: "markdown" });
    }
  }

  return parts.length > 0 ? parts : [{ text: content, type: "markdown" }];
}

export function contentHasInlineHtml(content: string): boolean {
  return splitInlineHtmlBlocks(content).some((part) => part.type === "html");
}
