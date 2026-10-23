import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const main = readFileSync("desktop-widget/main.js", "utf8");

function startWindow() {
  const options: Record<string, unknown>[] = [];
  const window = {
    setAlwaysOnTop: vi.fn(), setVisibleOnAllWorkspaces: vi.fn(), on: vi.fn(),
    webContents: { on: vi.fn(), insertCSS: vi.fn(), executeJavaScript: vi.fn() },
  };
  const electron = {
    app: { requestSingleInstanceLock: () => false, quit: vi.fn() },
    ipcMain: { on: vi.fn() },
    screen: { getPrimaryDisplay: () => ({ workArea: { x: 0, y: 0, width: 1920, height: 1080 } }) },
    BrowserWindow: class { constructor(config: Record<string, unknown>) { options.push(config); return window; } },
  };
  runInNewContext(main + "\ncreateWindow();", {
    require: (name: string) => name === "electron" ? electron : name === "path" ? { join: (...parts: string[]) => parts.join("/") } : {},
    __dirname: "desktop-widget",
  });
  return { config: options[0], window };
}

describe("Native desktop bouquet window", () => {
  it("has no frame, shadow, or background", () => {
    const { config } = startWindow();
    expect(config.transparent).toBe(true);
    expect(config.frame).toBe(false);
    expect(config.hasShadow).toBe(false);
    expect(config.backgroundColor).toBe("#00000000");
  });

  it("stays above other windows and appears across workspaces", () => {
    const { config, window } = startWindow();
    expect(config.alwaysOnTop).toBe(true);
    expect(window.setAlwaysOnTop).toHaveBeenCalledWith(true, "screen-saver");
    expect(window.setVisibleOnAllWorkspaces).toHaveBeenCalledWith(true, { visibleOnFullScreen: true });
  });

  it("keeps the bouquet renderer isolated from Node", () => {
    const { config } = startWindow();
    expect(config.webPreferences).toMatchObject({ contextIsolation: true, nodeIntegration: false });
  });
});