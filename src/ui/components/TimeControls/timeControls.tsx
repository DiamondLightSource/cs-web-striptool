import { Button, Center, Input, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { modifyConfig } from "../../../redux/appActions";
import { StateConfig } from "../../../redux/state";

type TimeValues = {
  [key: string]: number;
};

export const TimeControls = (): JSX.Element => {
  // TO DO
  // make timespan be 3 boxes
  const dispatch = useDispatch();
  const time: TimeValues = useSelector(
    (state: StateConfig) => state.config.time
  );
  // Determine whether we are in the Edit state
  const [isModify, setIsModify] = React.useState(false);
  // Set up state for edited input items - we don't want to overwrite config until
  // save button is pressed
  const [inputValues, setInputValues] = React.useState(time);

  const handleClick = () => {
    if (isModify) {
      const keys = Object.keys(inputValues);
      keys.forEach((key: string) => {
        // For each key, check if value has changed
        if (time[key] !== inputValues[key]) {
          // Values don't match, therefore update
          dispatch(modifyConfig(`time.${key}`, inputValues[key]));
        }
      });
    }
    // Update button text
    setIsModify(!isModify);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    // Whenever value changes, overwrite
    setInputValues({
      ...inputValues,
      [field]: Number(e.currentTarget.value)
    });
  };

  return (
    <>
      <SimpleGrid columns={2} spacing={2}>
        <Center height="30px"> Time Span</Center>
        {isModify ? (
          <Input
            onChange={e => handleChange(e, "timespan")}
            height="30px"
            defaultValue={time.timespan.toString()}
          />
        ) : (
          <Center height="30px"> {time.timespan}</Center>
        )}
        <Center height="30px"> Ring Buffer Size</Center>
        {isModify ? (
          <Input
            onChange={e => handleChange(e, "numSamples")}
            height="30px"
            defaultValue={time.numSamples.toString()}
          />
        ) : (
          <Center height="30px"> {time.numSamples}</Center>
        )}
        <Center height="30px"> Data Sample Interval</Center>
        {isModify ? (
          <Input
            onChange={e => handleChange(e, "sampleInterval")}
            height="30px"
            defaultValue={time.sampleInterval.toString()}
          />
        ) : (
          <Center height="30px"> {time.sampleInterval}</Center>
        )}
        <Center height="30px"> Graph Redraw Interval</Center>
        {isModify ? (
          <Input
            onChange={e => handleChange(e, "refreshInterval")}
            height="30px"
            defaultValue={time.refreshInterval.toString()}
          />
        ) : (
          <Center height="30px"> {time.refreshInterval}</Center>
        )}
      </SimpleGrid>
      <Button onClick={handleClick} colorScheme="blue" variant="outline">
        {isModify ? "Save" : "Modify"}
      </Button>
    </>
  );
};

//
