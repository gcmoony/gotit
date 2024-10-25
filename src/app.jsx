import React from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider, createTheme } from "@mui/material"
import Home from "./pages/Home.jsx"

const rootNode = createRoot(document.getElementById("root"))

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

rootNode.render(
  <>
    <ThemeProvider theme={darkTheme}>
      <Home />
    </ThemeProvider>
  </>
)
