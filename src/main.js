const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("node:path")
const fs = require("fs")

// Database stuff
const sequalite = require("better-sqlite3")
let db = new sequalite("foobar.db", { verbose: console.log })

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit()
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: true,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // ipcMain.on("query:get-items", showAllFromDb)
  createWindow()

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // Testing db stuff here
  // initilizeDatabase()
  createTableIntoDb("temp")
  fillTableWithExamples()
  // showAllFromDb()
})

ipcMain.on("test", (e, args) => {
  // console.log(args)
  e.reply("test-reply", "From main")
})

ipcMain.on("log-message", (event, arg) => {
  console.log(arg) // Print the message from the renderer to the main console
  const data = showAllFromDb().then((ctx) => {
    // console.log(JSON.stringify(ctx))
    event.reply("log-reply", JSON.stringify(ctx)) // Send a reply back
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }

  // Close DB connection
  db.close()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
async function showAllFromDb() {
  const query = "SELECT * FROM parts"
  try {
    const parts = db.prepare(query).all()
    return parts
  } catch (err) {
    console.log("Error querying all: ", err)
    return
  }
}

async function createTableIntoDb(dbName) {
  const query = `
    CREATE TABLE IF NOT EXISTS parts (
      id INTEGER PRIMARY KEY,
      name STRING NOT NULL,
      sku STRING UNIQUE,
      price REAL,
      tax INTEGER,
      status STRING,
      track_inventory INTEGER,
      on_hand_count INTEGER,
      category STRING,
      cost REAL,
      map REAL,
      msrp REAL, 
      markup REAL,
      margin REAL,
      rating REAL,
      priority INTEGER,
      category_02 STRING,
      source STRING,
      location STRING
    )
  `
  db.exec(query)
}

async function fillTableWithExamples() {
  const data = [
    {
      name: "barrel",
      sku: "sku01",
      price: 50.0,
      tax: 1,
      status: "active",
      track_inventory: 1,
      on_hand_count: 4,
      category: "AR Part",
      category_02: "Gun Components",
      cost: 24.2,
      msrp: 15.0,
      map: 1.2,
      markup: 35.0,
      margin: 0.52,
      rating: 7,
      priority: 2,
      source: "Manufacturer A",
      location: "Warehouse 1",
    },
    {
      name: "nut",
      sku: "sku02",
      price: 15.5,
      tax: 1,
      status: "active",
      track_inventory: 1,
      map: 1.2,
      on_hand_count: 10,
      category: "Hardware",
      category_02: "Fasteners",
      cost: 7.0,
      msrp: 12.0,
      markup: 22.0,
      margin: 0.47,
      rating: 8,
      priority: 3,
      source: "Supplier B",
      location: "Warehouse 2",
    },
    {
      name: "screw",
      sku: "sku03",
      price: 1.5,
      tax: 0,
      status: "active",
      track_inventory: 1,
      on_hand_count: 50,
      map: 1.2,
      category: "Hardware",
      category_02: "Fasteners",
      cost: 0.5,
      msrp: 2.0,
      markup: 1.0,
      margin: 0.66,
      rating: 9,
      priority: 1,
      source: "Supplier B",
      location: "Shelf A3",
    },
    {
      name: "handguard",
      sku: "sku04",
      price: 120.0,
      tax: 1,
      status: "active",
      track_inventory: 1,
      map: 1.2,
      on_hand_count: 6,
      category: "AR Part",
      category_02: "Gun Components",
      cost: 70.0,
      msrp: 110.0,
      markup: 50.0,
      margin: 0.58,
      rating: 6,
      priority: 2,
      source: "Manufacturer A",
      location: "Warehouse 1",
    },
    {
      name: "muzzle brake",
      sku: "sku05",
      price: 45.0,
      tax: 1,
      status: "active",
      track_inventory: 1,
      on_hand_count: 12,
      map: 1.2,
      category: "AR Part",
      category_02: "Gun Components",
      cost: 20.0,
      msrp: 40.0,
      markup: 25.0,
      margin: 0.44,
      rating: 8,
      priority: 3,
      source: "Supplier C",
      location: "Shelf B2",
    },
    {
      name: "buffer tube",
      sku: "sku06",
      price: 35.0,
      tax: 1,
      status: "active",
      track_inventory: 1,
      map: 1.2,
      on_hand_count: 8,
      category: "AR Part",
      category_02: "Gun Components",
      cost: 18.0,
      msrp: 30.0,
      markup: 17.0,
      margin: 0.51,
      rating: 7,
      priority: 1,
      source: "Manufacturer A",
      location: "Warehouse 3",
    },
  ]

  const query = db.prepare(`INSERT OR REPLACE INTO parts 
    (name, sku, price, tax, status, track_inventory, on_hand_count, category, category_02, cost, map, msrp, markup, margin, rating, priority, source, location) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

  let isEmpty = true

  const currentData = showAllFromDb().then((ctx) => {
    isEmpty = ctx.length == 0
    if (isEmpty) {
      data.forEach((item) => {
        query.run(
          item.name,
          item.sku,
          item.price,
          item.tax,
          item.status,
          item.track_inventory,
          item.on_hand_count,
          item.category,
          item.category_02,
          item.cost,
          item.map,
          item.msrp,
          item.markup,
          item.margin,
          item.rating,
          item.priority,
          item.source,
          item.location
        )
      })
    }
  })
}

// function initilizeDatabase() {
//   db = new sequalite("foobar.db", { verbose: console.log })
// }
