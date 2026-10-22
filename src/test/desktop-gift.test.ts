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
});