import React, { useEffect, useState } from "react";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { GraphCurve, StripToolConfig } from "../../../types";
import { useSelector } from "react-redux";
// Create plot component from minimal Plotly package
// This is necessary because normal Plot component is too large,
const Plot = createPlotlyComponent(Plotly);

type GraphProps = {
  xLabelStrings: string[],
  xAxisUnit: string,
  xTickValue: number,
  xTickMultiplier: number
}

export const Graph = (props: GraphProps): JSX.Element => {
    const {xLabelStrings, xAxisUnit, xTickValue, xTickMultiplier} = props;
    const time = useSelector((state: StripToolConfig) => state.time);
    const curves = useSelector((state: StripToolConfig) => state.curve);
    // Create data
    const numData = time.timespan / time.sampleInterval;
    const date = new Date()
    const timestamp = Math.floor(date.getTime()/1000.0);
    // Set the last x axis tick to be the current date time
    xLabelStrings[xLabelStrings.length-1] = `${new Date(timestamp * 1000).toTimeString().split(" ")[0]}\n${new Date((timestamp - time.timespan) * 1000).toDateString()}`;
    // Calculate x label values
    const xLabelValues: number[] = [];
    for (let i = 0; i < xLabelStrings.length; i++) {
      xLabelValues[i] = (timestamp - time.timespan) + ((i + 1) * xTickValue * xTickMultiplier);
    }
    const startingX = [timestamp - time.timespan];
    const startingY = [Math.random()];
    const [data, setData] = useState({x: startingX, y: startingY});
    calculateTimeAxisInterval(time.timespan);

    const {width, height} = getWindowDimensions();
    const {max, min} = getMinMax(curves);
    console.log(max, min)
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
      }, time.refreshInterval);
    
      return () => {
        clearInterval(interval);
      };
    }, [numData, time.refreshInterval]);

    return (
          <Plot
          data={[data]}
          layout={{
            width: width - 300,
            height: height - 10,
            title: "filename",
            xaxis: {
              tickvals: xLabelValues,
              ticktext: xLabelStrings,
              title: `(${xAxisUnit})`
            },
            yaxis: {
              type: curves[0].scale ? "log" : "linear",
              range: [min, max],
              title: curves[0] ? curves[0].units : "",
            }
          }} />
      );
  }

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function getMinMax(curves: GraphCurve[]) {
  const minArray = curves.map((curve) => curve.min);
  const maxArray = curves.map((curve) => curve.max);
  const min = Math.min(...minArray);
  const max = Math.max(...maxArray);
  return { 
    min, 
    max
  };
}

/**
 * 
 * @param timespan total x axis timespan in seconds
 */
function calculateTimeAxisInterval(timespan: number) {
  let intervalUnit = "seconds";
  // convert the number into hours, minutes, seconds
  const times = convertTimespan(timespan);
  // Years
  if (times[0] >= 17472) {
    intervalUnit = "Years"
  } else if (times[0] >= 672) {
    intervalUnit = "Months"
  } else if (times[0] >= 168) {
    intervalUnit = "Weeks"
  } else if (times[0] >= 24) {
    intervalUnit = "Days"
  } else if (times[0] >= 0) {
    intervalUnit = "Hours"
  } else if (times[1] >= 0) {
    intervalUnit = "Minutes"
  } else {
    intervalUnit = "Seconds"
  }

}

function convertTimespan(timespan: number) {
  // convert the number into hours, minutes, seconds
  const hours = Math.floor(timespan / 3600);
  const minutes = Math.floor((timespan - (hours * 3600)) / 60);
  //if (minutes >= 1) timespan =- (minutes * 60);
  const seconds = timespan - (hours * 3600) - (minutes * 60);
  return [hours, minutes, seconds];
}