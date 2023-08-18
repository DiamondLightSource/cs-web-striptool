import './App.css';
import React from 'react';
import { GraphPanel } from './ui/graphPanel';
import { readFile } from './parser';
import { StripToolConfig } from './types';

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
        name: "BL-PV-THING-NAME-HERE",
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
  //eadFile("../vacuum1.stp");
  return (
    <div className="App">
      <GraphPanel graphConfig={TEST_CONFIG}></GraphPanel>
    </div>
  );
}

export default App;
