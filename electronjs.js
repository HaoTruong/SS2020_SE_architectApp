const {
	app,
	BrowserWindow,
	Menu
} = require('electron')
var ipcMain = require('electron').ipcMain
//Toggle this one when app is in prod
//process.env.NODE_ENV = 'production';

function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1920,
		height: 1200,
		webPreferences: {
			nodeIntegration: true
		}
	})
	// and load the index.html of the app.
	win.loadFile('src/index.html')

	// Open the DevTools.
	//win.webContents.openDevTools()

	// Create the menu
	const menuTemplate = [{
			label: 'Main',
			submenu: [{
					label: 'Menu Value 1',
					click() {
						// do something
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Menu Value 2',
					click() {
						// do something 
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Exit',
					accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
					click() {
						app.quit()
					}
				}
			]
		},

		{
			label: 'Help'
		},

		{
			label: 'About'
		}
	]
	// Fix for Mac menu not showing first label
	if (process.platform === 'darwin') {
		menuTemplate.unshift({
			label: 'Electron'
		})
	}
	//Add devtool toggle and reload if we are in dev
	if (process.env.NODE_ENV !== 'production') {
		menuTemplate.push({
			label: 'Developer Tools',
			submenu: [{
					label: "Toggle Developer Tools",
					accelerator: process.platform === 'darwin' ? 'Command+Option+I' : 'Ctrl+Shift+I',
					click(item, focuswindow) {
						focuswindow.toggleDevTools();
					}
				},
				{
					role: 'reload'
				}
			]
		})
	}
	//Set menu template to application
	const menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

ipcMain.on('show-architectureWindow', function(e, arg) {
	openArchitectureWindow(arg);
})

var architectureWindow = null;
function openArchitectureWindow(architectureName) {
	if (architectureWindow)
	{
		architectureWindow.focus()
		return
	}
	architectureWindow = new BrowserWindow({
		height: 1000,
		resizable: false,
		width: 800,
		title: architectureName,
		minimizable: true,
		fullscreenable: false,
		webPreferences: {
			nodeIntegration: true
		}
	})
	architectureWindow.loadFile('src/architectureWindow/architectureWindow.html');

	architectureWindow.on('closed', function() {
		architectureWindow = null;
	})
	console.log(architectureWindow.webContents.getProcessId());
	architectureWindow.webContents.on('did-finish-load', ()=> {
		architectureWindow.webContents.send('send-architectureName', architectureName);
	})
}