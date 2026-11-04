import { createFileRoute } from "@tanstack/react-router";
import { studioResponse } from "@/lib/studio-page";

export const Route = createFileRoute("/collection/$id")({
  server: { handlers: { GET: async () => studioResponse() } },
});
