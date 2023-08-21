import React from "react";
import { ControlPanelComponentProps } from "../types";
import {Box, Tabs, TabPanels, TabPanel, TabList, Tab, Button, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Link as ChakraLink} from "@chakra-ui/react";
import { ControlsTab } from "./controlsTab";
import { CurvesTab } from "./curvesTab";
import { Link as ReactRouterLink } from "react-router-dom";

export const ControlPanel = (props: ControlPanelComponentProps): JSX.Element => {
    const { 
      graphConfig
    } = props;

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
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
          Plot New Signal: 
          <Input sx={{width: "60%"}}variant='outline' placeholder='PV name here' />
          <Button colorScheme="blue" variant="outline">Connect</Button>
          <Box sx={{width: "100%"}}>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Curves</Tab>
                <Tab>Controls</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <CurvesTab curves={graphConfig.curve} />
                </TabPanel>
                <TabPanel>
                  <ControlsTab graphOptions={graphConfig} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Box>
    )
  }