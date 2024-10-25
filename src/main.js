const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("node:path")
const data = require("./sampleData.json")

// Database stuff
const sequalite = require("better-sqlite3")
let db = new sequalite("foobar.db") //, { verbose: console.log })

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit()
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
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
  createWindow()
  // MacOS
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // Testing db stuff here
  createPartsTable()
  fillPartsTable()
})

// Quitting App
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }

  // Close DB connection
  db.close()
})

// For Database queries
async function showAllFromDb(dbName = "parts") {
  const query = `SELECT * FROM ${String(dbName)}`
  try {
    const parts = db.prepare(query).all()
    return parts
  } catch (err) {
    console.log("Error querying all: ", err)
    return
  }
}

async function createPartsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS parts (
      row_id INTEGER PRIMARY KEY,
      id STRING,
      name STRING NOT NULL,
      sku STRING,
      price REAL,
      tax INTEGER,
      status STRING,
      track_inventory INTEGER,
      on_hand_count INTEGER,
      category_01 STRING,
      cost REAL,
      map REAL,
      msrp REAL, 
      priority INTEGER,
      category_02 STRING,
      source STRING,
      location STRING
    )
  `
  db.exec(query)
}

function fillPartsTable() {
  const query = db.prepare(`INSERT OR REPLACE INTO parts 
    (row_id, id, name, sku, price, tax, status, track_inventory, on_hand_count, category_01, category_02, cost, map, msrp, priority, source, location) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

  let isEmpty = true

  const currentData = showAllFromDb("parts").then((ctx) => {
    isEmpty = ctx.length == 0
    if (isEmpty && data) {
      data.forEach((item) => {
        query.run(
          item.row_id,
          item.id,
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
          item.priority,
          item.source,
          item.location
        )
      })
    }
  })
}

ipcMain.on("select-all", (event, arg) => {
  const query = db.prepare(`SELECT * FROM ${arg}`)
  console.log(query.run())
})

// To handle IPC
ipcMain.on("table-request", (event, arg) => {
  const data = showAllFromDb(arg)
    .then((ctx) => {
      event.reply(`${arg}-table-response`, JSON.stringify(ctx), "OK") // Send a reply back
    })
    .catch((err) => {
      event.reply(`${arg}-table-response`, "An error has occurred")
    })
})

ipcMain.handle("row-update", (event, arg) => {
  console.log(arg)
  prepareInsert(arg)
  return "Hello from row-update"
})

ipcMain.handle("rows-delete", (event, arg) => {
  console.log(arg)
  prepareDelete(arg)
  return "Hello from row-delete"
})

function prepareDelete(idList) {
  for (let id of idList) {
    if (testRowExists(id)) {
      const query = db.prepare(`
        DELETE FROM parts WHERE row_id = ?`)
      query.run(id)
    }
  }
}

function prepareInsert(anObject) {
  // Check if item exists in db
  const exists = testRowExists(anObject.row_id)
  const fields = Object.keys(anObject)
  const cols = Object.values(anObject)
  console.log("Result: ", exists)

  // If new item
  if (!exists) {
    // Prepare queries
    const [fieldString, colString] = formatQuery(0, fields, cols)
    insertData(fieldString, colString, cols)
  }
  // If updating
  else {
    updateRow(anObject.row_id, fields, cols)
  }
}

function formatQuery(offset, fieldList, colList) {
  let fieldString = "("
  let i
  for (i = offset; i < fieldList.length - 1; i++) {
    fieldString += fieldList[i] + ", "
  }
  fieldString += fieldList[i] + ")"

  let colString = "("
  for (i = offset; i < colList.length - 1; i++) {
    colString += "?, "
  }
  colString += "?)"

  return [fieldString, colString]
}

function updateRow(rowID, fields, colList) {
  let setString = ""
  let i
  for (i = 1; i < fields.length - 1; i++) {
    setString += `${fields[i]} = ?, `
  }
  setString += `${fields[i]} = ?`

  setString = `UPDATE parts SET ${setString} WHERE row_id = ?`
  colList = colList.slice(1)
  colList.push(rowID)

  const query = db.prepare(setString)
  query.run(colList)
}

function testRowExists(rowID) {
  console.log(`Testing ${rowID}`)
  const query = db.prepare(`SELECT * FROM parts WHERE row_id == ${rowID}`)
  return query.get() ? true : false
}

function insertData(fieldString, valueString, values) {
  const query = db.prepare(`INSERT INTO parts
    ${fieldString}
    VALUES${valueString};`)
  console.log("Insertion: ", query.run(values))
}
