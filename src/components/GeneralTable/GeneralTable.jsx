import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { useState, useEffect } from "react"

export default function GeneralTable() {
  const [data, setData] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  function setupListeners() {
    window.electron.receive("log-reply", (arg) => {
      console.log(JSON.parse(arg)) // Print the reply to the console
      setData(JSON.parse(arg))
      // document.querySelector("#catcher").textContent = arg
    })
  }
  setupListeners()

  function loadData() {
    window.electron.send("log-message", "Hello from Renderer!")
  }

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650 }}
        aria-label='simple table'
      >
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Part Name</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Tax</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Track Inventory</TableCell>
            <TableCell>On Hand</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Map</TableCell>
            <TableCell>MSRP</TableCell>
            <TableCell>Markup</TableCell>
            <TableCell>Margin</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Secondary Category</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component='th'
                scope='row'
              >
                {row.id}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.sku}</TableCell>
              <TableCell>{parseFloat(row.price).toFixed(2)}</TableCell>
              <TableCell>{row.tax > 0 ? "true" : "false"}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>
                {row.track_inventory > 0 ? "true" : "false"}
              </TableCell>
              <TableCell>{row.on_hand_count}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{parseFloat(row.cost).toFixed(2)}</TableCell>
              <TableCell>{parseFloat(row.map).toFixed(2)}</TableCell>
              <TableCell>{parseFloat(row.msrp).toFixed(2)}</TableCell>
              <TableCell>{parseFloat(row.markup).toFixed(2)}</TableCell>
              <TableCell>{parseFloat(row.margin).toFixed(2)}</TableCell>
              <TableCell>{parseFloat(row.rating).toFixed(2)}</TableCell>
              <TableCell>{row.category_02}</TableCell>
              <TableCell>{row.priority}</TableCell>
              <TableCell>{row.source}</TableCell>
              <TableCell>{row.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
