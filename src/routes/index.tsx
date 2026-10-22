import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bloom Studio — 3D Bouquet Gifts" },
      { name: "description", content: "Design an interactive 3D bouquet and send it as a gift link." },
      { property: "og:title", content: "Bloom Studio — 3D Bouquet Gifts" },
      { property: "og:description", content: "Design an interactive 3D bouquet and send it as a gift link." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ href: "/bloom.html" });
  },
});
