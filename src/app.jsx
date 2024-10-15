import React from "react";
import {createRoot} from 'react-dom/client'
import Button from '@mui/material/Button';
import Navbar from "./components/Navbar/Navbar.jsx"

const rootNode = createRoot(document.getElementById("root"))
rootNode.render(<>
  <Navbar/>
  <h1>Hello from app</h1>
  <Button variant="contained">MUI Button</Button>
</>)