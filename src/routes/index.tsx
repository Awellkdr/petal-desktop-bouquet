import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bloom Studio — 3D Bouquet Gifts" },
      { name: "description", content: "Pick a ready-made 3D bouquet or build your own, then send it as a gift link." },
      { property: "og:title", content: "Bloom Studio — 3D Bouquet Gifts" },
      { property: "og:description", content: "Pick a ready-made 3D bouquet or build your own, then send it as a gift link." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

type Bouquet = { id: string; name: string; note: string; vase: string; blooms: string[] };

export const BOUQUETS: Bouquet[] = [
  { id: "blush-romance", name: "Blush Romance", note: "Blush roses and soft peonies", vase: "#D7A0A5", blooms: ["#D9909D", "#F1C7CF", "#F3E7D8", "#D9909D", "#F1C7CF"] },
  { id: "sunny-meadow", name: "Sunny Meadow", note: "Sunflowers, daisies and golden tulips", vase: "#E9E0D2", blooms: ["#E8B83F", "#F5EEDF", "#E8BD48", "#F5EEDF", "#E8B83F"] },
  { id: "lavender-dream", name: "Lavender Dream", note: "Orchids and lilac tulips, sculpted", vase: "#B6A6C9", blooms: ["#BC89B8", "#9C86BC", "#B4A2CD", "#BC89B8", "#9C86BC"] },
  { id: "midnight-velvet", name: "Midnight Velvet", note: "Deep burgundy and red roses", vase: "#477D7B", blooms: ["#702A40", "#C94451", "#D68191", "#702A40", "#C94451"] },
  { id: "white-elegance", name: "White Elegance", note: "Tall lilies in clear glass", vase: "#D8DDD8", blooms: ["#F2DFE6", "#F4E9CB", "#F3E7D8", "#F2DFE6", "#F4E9CB"] },
  { id: "tuscan-sunset", name: "Tuscan Sunset", note: "Peach roses, coral tulips, orchids", vase: "#C88A4A", blooms: ["#E8A17F", "#E7785A", "#F1E5D4", "#E8A17F", "#E7785A"] },
];

const SPOTS = [
  [50, 18], [30, 30], [70, 30], [40, 44], [62, 46],
];

function BouquetArt({ b }: { b: Bouquet }) {
  return (
    <div className="relative mx-auto h-48 w-40">
      {SPOTS.map(([x, y], i) => (
        <span
          key={i}
          className="absolute h-14 w-14 -translate-x-1/2 rounded-full shadow-md"
          style={{ left: `${x}%`, top: `${y}%`, background: `radial-gradient(circle at 40% 35%, ${b.blooms[i]}, color-mix(in oklab, ${b.blooms[i]} 70%, black))` }}
        />
      ))}
      <span
        className="absolute bottom-0 left-1/2 h-20 w-20 -translate-x-1/2 rounded-b-[2.5rem] rounded-t-xl opacity-90"
        style={{ background: `linear-gradient(160deg, ${b.vase}, color-mix(in oklab, ${b.vase} 65%, black))` }}
      />
    </div>
  );
}

function Landing() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-20 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Bloom Studio</p>
        <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">A bouquet that never wilts</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Choose a ready-made 3D bouquet or arrange your own, then send it as a gift they can keep on their desktop.
        </p>
        <a
          href="/bloom.html#new"
          className="mt-8 inline-flex items-center rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground transition hover:opacity-90"
        >
          Build your bouquet
        </a>
      </section>
      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {BOUQUETS.map((b) => (
          <article key={b.id} className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
            <BouquetArt b={b} />
            <h2 className="mt-5 font-serif text-2xl">{b.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{b.note}</p>
            <a
              href={`/bloom.html#preset=${b.id}`}
              className="mt-5 inline-flex rounded-full border border-border px-5 py-2 text-sm transition hover:bg-accent"
            >
              Open in 3D
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
