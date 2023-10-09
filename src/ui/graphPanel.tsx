import React from "react";
import { Legend } from "./components/Legend/legend";
import { Box } from "@chakra-ui/react";
import { Graph } from "./components/Graph/graph";
import { useSelector } from "react-redux";
import type { StripToolConfig } from "../types";
import { computeTimeTickLabels } from "../utils/computeTimeTicks";

export const GraphPanel = (): JSX.Element => {
  const timespan: number = useSelector(
    (state: StripToolConfig) => state.time.timespan
  );
  const [labels, unit, tickValue, multiplier] = computeTimeTickLabels(timespan);
  return (
    <Box sx={{ width: "100%" }}>
      <Legend></Legend>
      <Graph
        xLabelStrings={labels}
        xAxisUnit={unit}
        xTickValue={tickValue}
        xTickMultiplier={multiplier}
      ></Graph>
    </Box>
  );
};
