import React from "react";
import {TableContainer, Table, Thead, Tr, Th, Td, Tbody, Button, Checkbox, Input } from "@chakra-ui/react";
import { GraphCurve, StripToolConfig } from "../../../types";
import { useDispatch, useSelector } from "react-redux";
import { deleteCurve, modifyConfig } from "../../../redux/actions";

export const CurveTable = (): JSX.Element => {
    const dispatch = useDispatch();
    // Pass in new row when one is added?
    const curves: GraphCurve[] = useSelector((state: StripToolConfig) => state.curve);
    const colors = useSelector((state: StripToolConfig) => state.color.colors);

    // Determine whether we are in the Edit state for each row
    const initialIsModify: boolean[] = Array(10).fill(false)
    const [isModify, setIsModify] = React.useState(initialIsModify);
    // Set up state for edited input items - we don't want to overwrite config until
    // save button is pressed
    const [inputValues, setInputValues] = React.useState([...curves]);

    const handleClick = (idx: number) => {
      if (isModify[idx]) {
        const curve = [...curves][idx];
        const input = inputValues[idx];
        Object.keys(input).forEach((key: string) => {
        // For each key, check if value has changed
        if (curve[key as keyof GraphCurve] !== input[key as keyof GraphCurve]) {
            // Values don't match, therefore update
            const newCurve = {...curve, [key]: input[key as keyof GraphCurve]}
            dispatch(modifyConfig(`curve.${idx}`, newCurve))
        }
      })
    }
    // Update button text
    const newIsModify: boolean[] = [...isModify];
    newIsModify[idx] = !(isModify[idx]);
    setIsModify(newIsModify);
    };


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, field: string, idx: number) => {
        // We have updated a curve at given index. so we fetch and update value
        const newCurves: GraphCurve[] = curves.map((curve) => {
            switch (field) {
              case "precision":
                return {...curve, precision: Number(event.currentTarget.value)};

              case "min":
                return {...curve, min: Number(event.currentTarget.value)};

              case "max":
                return {...curve, max: Number(event.currentTarget.value)};

              case "plotStatus":
                return {...curve, plotStatus: event.currentTarget.checked};

              case "scale":
                return {...curve, scale: event.currentTarget.checked};
            }
            return curve
        })
        
        setInputValues(newCurves);
    }

    const curveOpts: React.JSX.Element[] = [];
    if (curves.length > 0) {
        curves.forEach((curve: GraphCurve, idx: number) => {
        curveOpts.push(
            <Tr key={curve.name}>
                <Td>{curve.name}</Td>
                <Td>{createColorEl(colors[idx])}</Td>
                <Td> 
                  <Checkbox isDisabled={!isModify[idx]} onChange={(e) => handleChange(e, "plotStatus", idx)} isChecked={curve.plotStatus} />
                </Td>
                <Td> 
                  <Checkbox isDisabled={!isModify[idx]} onChange={(e) => handleChange(e, "scale", idx)} isChecked={curve.scale} />
                </Td>
                <Td>
                    {isModify[idx] ? <Input onChange={(e) => handleChange(e, "precision", idx)} height='30px' defaultValue={curve.precision.toString()} /> : curve.precision}
                </Td>
                <Td>
                    {isModify[idx] ? <Input onChange={(e) => handleChange(e, "min", idx)} height='30px' defaultValue={curve.min.toString()} /> : curve.min}
                </Td>
                <Td>
                    {isModify[idx] ? <Input onChange={(e) => handleChange(e, "max", idx)} height='30px' defaultValue={curve.max.toString()} /> : curve.max}
                </Td>
                <Td>
                    <Button onClick={() => handleClick(idx)}>{isModify[idx] ? "Save" : "Modify"}
                    </Button>
                </Td>
                <Td>
                  <Button onClick={() => dispatch(deleteCurve(curve.name))}>Remove</Button>
                </Td>
            </Tr>);
        })
    }
    
    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                <Tr>
                    <Th>Name</Th>
                    <Th>Color</Th>
                    <Th>Plot</Th>
                    <Th>Log10</Th>
                    <Th>Precision</Th>
                    <Th>Min</Th>
                    <Th>Max</Th>
                    <Th>Modify</Th>
                    <Th>Remove</Th>
                </Tr>
                </Thead>
                <Tbody>
                  {curveOpts}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

/**
 * Function that takes rgb values and returned a div 
 * in that colour
 * @param color 
 */
function createColorEl(color: number[]) {
  const rgbColor = `rgb(${color[0]},${color[0]},${color[0]})`
  return (
    <div>
      <input type="color" id="head" name="head" defaultValue={rgbColor} />
    </div>
    )
}
