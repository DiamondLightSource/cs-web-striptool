import { Text, Box, Center, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { StateConfig } from "../../../redux/state";
import {
  CurvePropOpt,
  InferWidgetProps,
  StringPropOpt
} from "../../../types/propTypes";
import { SingleConnectingComponent } from "../ConnectingComponent/connectingComponent";
import {
  SinglePVComponent,
  SinglePVPropType
} from "../../../types/widgetProps";

const LegendProps = {
  color: StringPropOpt,
  curve: CurvePropOpt
};

export type LegendComponentProps = InferWidgetProps<typeof LegendProps> &
  SinglePVComponent;

export const LegendList = (): JSX.Element => {
  const legend: React.JSX.Element[] = [];
  const curves = useSelector((state: StateConfig) => state.config.curve);
  const colors = useSelector((state: StateConfig) => state.config.color.colors);
  curves.forEach((curve, idx) => {
    const color = `rgb(${colors[idx][0]},${colors[idx][1]},${colors[idx][2]})`;
    // For each one we create a legend item
    legend.push(<Legend color={color} curve={curve} />);
  });
  return (
    <SimpleGrid float={"right"} columns={1} spacing={2}>
      {legend}
    </SimpleGrid>
  );
};

export const LegendComponent = (props: LegendComponentProps): JSX.Element => {
  // Fetch PV Value
  const value = props.value?.getDoubleValue();
  // For each one we create a legend item
  if (props.curve && props.color) {
    return (
      <Box width={250}>
        <Center
          borderStyle={"solid"}
          borderTopWidth={2}
          borderBottomWidth={2}
          borderRightWidth={4}
          borderLeftWidth={4}
          borderColor={props.color}
        >
          {props.curve.name}
        </Center>
        <Text align={"left"}> {`${props.curve.units}`} </Text>
        <Text align={"left"}>
          {" "}
          {`${props.curve.scale ? "log10" : ""} (${props.curve.min}, ${
            props.curve.max
          }) VAL=${value ? value.toString() : "-"}`}
        </Text>
        <Text align={"left"}>{`${props.curve.comment}`}</Text>
      </Box>
    );
  }
  return <></>;
};

const LegendPVProps = {
  ...LegendProps,
  ...SinglePVPropType
};

export const Legend = (
  props: InferWidgetProps<typeof LegendPVProps>
): JSX.Element => (
  <SingleConnectingComponent component={LegendComponent} widgetProps={props} />
);
