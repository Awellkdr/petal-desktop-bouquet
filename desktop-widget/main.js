// Bloom Studio desktop widget: a transparent, frameless, always-on-top bouquet window.
const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, screen } = require("electron");
const path = require("path");
const fs = require("fs");

const PROTOCOL = "bloomstudio";
const stateFile = () => path.join(app.getPath("userData"), "bouquet.json");
let win = null;
let tray = null;

function payloadFromUrl(url) {
  if (!url || !url.startsWith(PROTOCOL + "://")) return null;
  const i = url.indexOf("widget=");
  return i >= 0 ? decodeURIComponent(url.slice(i + 7)) : null;
}
function savePayload(p) {
  try { fs.writeFileSync(stateFile(), JSON.stringify({ payload: p })); } catch {}
}
function loadPayload() {
  try { return JSON.parse(fs.readFileSync(stateFile(), "utf8")).payload; } catch { return null; }
}

function showBouquet(payload) {
  if (payload) savePayload(payload);
  const p = payload || loadPayload();
  const file = path.join(__dirname, "app", "bloom.html");
  if (!win) createWindow();
  win.loadFile(file, p ? { hash: "widget=" + p } : undefined);
  win.showInactive();
}

function createWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  win = new BrowserWindow({
    width: 420,
    height: 540,
    x: workArea.x + workArea.width - 450,
    y: workArea.y + workArea.height - 570,
    transparent: true,
    frame: false,
    hasShadow: false,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    resizable: true,
    skipTaskbar: true,
    webPreferences: { preload: path.join(__dirname, "preload.js") },
  });
  win.setAlwaysOnTop(true, "screen-saver");
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.webContents.on("did-finish-load", () => {
    win.webContents.insertCSS(`
      html, body, #app, #stage-wrap { background: transparent !important; }
      [data-action="launch-aot-widget"], [data-action="download-native-aot-launcher"],
      [data-action="exit-widget-mode"], [data-action="download-desktop-widget"] { display: none !important; }
      .widget-floating-dock { opacity: 0; transition: opacity .2s; }
      body:hover .widget-floating-dock { opacity: 1; }
    `);
    win.webContents.executeJavaScript(`
      (function(){
        const dock = document.getElementById('widget-floating-dock');
        if (dock && !document.getElementById('bw-close')) {
          const b = document.createElement('button');
          b.id = 'bw-close'; b.className = 'widget-dock-btn'; b.textContent = '✕'; b.title = 'Hide widget';
          b.onclick = () => window.bloomDesktop.hide();
          dock.appendChild(b);
        }
      })();
    `);
  });
  win.on("closed", () => { win = null; });
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, "build", "tray.png"));
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon.resize({ width: 18, height: 18 }));
  tray.setToolTip("Bloom Studio");
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Show bouquet", click: () => showBouquet(null) },
    { label: "Hide bouquet", click: () => win && win.hide() },
    { type: "separator" },
    { label: "Start when computer starts", type: "checkbox",
      checked: app.getLoginItemSettings().openAtLogin,
      click: (i) => app.setLoginItemSettings({ openAtLogin: i.checked }) },
    { label: "Quit", click: () => app.quit() },
  ]));
  tray.on("click", () => showBouquet(null));
}

ipcMain.on("hide", () => win && win.hide());
ipcMain.on("open-widget", (_e, p) => showBouquet(p));

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
  app.on("second-instance", (_e, argv) => {
    showBouquet(payloadFromUrl(argv.find((a) => a.startsWith(PROTOCOL + "://"))));
  });
  app.on("open-url", (e, url) => {
    e.preventDefault();
    if (app.isReady()) showBouquet(payloadFromUrl(url));
    else app.once("ready", () => showBouquet(payloadFromUrl(url)));
  });
  app.whenReady().then(() => {
    if (process.platform === "darwin" && app.dock) app.dock.hide();
    createTray();
    app.setLoginItemSettings({ openAtLogin: true });
    showBouquet(payloadFromUrl(process.argv.find((a) => a.startsWith(PROTOCOL + "://"))));
  });
  app.on("window-all-closed", (e) => e.preventDefault());
}
