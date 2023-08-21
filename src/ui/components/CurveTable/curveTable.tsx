import React from "react";
import {TableContainer, Table, Thead, Tr, Th, Td, Tbody, Button, Checkbox } from "@chakra-ui/react";
import { GraphCurve } from "../../../types";

interface CurveTableProps {
    curve: GraphCurve[];
}
  
export const CurveTable = (props: CurveTableProps): JSX.Element => {
    // Pass in new row when one is added?
    const { curve } = props;

    const firstTest = (
    <Tr>
        <Td>{curve[0].name}</Td>
        <Td>{curve[0].color}</Td>
        <Td> 
          <Checkbox isChecked={curve[0].plotStatus} />
        </Td>
        <Td> 
          <Checkbox isChecked={curve[0].scale} />
        </Td>
        <Td>{curve[0].precision}</Td>
        <Td>{curve[0].min}</Td>
        <Td>{curve[0].max}</Td>
        <Td><Button>Modify</Button></Td>
        <Td><Button>Remove</Button></Td>
    </Tr>);
    const [curves, setCurve] = React.useState(firstTest);
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
                  {curves}
                </Tbody>
            </Table>
        </TableContainer>
    );
}