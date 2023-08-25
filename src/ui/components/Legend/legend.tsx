import { Box, Center, SimpleGrid} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { StripToolConfig } from "../../../types";
  
export const Legend = (): JSX.Element => {
    const legend: React.JSX.Element[] = [];
    const curves = useSelector((state: StripToolConfig) => state.curve);
    console.log(curves);
    curves.forEach((curve) => {
        // For each one we create a legend item
        legend.push(
            <Box>
                <Center>
                    testing text
                </Center>
                {curve.max}
            </Box>
        )
    })
    return (
        <SimpleGrid columns={1} spacing={2}>
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