import html from "../../public/bloom.html?raw";

/** Serves the self-contained 3D studio page under clean URLs (/studio, /collection/:id, /g/:code). */
export function studioResponse() {
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
  });
}
