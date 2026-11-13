"use strict";

module.exports = {
  apps: [
    {
      args: ["run", "apps/server/src/index.ts"],
      autorestart: true,
      cwd: "/app",
      env: {
        AIRIN_HOST: "0.0.0.0",
        AIRIN_PORT: "4310",
        NODE_ENV: "production",
      },
      name: "server",
      script: "bun",
    },
  ],
};
