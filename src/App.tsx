import './App.css';
import React from 'react';
import { GraphPanel } from './ui/graphPanel';
import { Routes, Route } from "react-router-dom";
import { ControlPanel } from './ui/controlPanel';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
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
