const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const screen = electron.screen;
const path = require('path')
const ipcMain = electron.ipcMain;
const Store = require('electron-store');

const store = new Store();

const ratio_screen = 1.5;
const scale_screen = 0.7;

let mainWindow;

function createWindow (width,height) {
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    /*minHeight: 400,
    maxHeight: 800,
    minWidth: 400,
    maxWidth: 1500,*/
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  createWindow(Math.round(ratio_screen*height*scale_screen), Math.round(height*scale_screen));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


ipcMain.on("requestPoints", (event, args) => {
  let points = store.get('points');
  if (points == null){
    points = [];
    store.set('points',points);
  }
  mainWindow.webContents.send("sendPoints", points);
});

ipcMain.on("addRank", (event, point) => {
  let points = store.get('points');
  if (points == null){
    points = [];
    store.set('points',points);
  }
  let ndays = point[0];
  let rank = point[1];
  let i=0;
  if (points.length>0){
    for (i=0; i<points.length; i++){
      if (points[i][0] > ndays){
        if (points[i][1] > rank){
          return;
        }
        break;
      }else if(points[i][0] == ndays){
        if (!((i+1<points.length && points[i+1][1] > rank)
          ||(i>0 && points[i-1][1] < rank))){
          points[i][1] = rank;
          store.set('points',points);
        }
        return;
      }
    }
    if (i>0 && points[i-1][1] < rank){
      return;
    }
  }
  points.splice(i, 0, [ndays,rank]);
  store.set('points',points);
});

ipcMain.on("deletePoint", (event, ndays) => {
  let points = store.get('points');
  if (points == null){
    points = [];
    store.set('points',points);
  }
  for (let i=0; i<points.length; i++){
    if (points[i][0] == ndays){
      points.splice(i, 1);
      store.set('points',points);
      return;
    } 
  }
});