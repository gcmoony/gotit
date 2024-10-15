import { ButtonGroup, Button } from "@mui/material"

export default function Navbar() {
  return (
    <nav>
      <ButtonGroup variant='contained' aria-label='Basic button group'>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </nav>
  )
}
