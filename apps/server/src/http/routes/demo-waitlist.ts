import { randomUUID } from "node:crypto";
import { z } from "@hono/zod-openapi";
import type { ServerOptions } from "../context";
import { errorResponse, json, readJson } from "../shared";
import type { HonoApp } from "../types";

const laundryInnovationSummitWaitlistSchema = z
  .object({
    businessName: z.string().trim().min(1).max(200),
    email: z.string().trim().email().max(320),
    name: z.string().trim().min(1).max(200),
    whatsapp: z.string().trim().min(8).max(32),
  })
  .strict();

export function registerDemoWaitlistRoutes(
  app: HonoApp,
  options: ServerOptions
): void {
  app.post("/v1/public/waitlist/laundry-innovation-summit", async (c) => {
    const { databaseAdapter } = options;

    if (!databaseAdapter) {
      return errorResponse("Service unavailable", 503);
    }

    const body = await readJson(
      c.req.raw,
      laundryInnovationSummitWaitlistSchema
    );

    await databaseAdapter.createAuditEvent({
      action: "demo.waitlist.laundry_innovation_summit",
      actorUserId: null,
      createdAt: new Date().toISOString(),
      id: `audit_${randomUUID()}`,
      metadata: {
        businessName: body.businessName,
        email: body.email,
        name: body.name,
        source: "laundry_innovation_summit",
        whatsapp: body.whatsapp,
      },
      orgId: null,
      requestId: c.get("requestId") ?? null,
      resourceId: body.email,
      resourceType: "waitlist",
    });

    return json({ ok: true as const });
  });
}
