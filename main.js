const electron = require('electron')
const {app, BrowserWindow, webContents} = electron
const path = require('path')
const url = require('url')


let mainWindow = null

app.on('ready', ()=>{
    console.log('hello from electron')
    mainWindow = new BrowserWindow()
    mainWindow.loadFile('index.html')
    
    //devTool
    //mainWindow.webContents.openDevTools()
})