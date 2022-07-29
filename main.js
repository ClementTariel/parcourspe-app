const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const screen = electron.screen;
const path = require('path')
const ipcMain = electron.ipcMain;
const Store = require('electron-store');

const store = new Store();

const ratio_screen = 1.7;
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
      /*nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote*/
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


ipcMain.on("requestPoints", (event, etab_id) => {
  let data = store.get('data');
  if (data == null){
    data = {};
    store.set('data',data);
  }
  if (etab_id=="NaN" || !data.hasOwnProperty(etab_id.toString())){
    mainWindow.webContents.send("sendPoints", null);
  }
  mainWindow.webContents.send("sendPoints",{"name":data[etab_id.toString()]["name"],"points": data[etab_id.toString()]["points"]});
});

ipcMain.on("addRank", (event, args) => {
  let etab_id = args["etab_id"];
  let point = args["point"];
  let data = store.get('data');
  if (data == null || !data.hasOwnProperty(etab_id.toString())){
    return;
  }
  let points = store.get("data."+etab_id+".points");
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
          store.set("data."+etab_id+".points",points);
        }
        return;
      }
    }
    if (i>0 && points[i-1][1] < rank){
      return;
    }
  }
  points.splice(i, 0, [ndays,rank]);
  store.set("data."+etab_id+".points",points);
});

ipcMain.on("deletePoint", (event, args) => {
  let etab_id = args["etab_id"];
  let ndays = args["ndays"];
  let data = store.get('data');
  if (data == null || !data.hasOwnProperty(etab_id.toString())){
    return;
  }
  let points = store.get("data."+etab_id+".points");
  for (let i=0; i<points.length; i++){
    if (points[i][0] == ndays){
      points.splice(i, 1);
      store.set("data."+etab_id+".points",points);
      return;
    } 
  }
});

ipcMain.on("addEtab", (event, etab_name) => {
  if (etab_name.replace(/\s/g, '').length > 0){
    let data = store.get('data');
    if (data == null){
      data = {};
      store.set('data',data);
    }
    let etab_id = 0;
    while (data.hasOwnProperty(etab_id.toString())){
      etab_id++;
    }
    //store.set('data.'+etab_id.toString(),{});
    data[etab_id.toString()] = {"name": etab_name, "points": []};
    store.set('data',data);
    mainWindow.webContents.send("sendEtabId", etab_id);
  }else{
    mainWindow.webContents.send("sendEtabId", -1);
  }
  

});

ipcMain.on("requestEtabs", (event,arg) => {
  //reset for the tests
  //store.set('data',null);
  let data = store.get('data');
  if (data == null){
    data = {};
    store.set('data',data);
  }
  //console.log(data);
  let etabs = [];
  let keys = Object.keys(data);
  for (let i=0; i<keys.length; i++){
    let key = keys[i];
    etabs.push([key,data[key]['name']]);
  }
  mainWindow.webContents.send("sendEtabs", etabs);

});

ipcMain.on("changeEtabName", (event,args) => {
  let etab_id = args["etab_id"];
  let etab_name = args["name"];
  if (etab_name.replace(/\s/g, '').length > 0){
    store.set('data.'+etab_id.toString()+'.name',etab_name);
  }
});