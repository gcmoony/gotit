import * as React from "react"
import { useState, useEffect } from "react"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid"
import Paper from "@mui/material/Paper"
import "./PartTable.css"
import { Button } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { Delete } from "@mui/icons-material"

// Table setup
// Rating, margin, and markup are calculated
const partCols = [
  // { field: "row_id", headerName: "Row ID", width: 80, editable: false },
  { field: "id", headerName: "ID", width: 130, editable: true },
  { field: "name", headerName: "Name", width: 130, editable: true },
  {
    field: "price",
    headerName: "Price",
    width: 130,
    valueGetter: (value, row) => {
      return `${parseFloat(row.price).toFixed(2)}`
    },
    editable: true,
  },
  {
    field: "cost",
    headerName: "Cost",
    width: 130,
    valueGetter: (value, row) => {
      return `${parseFloat(row.cost).toFixed(2)}`
    },
    editable: true,
  },
  { field: "sku", headerName: "SKU", width: 130, editable: true },
  {
    field: "map",
    headerName: "MAP",
    width: 130,
    valueGetter: (value, row) => {
      return `${parseFloat(row.map).toFixed(2)}`
    },
    editable: true,
  },
  {
    field: "msrp",
    headerName: "MSRP",
    width: 130,
    valueGetter: (value, row) => {
      return `${parseFloat(row.msrp).toFixed(2)}`
    },
    editable: true,
  },
  {
    field: "markup",
    headerName: "Markup",
    width: 130,
    valueGetter: (value, row) => {
      return `${parseFloat(row.price - row.cost).toFixed(2)}`
    },
  },
  {
    field: "margin",
    headerName: "Margin",
    width: 130,
    valueGetter: (value, row) => {
      return `${parseFloat((row.price - row.cost) / row.price).toFixed(3)}`
    },
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 130,
    valueGetter: (value, row) => {
      return `${parseFloat(
        (row.price - row.cost) * ((row.price - row.cost) / row.price)
      ).toFixed(3)}`
    },
  },
  {
    field: "category_01",
    headerName: "Category 1",
    width: 130,
    editable: true,
  },
  {
    field: "category_02",
    headerName: "Category 2",
    width: 130,
    editable: true,
  },
  { field: "priority", headerName: "Priority", width: 130, editable: true },
  { field: "location", headerName: "Location", width: 130, editable: true },
  { field: "source", headerName: "Source", width: 130, editable: true },
]

const paginationModel = { page: 0, pageSize: 25 }

export default function PartTable() {
  const [data, setData] = useState([])
  const [selectedRows, setSelectedRows] = useState([])

  useEffect(() => {
    loadData()
    listenForResponse()
  }, [])

  // Database interaction
  function loadData() {
    // Requests the part table from database

    window.electron.send("table-request", "parts")
  }

  async function handleDelete() {
    // console.log(selectedRows)
    await window.electronAPI.deleteRows(selectedRows)
    await setTimeout(loadData, 1000)
  }

  async function updateData(row) {
    // console.log(row)

    const returnText = await window.electronAPI.updateRow(row)
    await setTimeout(() => {
      loadData()
    }, 1000)
    return row
  }

  function updateDataError() {
    console.log(`Failed to update row`)
  }

  // Receives events from main process

  function listenForResponse() {
    window.electron.receive("parts-table-response", (...args) => {
      args[1] === "OK"
        ? setData(JSON.parse(args[0]))
        : console.log("Error fetching parts table")
    })
  }

  return (
    <Paper sx={{ width: "100%" }}>
      <DataGrid
        rows={data}
        getRowId={(row) => row.row_id}
        // getRowId={getRowId}
        columns={partCols}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[25, 50, 100]}
        processRowUpdate={updateData}
        onProcessRowUpdateError={updateDataError}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection)
        }}
        density='compact'
        slots={{
          toolbar: Toolbar,
        }}
        slotProps={{
          toolbar: { setData },
        }}
        editMode='row'
      />
    </Paper>
  )

  function Toolbar(props) {
    const { setData, SetRowModesModel } = props

    function generateNum() {
      return Math.floor(Math.random() * 30000)
    }

    function generateID(rowList) {
      let newID = generateNum()
      let foundDupe = false
      for (let item of rowList) {
        if (newID == item.row_id) foundDupe = true
      }
      return foundDupe ? generateID(rowList) : newID
    }
    // Creating an item
    const handleChange = () => {
      setData((oldRows) => {
        let newID = generateID(oldRows)

        return [
          ...oldRows,
          {
            row_id: newID,
            id: "None",
            name: "",
            price: 0,
            cost: 0,
            sku: "",
            map: 0,
            msrp: 0,
            // markup: "",
            // rating: "",
            category_01: "",
            category_02: "",
            priority: "",
            location: "",
            source: "",
          },
        ]
      })
    }

    return (
      <GridToolbarContainer className='flex'>
        <div className='flex'>
          <GridToolbarQuickFilter />
        </div>
        <div className='flex'>
          {selectedRows.length > 0 && (
            <Button
              startIcon={<Delete />}
              onClick={handleDelete}
              variant='contained'
              color='error'
            >
              Delete Selected
            </Button>
          )}
          <Button
            startIcon={<AddIcon />}
            onClick={handleChange}
            variant='outlined'
          >
            New Part
          </Button>
        </div>
      </GridToolbarContainer>
    )
  }
}
