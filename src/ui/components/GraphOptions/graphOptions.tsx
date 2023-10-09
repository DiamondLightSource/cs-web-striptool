import {
  Center,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { StripToolConfig } from "../../../types";
import { modifyConfig } from "../../../redux/actions";

export const GraphOptions = (): JSX.Element => {
  const dispatch = useDispatch();
  const color = useSelector((state: StripToolConfig) => state.color);
  const option = useSelector((state: StripToolConfig) => state.option);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLSelectElement>
      | React.MouseEvent<HTMLSelectElement>,
    name: string
  ) => {
    dispatch(modifyConfig(name, Number(event.currentTarget.value)));
  };

  return (
    <SimpleGrid columns={2} spacing={2}>
      <Center height="30px"> Graph Foreground</Center>
      <Center height="30px"> {color.foreground}</Center>
      <Center height="30px"> Graph Background</Center>
      <Center height="30px"> {color.background}</Center>
      <Center height="30px"> Grid Color</Center>
      <Center height="30px"> {color.grid}</Center>
      <Center height="30px"> x-grid lines:</Center>
      <Select
        onChange={e => handleChange(e, "option.gridXOn")}
        defaultValue={option.gridXOn.toString()}
      >
        <option value="0">None</option>
        <option value="1">Some</option>
        <option value="2">All</option>
      </Select>
      <Center height="30px"> y-grid lines:</Center>
      <Select
        onChange={e => handleChange(e, "option.gridYOn")}
        defaultValue={option.gridYOn.toString()}
      >
        <option value="0">None</option>
        <option value="1">Some</option>
        <option value="2">All</option>
      </Select>
      <Center height="30px"> y-axis label color:</Center>
      <RadioGroup
        onChange={() =>
          dispatch(
            modifyConfig("option.axisYColorStat", !option.axisYColorStat)
          )
        }
        value={option.axisYColorStat.toString()}
      >
        <Stack direction="row">
          <Radio value={"false"}>selected curve</Radio>
          <Radio value={"true"}>foreground</Radio>
        </Stack>
      </RadioGroup>
      <Center height="30px"> data line-width:</Center>
      <Slider
        onChange={val => dispatch(modifyConfig("option.graphLineWidth", val))}
        aria-label="slider-ex-1"
        defaultValue={2}
        min={1}
        max={10}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </SimpleGrid>
  );
};
