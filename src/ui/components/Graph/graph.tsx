import React, { useEffect, useState } from "react";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { useSelector } from "react-redux";
import { computeTimeTickLabels } from "../../../utils/computeTimeTicks";
import { StateConfig } from "../../../redux/state";
import { MultipleConnectingComponent } from "../ConnectingComponent/connectingComponent";
import {
  InferWidgetProps,
  IntPropOpt,
  StringArrayPropOpt,
  StringPropOpt
} from "../../../types/propTypes";
import {
  MultiplePVComponent,
  MultiplePVPropType
} from "../../../types/widgetProps";
import { Curve } from "../../../types/curve";
// Create plot component from minimal Plotly package
// This is necessary because normal Plot component is too large,
const Plot = createPlotlyComponent(Plotly);

const GraphProps = {
  xLabelStrings: StringArrayPropOpt,
  xAxisUnit: StringPropOpt,
  xTickValue: IntPropOpt,
  xTickMultiplier: IntPropOpt
};

export type GraphComponentProps = InferWidgetProps<typeof GraphProps> &
  MultiplePVComponent;

const ZOOM_FACTORS: number[] = [0.5, 2];

export const GraphComponent = (props: GraphComponentProps): JSX.Element => {
  const {
    xLabelStrings = [],
    xAxisUnit = "seconds",
    xTickValue = 1,
    xTickMultiplier = 1
  } = props;
  const fileName = useSelector((state: StateConfig) => state.config.file.name);
  const time = useSelector((state: StateConfig) => state.config.time);
  const curves = useSelector((state: StateConfig) => state.config.curve);
  // Create data
  const numData = time.numSamples;
  const date = new Date();
  const timestamp = date.getTime() / 1000.0;
  // Set the last x axis tick to be the current date time
  xLabelStrings[xLabelStrings.length - 1] = `${
    new Date(timestamp * 1000).toTimeString().split(" ")[0]
  }\n${new Date((timestamp - time.timespan) * 1000).toDateString()}`;
  // Calculate x label values
  const xLabelValues: number[] = [];
  for (let i = 0; i < xLabelStrings.length; i++) {
    xLabelValues[i] =
      timestamp - time.timespan + i * xTickValue * xTickMultiplier;
  }
  const startingX = [timestamp];
  const startingY = [Math.random()];
  // Get window dimensions to calculate plot size
  const { width, height } = getWindowDimensions();
  const { max, min } = getMinMax(curves);
  const [data, setData] = useState({
    x: startingX,
    y: startingY,
    mode: "lines",
    hoverinfo: "text",
    text: [
      `${new Date(startingX[0] * 1000).toTimeString().split(" ")[0]} ${new Date(
        startingX[0] * 1000
      ).toDateString()},<br>${startingY[0]}`
    ]
  });
  // This determines whether the far time axis value should be the current time or another
  const [currentTimeFixed, setCurrentTimeFixed] = useState(true);

  // Create initial layout object
  const initialLayout: any = {
    width: width - 300,
    height: height - 10,
    title: fileName,
    xaxis: {
      showline: true,
      ticks: "outside",
      tick0: xLabelValues[0],
      range: [
        xLabelValues[0],
        xLabelValues[xLabelValues.length - 1] + time.timespan * 0.01
      ],
      tickmode: "array",
      tickvals: xLabelValues,
      ticktext: xLabelStrings,
      title: `(${xAxisUnit})`
    },
    yaxis: {
      showline: true,
      zeroline: false,
      ticks: "outside",
      type: "linear",
      range: curves[0].scale ? [Math.log10(0.001), Math.log10(1)] : [0.001, 1], // set this dynamically
      title: curves[0] ? curves[0].units : ""
    },
    uirevision: 0 // This number needs to stay same to persist zoom on refresh
  };

  // Set initial layout and axis ranges
  const [layout, setLayout] = useState(initialLayout);
  const [lastRanges, setLastRanges] = useState({
    x: initialLayout.xaxis.range[1] - initialLayout.xaxis.range[0],
    y: initialLayout.yaxis.range[1] - initialLayout.yaxis.range[0]
  });

  // Refresh plot at required interval to fetch new data
  useEffect(() => {
    // Update data won refresh interval
    const interval = setInterval(() => {
      const date = new Date();
      const timestamp = date.getTime() / 1000;
      setData(prev => {
        const newLen = prev.x.push(timestamp);
        const num = Math.random();
        prev.y.push(num);
        prev.text.push(
          `${
            new Date(timestamp * 1000).toTimeString().split(" ")[0]
          } ${new Date(timestamp * 1000).toDateString()},<br>${num}`
        );
        // If more values than buffer, take last n
        if (newLen > numData) {
          prev.x = prev.x.slice(-numData);
          prev.y = prev.y.slice(-numData);
        }
        return {
          x: prev.x,
          y: prev.y,
          mode: "lines",
          text: prev.text,
          hoverinfo: "text"
        };
      });
      // Update x axis labels
      setLayout((prev: any) => {
        const xAxis = { ...prev.xaxis };
        xAxis.showline = true;
        xAxis.ticks = "outside";
        xAxis.tickvals = xAxis.tickvals.map(
          (x: number) => x + time.refreshInterval
        );
        const things: Date[] = [];
        xAxis.tickvals.forEach((val: number) => {
          things.push(new Date(val * 1000));
        });
        xAxis.ticktext[xAxis.ticktext.length - 1] = `${
          new Date(xAxis.tickvals[xAxis.tickvals.length - 1] * 1000)
            .toTimeString()
            .split(" ")[0]
        }\n${new Date(
          xAxis.tickvals[xAxis.tickvals.length - 1] * 1000
        ).toDateString()}`;
        xAxis.range = [
          xAxis.range[0] + time.refreshInterval,
          xAxis.range[1] + time.refreshInterval
        ];
        xAxis.tick0 = xAxis.tickvals[0];
        return {
          ...prev,
          xaxis: xAxis
        };
      });
    }, time.refreshInterval * 1000); // Convert to milliseconds

    return () => {
      clearInterval(interval);
    };
  }, [numData, time.refreshInterval]);

  // Recalculates X axis tick labels when plot rerenders
  const handleRelayout = (event: any, viewUpdated: boolean) => {
    // Don't relayout if changing between zoom and pan modes
    if (event["dragmode"] === "pan") {
      // In pan mode we can use different time for max x axis value
      setCurrentTimeFixed(false);
    } else if (event["dragmode"] === "zoom") {
      return;
    } else if (event["xaxis.autorange"] === true && event["yaxis.autorange"]) {
      return;
    } else {
      // Check relayout event was real and not triggered by updating labels
      if (viewUpdated) {
        // Calculate the new timespan
        const newTimespan: number =
          event["xaxis.range[1]"] - event["xaxis.range[0]"];
        const newYRange: number =
          event["yaxis.range[1]"] - event["yaxis.range[0]"];

        // Calculate how much both axis ranges changed by
        const xFactor = newTimespan / lastRanges.x;
        const yFactor = newYRange / lastRanges.y;

        // Create labels
        const [labels, unit, tickValue, multiplier] =
          computeTimeTickLabels(newTimespan);

        // If range changes by factor other than 0.2 or 2, select zoom used. Axis time no longer fixed
        if (!ZOOM_FACTORS.includes(xFactor) && !ZOOM_FACTORS.includes(yFactor))
          setCurrentTimeFixed(false);
        const date = new Date();
        // Find max date for x (time) axis
        const xDate: Date = currentTimeFixed
          ? new Date(date.getTime())
          : new Date(event["xaxis.range[1]"] * 1000);
        // Find max number for x (time) axis
        const xNewAxisMax: number = xDate.getTime() / 1000;

        // If axes reset, fix current time as x axis max
        if (
          event["xaxis.showspikes"] === false &&
          event["xaxis.showspikes"] === false
        )
          setCurrentTimeFixed(true);

        // Set final label to  date
        labels[labels.length - 1] = `${
          xDate.toTimeString().split(" ")[0]
        }\n${xDate.toDateString()}`;
        // Calculate values that ticks will sit on
        const values: number[] = [];
        for (let i = 0; i < labels.length; i++) {
          values[i] = xNewAxisMax - i * tickValue * multiplier;
        }
        // Flip values so max time at end of array
        values.reverse();

        // Apply the new axis limits and labels
        const xNewRange = [
          Math.floor(xNewAxisMax - newTimespan),
          Math.ceil(xNewAxisMax + newTimespan * 0.01)
        ];
        setLayout((prev: any) => {
          const xAxis = {
            showline: true,
            ticks: "outside",
            range: xNewRange,
            tick0: values[0],
            tickvals: values,
            ticktext: labels,
            title: `(${unit})`
          };
          return {
            ...prev,
            xaxis: xAxis
          };
        });

        // Finally set the current axis ranges
        setLastRanges({ x: xNewRange[1] - xNewRange[0], y: newYRange });
      }
    }
  };
  return (
    <Plot
      onRelayout={e => handleRelayout(e, true)}
      data={[data]}
      layout={layout}
    />
  );
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function getMinMax(curves: Curve[]) {
  const minArray = curves.map(curve => curve.min);
  const maxArray = curves.map(curve => curve.max);
  const min = Math.min(...minArray);
  const max = Math.max(...maxArray);
  return {
    min,
    max
  };
}

const GraphPVProps = {
  ...GraphProps,
  ...MultiplePVPropType
};

export const Graph = (
  props: InferWidgetProps<typeof GraphPVProps>
): JSX.Element => (
  <MultipleConnectingComponent component={GraphComponent} widgetProps={props} />
);
