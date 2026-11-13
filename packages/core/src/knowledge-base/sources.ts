import type { KnowledgeBaseSource } from "../contract";

export const AIRIN_DOCS_SITE_URL = "https://ahmadrosid.github.io/airin";

export const AIRIN_DOCS_LLMS_URL = `${AIRIN_DOCS_SITE_URL}/llms.txt`;

export const DEFAULT_KNOWLEDGE_SOURCES: KnowledgeBaseSource[] = [
  {
    description:
      "Official Airin docs index (llms.txt). Fetch this first with web_fetch, then fetch specific .md pages listed in the index.",
    enabled: true,
    id: "airin-docs",
    inherited: true,
    kind: "url",
    title: "Airin Documentation",
    url: AIRIN_DOCS_LLMS_URL,
  },
];
