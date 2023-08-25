import React, { useEffect, useState } from "react";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { StripToolConfig } from "../../../types";
import { useSelector } from "react-redux";
// Create plot component from minimal Plotly package
// This is necessary because normal Plot component is too large,
const Plot = createPlotlyComponent(Plotly);

export const Graph = (): JSX.Element => {
    const state = useSelector((state: StripToolConfig) => state);
    // Create data
    const numData = state.time.timespan / state.time.sampleInterval;
    const date = new Date()
    const timestamp = Math.floor(date.getTime()/1000.0);
    const startingX = [timestamp];
    const startingY = [Math.random()];
    const [data, setData] = useState({x: startingX, y: startingY});

    // TO DO:
    // x axis units
    // manage log scale
    // enforce max and min
    
    useEffect(() => {
      // here we should actually be updating values every time new data comes in?
      const interval = setInterval(() => {
        const date = new Date();
        const timestamp = Math.floor(date.getTime()/1000.0);
        setData(prev => {
          const newLen = prev.x.push(timestamp);
          prev.y.push(Math.random())
          // now we want to make sure we take only the last n values
          if (newLen > numData) {
            prev.x = prev.x.slice(-numData);
            prev.y = prev.y.slice(-numData);
          }
          return {
            x: prev.x,
            y: prev.y
          };
        });
      }, state.time.refreshInterval);
    
      return () => {
        clearInterval(interval);
      };
    }, [numData, state.time.refreshInterval]);
    return (
          <Plot
          data={[data]}
          layout={{
            title: "graph",
            xaxis: {
              //range: [-5, count],
              title: "x axis"
            },
            yaxis: {
              //range: [-5, count],
              title: "graph",
            }
          }} />
      );
  }