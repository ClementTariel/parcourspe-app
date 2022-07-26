const {contextBridge, ipcMain, ipcRenderer} = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["requestPoints","addRank","deletePoint","requestEtabs","addEtab","delEtab","changeEtabName"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["sendPoints","sendEtabId","sendEtabs"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);
contextBridge.exposeInMainWorld("is_using_electron", true);