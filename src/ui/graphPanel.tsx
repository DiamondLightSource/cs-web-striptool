import React from "react";
import { Legend } from "./components/Legend/legend";
import { Box } from "@chakra-ui/react";
import { Graph } from "./components/Graph/graph";


export const GraphPanel = (): JSX.Element => {
    return (
        <Box sx={{width: "100%"}}>
          <Legend></Legend>
          <Graph></Graph>
        </Box>
      );
  }