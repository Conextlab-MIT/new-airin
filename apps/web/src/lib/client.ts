import { AirinClient } from "@airin/client";
import { formatClientError } from "@airin/core/api-error";

export const client = new AirinClient({ baseUrl: "" });

export { formatClientError as formatError };
