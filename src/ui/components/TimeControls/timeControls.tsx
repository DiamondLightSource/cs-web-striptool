import { Center, SimpleGrid} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { StripToolConfig } from "../../../types";
  
export const TimeControls = (): JSX.Element => {
    const time = useSelector((state: StripToolConfig) => state.time);
    console.log(`time ${time}`);
    return (
        <SimpleGrid columns={2} spacing={2}>
            <Center height='30px'> Time Span</Center>
            <Center height='30px'> {time.timespan}</Center>
            <Center height='30px'> Ring Buffer Size</Center>
            <Center height='30px'> {time.numSamples} </Center>
            <Center height='30px'> Data Sample Interval</Center>
            <Center height='30px'> {time.sampleInterval} </Center>
            <Center height='30px'> Graph Redraw Interval</Center>
            <Center height='30px'> {time.refreshInterval} </Center>
        </SimpleGrid>
    );
}