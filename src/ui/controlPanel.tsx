import React, { useRef } from "react";
import {
  Box,
  Tabs,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Link as ChakraLink,
  FormControl
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCurve, loadFile, saveFile, clearConfig } from "../redux/appActions";
import { CurveTable } from "./components/CurveTable/curveTable";
import { GraphOptions } from "./components/GraphOptions/graphOptions";
import { TimeControls } from "./components/TimeControls/timeControls";
import { parseFile } from "../parsing/parser";
import { Curve } from "../types/curve";

export const ControlPanel = (): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const [input, setInput] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
  };

  // This calls the input file event
  const handleLoadFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files !== null) {
      const fileObj: File = event.target.files && event.target.files[0];
      const loadedConfig = await parseFile(fileObj);
      if (loadedConfig) dispatch(loadFile(loadedConfig));
    }
  };

  // Fetch file input ref
  const handleLoadClick = () => {
    if (inputRef.current !== null) inputRef.current.click();
  };

  // TO DO - finish function
  const handleSaveClick = () => {
    //dispatch(saveFile())
    if (inputRef.current !== null) inputRef.current.click();
  };

  // TO DO - finish function
  const handleSaveAsClick = () => {
    if (inputRef.current !== null) inputRef.current.click();
  };

  const handleClearClick = () => {
    dispatch(clearConfig());
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // Create curve with defaults
    const newCurve: Curve = {
      name: input,
      precision: 4,
      min: 0,
      max: 10000000,
      scale: false,
      plotStatus: false
    };
    dispatch(addCurve(newCurve));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Menu>
        <MenuButton>File</MenuButton>
        <MenuList>
          <MenuItem onClick={handleLoadClick}>
            Load
            <input
              ref={inputRef}
              style={{ display: "none" }}
              type="file"
              name="striptoolFile"
              onChange={handleLoadFileChange}
            />
          </MenuItem>
          <MenuItem onClick={handleSaveAsClick}>Save as</MenuItem>
          <MenuItem onClick={handleSaveClick}>Save</MenuItem>
          <MenuDivider />
          <MenuItem onClick={handleClearClick}>Clear</MenuItem>
          <MenuDivider />
          <MenuItem>Exit</MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton>Window</MenuButton>
        <MenuList>
          <ChakraLink as={ReactRouterLink} target={"_blank"} to={"/graph"}>
            <MenuItem>Graph</MenuItem>
          </ChakraLink>
        </MenuList>
      </Menu>
      <Box sx={{ width: "100%" }}>
        <FormControl>
          Plot New Signal:
          <Input
            onChange={handleChange}
            sx={{ width: "60%" }}
            variant="outline"
            placeholder="PV name here"
          />
          <Button onClick={handleClick} colorScheme="blue" variant="outline">
            Connect
          </Button>
        </FormControl>
        <Box sx={{ width: "100%" }}>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Curves</Tab>
              <Tab>Controls</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                  <CurveTable />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ width: "50%" }}>
                    Time Controls
                    <TimeControls />
                  </Box>
                  <Box sx={{ width: "50%" }}>
                    Graph Options
                    <GraphOptions />
                  </Box>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
};
