import React from "react";
import {Box, Button } from "@chakra-ui/react";
import { CurveTable } from "./components/CurveTable/curveTable";
import { GraphCurve } from "../types";

interface TabPanelProps {
    curves: GraphCurve[];
}
  
export const CurvesTab = (props: TabPanelProps): JSX.Element => {

    return (
    <>
      <Box borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <CurveTable curve={props.curves} />
      </Box>
    </>);
}