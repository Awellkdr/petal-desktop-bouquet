import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/g/$code")({
  head: () => ({
    meta: [
      { title: "A bouquet for you — Adey Digital" },
      { name: "description", content: "Someone sent you an interactive 3D bouquet." },
      { property: "og:title", content: "A bouquet for you — Adey Digital" },
      { property: "og:description", content: "Open your interactive 3D bouquet and personal message." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GiftRedirect,
});

function GiftRedirect() {
  const { code } = Route.useParams();
  useEffect(() => {
    window.location.replace(`/bloom.html#g=${encodeURIComponent(code)}`);
  }, [code]);
  return <p className="p-10 text-center text-muted-foreground">Opening your bouquet…</p>;
}
