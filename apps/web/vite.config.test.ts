import { expect, spyOn, test } from "bun:test";
import { resolveConfig } from "vite";

const configFile = `${import.meta.dir}/vite.config.ts`;

test("allows the configured public web host and keeps safe defaults", async () => {
  const previousWebUrl = process.env.AIRIN_WEB_PUBLIC_URL;
  const previousPublicUrl = process.env.AIRIN_PUBLIC_URL;
  const warn = spyOn(console, "warn").mockImplementation(() => {});

  try {
    const cases = [
      {
        allowedHosts: ["airin.example.com"],
        publicUrl: "https://fallback.example.com",
        webUrl: "https://airin.example.com:3003/app",
      },
      {
        allowedHosts: ["fallback.example.com"],
        publicUrl: "https://fallback.example.com",
        webUrl: undefined,
      },
      {
        allowedHosts: [],
        publicUrl: undefined,
        webUrl: "airin.example.com",
      },
      {
        allowedHosts: [],
        publicUrl: undefined,
        webUrl: "file:///",
      },
      { allowedHosts: [], publicUrl: undefined, webUrl: undefined },
    ];

    for (const { webUrl, publicUrl, allowedHosts } of cases) {
      if (webUrl === undefined) {
        delete process.env.AIRIN_WEB_PUBLIC_URL;
      } else {
        process.env.AIRIN_WEB_PUBLIC_URL = webUrl;
      }

      if (publicUrl === undefined) {
        delete process.env.AIRIN_PUBLIC_URL;
      } else {
        process.env.AIRIN_PUBLIC_URL = publicUrl;
      }

      const config = await resolveConfig(
        { configFile, logLevel: "silent" },
        "serve"
      );

      expect(config.server.allowedHosts).toEqual(allowedHosts);
    }

    expect(warn).toHaveBeenCalledTimes(2);
  } finally {
    warn.mockRestore();

    if (previousWebUrl === undefined) {
      delete process.env.AIRIN_WEB_PUBLIC_URL;
    } else {
      process.env.AIRIN_WEB_PUBLIC_URL = previousWebUrl;
    }

    if (previousPublicUrl === undefined) {
      delete process.env.AIRIN_PUBLIC_URL;
    } else {
      process.env.AIRIN_PUBLIC_URL = previousPublicUrl;
    }
  }
});
