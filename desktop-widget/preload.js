const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("bloomDesktop", {
  hide: () => ipcRenderer.send("hide"),
  openWidget: (payload) => ipcRenderer.send("open-widget", payload),
});
