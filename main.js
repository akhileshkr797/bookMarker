const electron = require('electron')
const {app, BrowserWindow, webContents, MenuItem, ipcMain, Menu} = electron
const path = require('path')
const url = require('url')


let mainWindow = null

function createWindow(){
    mainWindow = new BrowserWindow({
    minimizable: false,
    maximizable: false,
    width:800,
    height:650,
    title:'mainWindow'
    })

    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname, 'index.html'),
        protocol:'file:',
        slashes:true
    }))
    
    mainWindow.on('close', function(){
        mainWindow = null
    })
}

app.on('ready', ()=>{
    createWindow()
})