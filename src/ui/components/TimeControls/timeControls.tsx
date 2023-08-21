import { Center, SimpleGrid} from "@chakra-ui/react";
import React from "react";
import { StripToolConfig } from "../../../types";


interface ControlsTabProps {
    graphOptions: StripToolConfig
  }
  
export const TimeControls = (props: ControlsTabProps): JSX.Element => {
    const {graphOptions} = props;

    return (
        <SimpleGrid columns={2} spacing={2}>
            <Center height='30px'> Time Span</Center>
            <Center height='30px'> {graphOptions.time.timespan}</Center>
            <Center height='30px'> Ring Buffer Size</Center>
            <Center height='30px'> {graphOptions.time.numSamples} </Center>
            <Center height='30px'> Data Sample Interval</Center>
            <Center height='30px'> {graphOptions.time.sampleInterval} </Center>
            <Center height='30px'> Graph Redraw Interval</Center>
            <Center height='30px'> {graphOptions.time.refreshInterval} </Center>
        </SimpleGrid>
    );
}