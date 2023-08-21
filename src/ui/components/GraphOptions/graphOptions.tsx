import { Center, Checkbox, Select, SimpleGrid, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";
import React from "react";
import { StripToolConfig } from "../../../types";


interface ControlsTabProps {
    graphOptions: StripToolConfig
  }
  
export const GraphOptions = (props: ControlsTabProps): JSX.Element => {
    const { graphOptions } = props;

    return (
        <SimpleGrid columns={2} spacing={2}>
            <Center height='30px'> Graph Foreground</Center>
            <Center height='30px'> {graphOptions.color.foreground}</Center>
            <Center height='30px'> Graph Background</Center>
            <Center height='30px'> {graphOptions.color.background}</Center>
            <Center height='30px'> Grid Color</Center>
            <Center height='30px'> {graphOptions.color.grid}</Center>
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
            <Checkbox></Checkbox>
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

export const GraphOptionsEdit = (props: ControlsTabProps): JSX.Element => {

    return (
        <SimpleGrid columns={2} spacing={2}>
            <Center height='30px'> Graph Foreground</Center>
            <Center height='30px'> PLACEHOLDER</Center>
            <Center height='30px'> Graph Background</Center>
            <Center height='30px'> PLACEHOLDER</Center>
            <Center height='30px'> Grid Color</Center>
            <Center height='30px'> PLACEHOLDER</Center>
            <Center height='30px'> x-grid lines:</Center>
            <Select placeholder='Select option'>
                <option value='option1'>None</option>
                <option value='option2'>Some</option>
                <option value='option3'>All</option>
            </Select>
            <Center height='30px'> y-grid lines:</Center>
            <Select placeholder='Select option'>
                <option value='option1'>None</option>
                <option value='option2'>Some</option>
                <option value='option3'>All</option>
            </Select>
            <Center height='30px'> y-axis label color:</Center>
            <Checkbox></Checkbox>
            <Center height='30px'> data line-width:</Center>
            <Slider aria-label='slider-ex-1' defaultValue={30}>
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </SimpleGrid>
    );
}