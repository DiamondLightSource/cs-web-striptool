import React, { useEffect, useState, CSSProperties } from "react";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { GraphPanelComponentProps } from "../types";
import classes from "./graphPanel.module.css";

// Create plot component from minimal Plotly package
// This is necessary because normal Plot component is too large,
const Plot = createPlotlyComponent(Plotly);

export const GraphPanel = (props: GraphPanelComponentProps): JSX.Element => {
    const { 
      graphConfig
    } = props;
    // Create data
    const numData = graphConfig.time.timespan / graphConfig.time.sampleInterval;
    const date = new Date()
    const timestamp = Math.floor(date.getTime()/1000.0);
    const startingX = [timestamp];
    const startingY = [Math.random()];
    const [data, setData] = useState({x: startingX, y: startingY});

    // TO DO:
    // x axis units
    // manage log scale
    // enforce max and min

    // Create legend element for each curve
    const curves: React.JSX.Element[] = [];
    graphConfig.curve.forEach((curve) => {
      const style: CSSProperties = {};
      style.borderColor = `rgba(${curve.color.toString()})`;
      // Text for inside box
      const text = `${curve.units}\n ${curve.scale} (${curve.min}, ${curve.max}) VAL=${data.y[-1]}\n ${curve.comment}`
      curves.push((
        <div key={curve.name}>
          <div className={classes.Curve} style={style}>
            {graphConfig.curve[0].name}
          </div>
          {text}
        </div>
      ));
    })
    
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
      }, graphConfig.time.refreshInterval);
    
      return () => {
        clearInterval(interval);
      };
    }, [numData, graphConfig.time.refreshInterval]);
    return (
        <><Plot
        className={classes.StripToolPlot}
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
        <div className={classes.Legend}>
          {curves}
        </div></>
      );
  }


/*  function createLines(): any[] {
    let traces: any[] = [];
    traces.push({
        name: dataSet.label.key, 
        y: dataSet.values.map(point => point[yName as keyof typeof point]),
        type: "scatter",
        mode: "cycle",
        marker: {
            color: dataSet.label.color, 
            symbol: symbol 
        },
    })
    return traces
}*/