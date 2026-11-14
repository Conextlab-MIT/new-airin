import { randomUUID } from "node:crypto";
import { z } from "@hono/zod-openapi";
import type { ServerOptions } from "../context";
import { requirePlatformAdminFromContext } from "../org-guards";
import { errorResponse, json, readJson } from "../shared";
import type { HonoApp } from "../types";

const waitlistEntrySchema = z
  .object({
    businessName: z.string().trim().min(1).max(150),
    businessType: z.string().trim().min(1).max(100),
    contactName: z.string().trim().min(1).max(120),
    email: z.string().trim().toLowerCase().max(254).email(),
    whatsapp: z
      .string()
      .trim()
      .max(32)
      .transform((number) => number.replace(/[ ()-]/g, ""))
      .pipe(z.string().regex(/^\+?[0-9]{8,15}$/)),
  })
  .strict();

const waitlistQuerySchema = z.object({
  before: z.coerce.number().int().positive().optional(),
});

export function registerPlatformWaitlistRoutes(
  app: HonoApp,
  options: ServerOptions
): void {
  app.get("/v1/platform/waitlist", async (c) => {
    requirePlatformAdminFromContext(c);
    const { databaseAdapter } = options;

    if (!databaseAdapter) {
      return errorResponse("Service unavailable", 503);
    }

    const query = waitlistQuerySchema.safeParse(c.req.query());

    if (!query.success) {
      return errorResponse("Invalid waitlist query", 400);
    }

    const pageSize = 50;

    const rows = await databaseAdapter.listWaitlistEntries(
      query.data.before ?? null,
      pageSize + 1
    );

    const entries = rows.slice(0, pageSize);

    c.header("Cache-Control", "no-store");

    return c.json({
      entries,
      nextCursor: rows.length > pageSize ? (entries.at(-1)?.id ?? null) : null,
    });
  });
}

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
  app.post("/v1/public/waitlist", async (c) => {
    const { databaseAdapter } = options;

    if (!databaseAdapter) {
      return errorResponse("Service unavailable", 503);
    }

    const entry = await readJson(c.req.raw, waitlistEntrySchema, 4096);
    await databaseAdapter.createWaitlistEntry(entry, new Date().toISOString());

    return c.json({ ok: true }, 202);
  });

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
