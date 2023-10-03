import { Text, Box, Center, SimpleGrid} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { StripToolConfig } from "../../../types";
  
export const Legend = (): JSX.Element => {
    const legend: React.JSX.Element[] = [];
    const curves = useSelector((state: StripToolConfig) => state.curve);
    const colors = useSelector((state: StripToolConfig) => state.color.colors);
    curves.forEach((curve, idx) => {
      const color = `rgb(${colors[idx][0]},${colors[idx][1]},${colors[idx][2]})`;
        // For each one we create a legend item
        legend.push(
            <Box width={250}>
                <Center  borderStyle={"solid"} borderTopWidth={2} borderBottomWidth={2} borderRightWidth={4} borderLeftWidth={4} borderColor={color}>
                    {curve.name}
                </Center>
                <Text align={"left"}> {`${curve.units}`} </Text>
                <Text align={"left"}> {`${curve.scale ? "log10" : ""} (${curve.min}, ${curve.max}) VAL=${2}`}</Text>
                <Text align={"left"}>{`${curve.comment}`}</Text>
                
            </Box>
        )
    })
    return (
        <SimpleGrid float={"right"} columns={1} spacing={2}>
          {legend}
        </SimpleGrid>
    );
}

/*
    // Create legend element for each curve
    const curves: React.JSX.Element[] = [];
    state.curve.forEach((curve, idx) => {
      const style: CSSProperties = {};
      style.borderColor = `rgba(${state.color.colors[idx].toString()})`;
      // Text for inside box
      const text = `${curve.units}\n ${curve.scale} (${curve.min}, ${curve.max}) VAL=${data.y[-1]}\n ${curve.comment}`
      curves.push((
        <div key={curve.name}>
          <div className={classes.Curve} style={style}>
            {state.curve[0].name}
          </div>
          {text}
        </div>
      ));
    })
*/