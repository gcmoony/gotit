import { ButtonGroup, Container, List } from "@mui/material"
import "./Navbar.css"
import { useState } from "react"

export default function Navbar({ children }) {
  const [currentPage, setCurrentPage] = useState(0)

  function handlePageChange() {
    setCurrentPage(count + 1)
  }
  return (
    <Container>
      <nav>
        <div>
          <h1>GotIt?</h1>
          <p>Inventory Management</p>
        </div>

        <List>{children}</List>
      </nav>
    </Container>
  )
}
