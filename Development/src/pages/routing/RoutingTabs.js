import React, { useState } from 'react';
import * as React from "react";
import { Box, Tab, TabContext, TabList, TabPanel } from '@material-ui/core';
import RoutingPage from './RoutingPage';

export const RoutingTabs = props => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Video" value="1" />
                        <Tab label="Audio" value="2" />
                        <Tab label="Data" value="3" />
                        <Tab label="Bulk" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <RoutingPage {...props} />
                </TabPanel>
                <TabPanel value="2">Audio</TabPanel>
                <TabPanel value="3">Data</TabPanel>
                <TabPanel value="4">Bulk</TabPanel>
            </TabContext>
        </Box>
    )
}

export default RoutingTabs;
