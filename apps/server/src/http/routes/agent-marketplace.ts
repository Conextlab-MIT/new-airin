import { AirinApiError } from "@airin/core";
import { AgentMarketplaceService } from "../../services/agent-marketplace-service";
import { LaundryPackService } from "../../services/laundry-pack-service";
import type { ServerOptions } from "../context";
import {
  requireOrgAdminFromContext,
  requireOrgMemberFromContext,
} from "../org-guards";
import { errorResponse, json } from "../shared";
import type { HonoApp } from "../types";

export function registerAgentMarketplaceRoutes(
  app: HonoApp,
  options: ServerOptions
): void {
  const marketplace = new AgentMarketplaceService(options.agent.profiles);

  app.get("/v1/agent-marketplace", async (c) => {
    const auth = requireOrgMemberFromContext(c);

    return json(await marketplace.list(auth.activeOrgId!));
  });

  app.post("/v1/agent-marketplace/:catalogId/install", async (c) => {
    const auth = requireOrgAdminFromContext(c);
    const catalogId = decodeURIComponent(c.req.param("catalogId"));

    try {
      return json(
        await marketplace.install(auth.activeOrgId!, catalogId, {
          ownerUserId: auth.user.id,
          sharedWithTeam: true,
        }),
        201
      );
    } catch (error) {
      if (error instanceof AirinApiError) {
        return errorResponse(error.message, error.status);
      }

      const message = error instanceof Error ? error.message : String(error);

      return errorResponse(message, 400);
    }
  });

  app.post(
    "/v1/agent-marketplace/packs/laundry-innovation-summit/install",
    async (c) => {
      const auth = requireOrgAdminFromContext(c);

      if (!options.databaseAdapter) {
        return errorResponse("Database is not ready.", 503);
      }

      const laundryPack = new LaundryPackService(
        options.agent.profiles,
        options.databaseAdapter
      );

      try {
        return json(
          await laundryPack.installPack(auth.activeOrgId!, {
            ownerUserId: auth.user.id,
            sharedWithTeam: true,
          }),
          201
        );
      } catch (error) {
        if (error instanceof AirinApiError) {
          return errorResponse(error.message, error.status);
        }

        const message = error instanceof Error ? error.message : String(error);

        return errorResponse(message, 400);
      }
    }
  );
}
