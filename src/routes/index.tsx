import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Flower2, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredGiftHash } from "@/data/featured-bouquet";
import blush from "@/assets/blush-romance.png.asset.json";
import sunny from "@/assets/sunny-meadow.png.asset.json";
import lavender from "@/assets/lavender-dream.png.asset.json";
import midnight from "@/assets/midnight-velvet.png.asset.json";
import white from "@/assets/white-elegance.png.asset.json";
import tuscan from "@/assets/tuscan-sunset.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Adey Digital — A Little Beauty, Just for You" },
    { name: "description", content: "Discover living 3D bouquets. Choose a ready-made arrangement or create your own thoughtful digital flower gift with Adey Digital." },
    { property: "og:title", content: "Adey Digital — A Little Beauty, Just for You" },
    { property: "og:description", content: "Flowers for every feeling. Explore interactive 3D bouquets and make something lovely for someone you love." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Landing,
});

export const BOUQUETS = [
  { id: "blush-romance", name: "Blush Romance", note: "Blush roses · soft peonies", image: blush.url, mood: "Soft & romantic", tone: "rose" },
  { id: "sunny-meadow", name: "Sunny Meadow", note: "Sunflowers · daisies · golden tulips", image: sunny.url, mood: "Bright & joyful", tone: "sunny" },
  { id: "lavender-dream", name: "Lavender Dream", note: "Orchids · lilac tulips", image: lavender.url, mood: "Quiet & elegant", tone: "lilac" },
  { id: "midnight-velvet", name: "Midnight Velvet", note: "Burgundy roses · deep red peonies", image: midnight.url, mood: "Soft & romantic", tone: "mint" },
  { id: "white-elegance", name: "White Elegance", note: "White lilies · a clear glass vase", image: white.url, mood: "Quiet & elegant", tone: "neutral" },
  { id: "tuscan-sunset", name: "Tuscan Sunset", note: "Peach roses · coral tulips · orchids", image: tuscan.url, mood: "Bright & joyful", tone: "peach" },
];
const moods = ["All bouquets", "Soft & romantic", "Bright & joyful", "Quiet & elegant"];
function Landing() {
  const [mood, setMood] = useState("All bouquets");
  const collection = BOUQUETS.filter(b => mood === "All bouquets" || b.mood === mood);
  return (
    <main className="bloom-landing bg-background text-foreground">
      <header className="landing-header landing-width">
        <a href="/" className="landing-brand" aria-label="Adey Digital home"><Flower2 aria-hidden="true" /> Adey Digital<span className="brand-dot">®</span></a>
        <nav aria-label="Main navigation" className="landing-nav">
          <Button variant="ghost" asChild><a href="#bouquets">The collection</a></Button>
          <Button variant="ghost" asChild><a href="/bloom.html#new">The atelier <ArrowUpRight /></a></Button>
        </nav>
        <Button asChild variant="outline" className="header-create"><a href="/bloom.html#new">Create a bouquet <Flower2 /></a></Button>
      </header>

      <section className="landing-hero landing-width" aria-labelledby="hero-title">
        <div className="hero-scene">
          <div className="hero-arch" aria-hidden="true" />
          <iframe src={`/bloom.html?embed=1${featuredGiftHash}`} title="Live interactive orchid bouquet" className="hero-bouquet" />
          <span className="scene-caption"><span className="live-dot" /> Orchid reverie <span>01 / 06</span></span>
        </div>
        <div className="hero-copy">
          <p className="small-label"><span /> A digital flower atelier</p>
          <h1 id="hero-title">Adey Digital<span>Flowers for<br />every feeling.</span></h1>
          <p className="hero-description">A little love. A thank you. A just-because.<br className="desktop-break" /> Make something beautiful that stays.</p>
          <Button size="lg" asChild className="build-bouquet"><a href="/bloom.html#new">Build your bouquet <ArrowUpRight /></a></Button>
          <a className="hero-collection-link" href="#bouquets">Or find your favourite below <ArrowDown size={14} /></a>
        </div>
        <div className="hero-footnote"><Heart size={14} /><span>Made with feeling.<br />Given with love.</span></div>
      </section>

      <section id="bouquets" className="collection-section landing-width" aria-labelledby="collection-title">
        <div className="collection-heading"><div><p className="small-label">The collection</p><h2 id="collection-title">Pick a little happiness.</h2></div><span className="collection-count">Six bouquets. Endless reasons.</span></div>
        <div className="mood-filters" aria-label="Bouquet moods">{moods.map(item => <Button key={item} variant={mood === item ? "secondary" : "ghost"} onClick={() => setMood(item)} aria-pressed={mood === item}>{item}</Button>)}</div>
        <div className="bouquet-grid">{collection.map((b, i) => <article key={b.id} className="bouquet-item">
          <a href={`/bloom.html#preset=${b.id}`} className={`bouquet-image bouquet-tone-${b.tone}`} aria-label={`Open ${b.name} in 3D`}>
            <span className="bouquet-number">0{BOUQUETS.indexOf(b) + 1}</span>
            <img src={b.image} alt={`${b.name} 3D bouquet in its vase`} loading={i < 3 ? "eager" : "lazy"} />
            <span className="bouquet-image-icon"><ArrowUpRight size={18} /></span>
          </a>
          <div className="bouquet-details"><div><h3>{b.name}</h3><p>{b.note}</p></div><Button variant="ghost" size="icon" asChild><a href={`/bloom.html#preset=${b.id}`} aria-label={`Customize ${b.name}`} title={`Customize ${b.name}`}><ArrowUpRight /></a></Button></div>
        </article>)}</div>
      </section>
      <section className="landing-note"><div className="landing-width"><Flower2 aria-hidden="true" /><p>Not just flowers.<br />A feeling, <span>beautifully kept.</span></p><Button asChild variant="outline"><a href="/bloom.html#new">Make it personal <Sparkles /></a></Button></div></section>
      <footer className="landing-footer landing-width"><a href="/" className="landing-brand"><Flower2 /> Adey Digital</a><span>A little beauty, just for you.</span><Button variant="ghost" asChild><a href="/bloom.html#new">Enter the atelier <ArrowUpRight /></a></Button></footer>
    </main>
  );
}
