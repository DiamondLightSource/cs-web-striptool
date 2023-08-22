import { Center, Checkbox, Radio, RadioGroup, Select, SimpleGrid, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { StripToolConfig } from "../../../types";

  
export const GraphOptions = (): JSX.Element => {
    const color = useSelector((state: StripToolConfig) => state.color);
    const yAxisBool = useSelector((state: StripToolConfig) => state.option.axisYColorStat);
    const [labelColor, setLabelColor] = React.useState(yAxisBool.toString())

    return (
        <SimpleGrid columns={2} spacing={2}>
            <Center height='30px'> Graph Foreground</Center>
            <Center height='30px'> {color.foreground}</Center>
            <Center height='30px'> Graph Background</Center>
            <Center height='30px'> {color.background}</Center>
            <Center height='30px'> Grid Color</Center>
            <Center height='30px'> {color.grid}</Center>
            <Center height='30px'> x-grid lines:</Center>
            <Select defaultValue={"some"}>
                <option value='none'>None</option>
                <option value='some'>Some</option>
                <option value='all'>All</option>
            </Select>
            <Center height='30px'> y-grid lines:</Center>
            <Select defaultValue={"some"}>
                <option value='none'>None</option>
                <option value='some'>Some</option>
                <option value='all'>All</option>
            </Select>
            <Center height='30px'> y-axis label color:</Center>
            <RadioGroup onChange={setLabelColor} value={labelColor}>
                <Stack direction='row'>
                    <Radio value={"false"}>selected curve</Radio>
                    <Radio value={"true"}>foreground</Radio>
                </Stack>
            </RadioGroup>
            <Center height='30px'> data line-width:</Center>
            <Slider aria-label='slider-ex-1' defaultValue={2} min={1} max={10}>
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </SimpleGrid>
    );
}