const fs      = require('fs');
const os      = require('os');
const path    = require('path');
const db = require('node-persist');

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipc = electron.ipcMain;
const shell = electron.shell;
const Shortcut = electron.globalShortcut;

const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1600, height: 800})
  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  Shortcut.register('Control+P', function() {
    mainWindow.webContents.print();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on('print-to-pdf', function (event) {
  const pdfPath = path.join(os.tmpdir(), 'atestado.pdf')
  const win = BrowserWindow.fromWebContents(event.sender)
  // Use default printing options
  win.webContents.printToPDF({}, function (error, data) {
    if (error) throw error
    fs.writeFile(pdfPath, data, function (error) {
      if (error) {
        throw error
      }
      shell.openExternal('file://' + pdfPath)
      event.sender.send('wrote-pdf', pdfPath)
    })
  })
});


db.initSync({
  dir: 'db'
});

ipc.on('leveldb-get', function(event, selector, key) {
  db.getItem(key, function(err, value) {
    if (err) {
      return event.sender.send('leveldb-response', selector, {error: err});
    }
    event.sender.send('leveldb-response', selector, {data: value});
  });
});

ipc.on('leveldb-put', function(event, selector, key, value) {
  db.setItem(key, value, function(err) {
    if (err) {
      return event.sender.send('leveldb-response', selector, {error: err});
    }
    event.sender.send('leveldb-response', selector, {data: {success: true}});
  });
});
