import React from "react";
import { ControlPanelComponentProps, GraphCurve } from "../types";
import {Box, Tabs, TabPanels, TabPanel, TabList, Tab, Button, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Link as ChakraLink, FormControl} from "@chakra-ui/react";
import { ControlsTab } from "./controlsTab";
import { CurvesTab } from "./curvesTab";
import { Link as ReactRouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCurve } from "../redux/actions";

export const ControlPanel = (): JSX.Element => {
    const dispatch = useDispatch();

    const [input, setInput] = React.useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.currentTarget.value);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      // Create curve with defaults
      const newCurve: GraphCurve = {
        name: input,
        precision: 4,
        min: 0,
        max: 10000000,
        scale: false,
        plotStatus: false
      }
      console.log(newCurve);
      dispatch(addCurve(newCurve));
    };

    return (
      <Box sx={{width: "100%"}}>
        <Menu>
            <MenuButton>File</MenuButton>
            <MenuList>
                <MenuItem>Load</MenuItem>
                <MenuItem>Save as</MenuItem>
                <MenuItem>Save</MenuItem>
                <MenuDivider />
                <MenuItem>Clear</MenuItem>
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
        <Box sx={{width: "100%"}}>
        <FormControl>
            Plot New Signal: 
            <Input onChange={handleChange} sx={{width: "60%"}}variant='outline' placeholder='PV name here' />
            <Button onClick={handleClick} colorScheme="blue" variant="outline">Connect</Button>
          </FormControl>
          <Box sx={{width: "100%"}}>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Curves</Tab>
                <Tab>Controls</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <CurvesTab />
                </TabPanel>
                <TabPanel>
                  <ControlsTab />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Box>
    )
  }
