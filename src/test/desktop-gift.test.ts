import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const html = readFileSync("public/bloom.html", "utf8");
const start = html.indexOf("function downloadNativeAlwaysOnTopLauncher(){");
const end = html.indexOf("\nfunction downloadDesktopWidget(){", start);
const action = html.slice(start, end) + "\ndownloadNativeAlwaysOnTopLauncher();";

describe("Desktop bouquet handoff", () => {
  it("opens the installer dialog with a transparent interactive bouquet instead of downloading a script", () => {
    const openBloomDesktopDialog = vi.fn();
    const encodeGiftPayload = vi.fn(() => "current-bouquet");
    runInNewContext(action, { window: { openBloomDesktopDialog }, encodeGiftPayload });
    expect(encodeGiftPayload).toHaveBeenCalledWith({ widgetMode: true, transparentBg: true, turntable: true, previewGift: true });
    expect(openBloomDesktopDialog).toHaveBeenCalledWith("current-bouquet");
  });

  it("sends the bouquet directly to the installed widget", () => {
    const openWidget = vi.fn();
    const openBloomDesktopDialog = vi.fn();
    runInNewContext(action, { window: { bloomDesktop: { openWidget }, openBloomDesktopDialog }, encodeGiftPayload: () => "current-bouquet" });
    expect(openWidget).toHaveBeenCalledWith("current-bouquet");
    expect(openBloomDesktopDialog).not.toHaveBeenCalled();
  });

  it("starts the installed widget with no background even without a gift link", () => {
    const start = html.indexOf("function maybeLoadHash(){");
    const end = html.indexOf("\nmaybeLoadHash();", start);
    const state = { widgetMode: false, transparentBg: false, previewGift: false, turntable: false };
    runInNewContext(html.slice(start, end) + "\nmaybeLoadHash();", {
      window: { bloomDesktop: {} }, state, location: { hash: "" },
    });
    expect(state.widgetMode).toBe(true);
    expect(state.transparentBg).toBe(true);
    expect(state.previewGift).toBe(true);
    expect(state.turntable).toBe(true);
  });

  it("keeps a normal browser launch in the studio", () => {
    const start = html.indexOf("function maybeLoadHash(){");
    const end = html.indexOf("\nmaybeLoadHash();", start);
    const state = { widgetMode: false, transparentBg: false };
    runInNewContext(html.slice(start, end) + "\nmaybeLoadHash();", {
      window: {}, state, location: { hash: "" },
    });
    expect(state.widgetMode).toBe(false);
    expect(state.transparentBg).toBe(false);
  });
});