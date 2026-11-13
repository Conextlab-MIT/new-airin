import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: "https://github.com/ahmadrosid/airin",
    links: [
      {
        external: true,
        text: "Managed hosting",
        url: "https://getairin.cloud/",
      },
    ],
    nav: {
      title: "Airin",
    },
  };
}
