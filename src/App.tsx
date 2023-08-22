import './App.css';
import React from 'react';
import { GraphPanel } from './ui/graphPanel';
import { readFile } from './parser';
import { Routes, Route } from "react-router-dom";
import { ControlPanel } from './ui/controlPanel';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  //readFile("../vacuum1.stp");
  return (
    <ChakraProvider>
      <div className="App">
      <Routes>
        <Route path="/" element={<ControlPanel/>} />
        <Route path="/graph" element={<GraphPanel/>} />
      </Routes>
      </div>
    </ChakraProvider>
  );
}

export default App;
