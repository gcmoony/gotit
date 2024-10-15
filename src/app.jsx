import React from "react";
import {createRoot} from 'react-dom/client'
import Button from '@mui/material/Button';
import Navbar from "./components/Navbar/Navbar.jsx"
import GeneralTable from "./components/GeneralTable/GeneralTable.jsx";

const rootNode = createRoot(document.getElementById("root"))

rootNode.render(<>
  <Navbar/>
  <GeneralTable/>
</>)