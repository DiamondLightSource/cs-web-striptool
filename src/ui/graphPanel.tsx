import React from "react";
import { LegendList } from "./components/Legend/legend";
import { Box } from "@chakra-ui/react";
import { Graph } from "./components/Graph/graph";
import { useSelector } from "react-redux";
import { computeTimeTickLabels } from "../utils/computeTimeTicks";
import { StateConfig } from "../redux/state";
import { Curve } from "../types/curve";
import { PV } from "../types/pv";

export const GraphPanel = (): JSX.Element => {
  const timespan: number = useSelector(
    (state: StateConfig) => state.config.time.timespan
  );
  const curves: Curve[] = useSelector(
    (state: StateConfig) => state.config.curve
  );
  const names: PV[] = curves.map((curve: Curve) => new PV(curve.name, "ca"));
  const [labels, unit, tickValue, multiplier] = computeTimeTickLabels(timespan);
  return (
    <Box sx={{ width: "100%" }}>
      <LegendList></LegendList>
      <Graph
        pvNames={names}
        xLabelStrings={labels}
        xAxisUnit={unit}
        xTickValue={tickValue}
        xTickMultiplier={multiplier}
      ></Graph>
    </Box>
  );
};
