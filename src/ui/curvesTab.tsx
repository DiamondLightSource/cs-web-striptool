import React from "react";
import { Box } from "@chakra-ui/react";
import { CurveTable } from "./components/CurveTable/curveTable";

export const CurvesTab = (): JSX.Element => {

    return (
    <>
      <Box borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <CurveTable />
      </Box>
    </>);
}