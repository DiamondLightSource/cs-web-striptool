import React, { useEffect, useState } from "react";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { GraphCurve, StripToolConfig } from "../../../types";
import { useSelector } from "react-redux";
import { computeTimeTickLabels } from "../../../utils/computeTimeTicks";
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
    let {xLabelStrings, xAxisUnit, xTickValue, xTickMultiplier} = props;
    const fileName = useSelector((state: StripToolConfig) => state.file.name);
    const time = useSelector((state: StripToolConfig) => state.time);
    const curves = useSelector((state: StripToolConfig) => state.curve);
    // Create data
    const numData = time.numSamples;
    const date = new Date()
    const timestamp = date.getTime()/1000.0;
    // Set the last x axis tick to be the current date time
    xLabelStrings[xLabelStrings.length-1] = `${new Date(timestamp * 1000).toTimeString().split(" ")[0]}\n${new Date((timestamp - time.timespan) * 1000).toDateString()}`;
    // Calculate x label values
    const xLabelValues: number[] = [];
    for (let i = 0; i < xLabelStrings.length; i++) {
      xLabelValues[i] = (timestamp - time.timespan) + (i * xTickValue * xTickMultiplier);
    }
    const startingX = [timestamp - time.timespan];
    const startingY = [Math.random()];
    // Get window dimensions to calculate plot size
    const {width, height} = getWindowDimensions();
    const {max, min} = getMinMax(curves);
    const [data, setData] = useState({x: startingX, y: startingY, mode: "lines"});
    // Create initial layout object
    const initialLayout: any = {
      width: width - 300,
      height: height - 10,
      title: fileName,
      xaxis: {
        showline: true,
        ticks: "outside",
        tick0: xLabelValues[0],
        range: [xLabelValues[0], xLabelValues[xLabelValues.length - 1] + (time.timespan * 0.01)],
        tickmode: "array",
        tickvals: xLabelValues,
        ticktext: xLabelStrings,
        title: `(${xAxisUnit})`,
      },
      yaxis: {
        showline: true,
        zeroline: false,
        ticks: "outside",
        type: "linear",
        range: curves[0].scale ? [Math.log10(0.001), Math.log10(1)] : [0.001, 1], // set this dynamically
        title: curves[0] ? curves[0].units : "",
      },
      uirevision: 0 // This number needs to stay same to persist zoom on refresh
    }
    const [layout, setLayout] = useState(initialLayout)
    
    // Refresh plot at required interval to fetch new data
    useEffect(() => {
      // Update data won refresh interval
      const interval = setInterval(() => {
        const date = new Date();
        const xDate = date.getTime()
        const timestamp = date.getTime() / 1000;
        setData(prev => {
          const newLen = prev.x.push(timestamp);
          prev.y.push(Math.random())
          // If more values than buffer, take last n
          if (newLen > numData) {
            prev.x = prev.x.slice(-numData);
            prev.y = prev.y.slice(-numData);
          }
          return {
            x: prev.x,
            y: prev.y,
            mode: "lines"
          };
        });
        // Update x axis labels
        setLayout((prev: any) => {
          const xAxis = {...prev.xaxis};
          xAxis.tickvals = xAxis.tickvals.map((x: number) => x + time.refreshInterval);
          const things: Date[] = [];
          xAxis.tickvals.forEach((val: number) => {
            things.push(new Date(val * 1000));
          })
          xAxis.ticktext[xAxis.ticktext.length - 1] = `${new Date(xDate).toTimeString().split(" ")[0]}\n${new Date(xDate).toDateString()}`;
          xAxis.range = [xAxis.range[0] + time.refreshInterval, xAxis.range[1] + time.refreshInterval];
          xAxis.tick0 = xAxis.tickvals[0];
          return {
            ...prev,
            xaxis: xAxis
          }
        })
      }, time.refreshInterval * 1000); // Convert to milliseconds
    
      return () => {
        clearInterval(interval);
      };
    }, [numData, time.refreshInterval]);

    // Recalculates X axis tick labels when plot rerenders
    const handleRelayout = (event: any, viewUpdated: boolean) => {
      // TO DO - Handle panning, autorange and reset to home
      if (viewUpdated) {
        const date = new Date();
        // Calculate the new, zoomed out timespan
        const newTimespan: number = event["xaxis.range[1]"] - event["xaxis.range[0]"];
        // Set current time as far right time axis instead of event.xaxis.range[1]
        const xDate = new Date(date.getTime());
        // Find new x0 for current date and timespan
        const xNewAxisMax = (date.getTime()/1000);
        // Calculate labels
        let [labels, unit, tickValue, multiplier] = computeTimeTickLabels(newTimespan);
        // Set final label to  date
        labels[labels.length-1] = `${xDate.toTimeString().split(" ")[0]}\n${xDate.toDateString()}`;
        // Calculate values that ticks will sit on
        const values: number[] = [];
        for (let i = 0; i < labels.length; i++) {
          values[i] = xNewAxisMax - (i * tickValue * multiplier);
        }
        // Flip values so max time at end of array
        values.reverse();
        // Set new layout for new thing
        setLayout((prev: any) => {
          // TO DO - fix range not always displaying time
          const xAxis = {
            range: [Math.floor(xNewAxisMax - newTimespan), Math.ceil(xNewAxisMax + (newTimespan * 0.01))],
            tick0: values[0],
            tickvals: values,
            ticktext: labels,
            title: `(${unit})`,
          }
          return {
            ...prev,
            xaxis: xAxis,
          };
        });
      }
      // Else relayout was triggered by changing labels
    }

    return (<Plot onRelayout={(e) => handleRelayout(e, true)} data={[data]} layout={layout} />);
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