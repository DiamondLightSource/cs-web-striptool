import React from "react";
import {TableContainer, Table, Thead, Tr, Th, Td, Tbody, Button, Checkbox } from "@chakra-ui/react";
import { GraphCurve, StripToolConfig } from "../../../types";
import { useSelector } from "react-redux";

  
export const CurveTable = (): JSX.Element => {
    // Pass in new row when one is added?
    const curves = useSelector((state: StripToolConfig) => state.curve);
    const colors = useSelector((state: StripToolConfig) => state.color.colors);
    const curveOpts: React.JSX.Element[] = [];
    if (curves.length > 0) {
        curves.forEach((curve: GraphCurve, idx: number) => {
        curveOpts.push(
            <Tr key={curve.name}>
                <Td>{curve.name}</Td>
                <Td>{colors[idx]}</Td>
                <Td> 
                  <Checkbox isChecked={curve.plotStatus} />
                </Td>
                <Td> 
                  <Checkbox isChecked={curve.scale} />
                </Td>
                <Td>{curve.precision}</Td>
                <Td>{curve.min}</Td>
                <Td>{curve.max}</Td>
                <Td><Button>Modify</Button></Td>
                <Td><Button>Remove</Button></Td>
            </Tr>);
        })
    }
    
    const [curveRows, setCurveRow] = React.useState(curveOpts);
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
                  {curveRows}
                </Tbody>
            </Table>
        </TableContainer>
    );
}