import { screen, app, BrowserWindow } from "electron";
import * as path from "path";

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: screen.getPrimaryDisplay().workAreaSize.width * 0.8,
    height: screen.getPrimaryDisplay().workAreaSize.height * 0.8,
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.loadURL(`file://${__dirname}/../index.html`);

  //win.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
