import Navbar from "../components/Navbar/Navbar.jsx"
import {
  Container,
  CssBaseline,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import PartTable from "../components/PartTable/PartTable.jsx"
import { useState } from "react"

const views = ["part-table", "assembly-table", "product-table"]

export default function Home() {
  const [currentView, setCurrentView] = useState(views[0])

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      setCurrentView(nextView)
    }
  }
  return (
    <CssBaseline>
      <Navbar>
        <ToggleButtonGroup
          value={currentView}
          exclusive
          onChange={handleViewChange}
        >
          <ToggleButton value={"part-table"}>Parts</ToggleButton>
          <ToggleButton value={"assembly-table"}>Assemblies</ToggleButton>
        </ToggleButtonGroup>
      </Navbar>
      {currentView === "part-table" && (
        <Container style={{ marginTop: "5rem" }}>
          <PartTable />
        </Container>
      )}
      {currentView === "assembly-table" && (
        <Container style={{ marginTop: "5rem", textAlign: "center" }}>
          No, not yet 💩
        </Container>
      )}
      {currentView === "product-table" && <Container></Container>}
    </CssBaseline>
  )
}
