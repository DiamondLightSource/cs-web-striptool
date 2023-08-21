import './App.css';
import React, { useState } from 'react';
import { GraphPanel } from './ui/graphPanel';
import { readFile } from './parser';
import { Routes, Route } from "react-router-dom";
import { StripToolConfig } from './types';
import { ControlPanel } from './ui/controlPanel';
import { ChakraProvider } from '@chakra-ui/react'

const TEST_CONFIG: StripToolConfig = {
  config: "wah",
    option: {
        gridXOn: 1,
        gridYOn: 1,
        axisYColorStat: false,
        graphLineWidth: 2
    },
    time: {
        timespan: 300,
        numSamples: 700,
        sampleInterval: 1,
        refreshInterval: 1
    },
    color: {
        background: [0, 0, 0],
        foreground: [41, 56, 200],
        grid: [95, 76, 120]
    },
    curve: [
      {
        name: "BL-PV-THING-NAME-HEREs",
        color: [1, 1, 1],
        units: "sheep",
        comment: "lots of sheep",
        precision: 0.01,
        min: 20,
        max: 400,
        scale: true,
        plotStatus: false
      }
    ]
}

function App() {
  //readFile("../vacuum1.stp");
  //<GraphPanel graphConfig={TEST_CONFIG}></GraphPanel>
  //<ControlPanel graphConfig={TEST_CONFIG}></ControlPanel>

  const [config, setConfig] = useState(TEST_CONFIG);
  return (
    <ChakraProvider>
      <div className="App">
      <Routes>
        <Route path="/" element={<ControlPanel graphConfig={config}/>} />
        <Route path="/graph" element={<GraphPanel graphConfig={config}/>} />
      </Routes>
      </div>
    </ChakraProvider>
  );
}

export default App;
