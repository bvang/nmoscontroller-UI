import React from 'react';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { Box, Tab } from '@material-ui/core';
import RoutingList from './RoutingList';
import RoutingListVideo from './RoutingListVideo';
import RoutingListAudio from './RoutingListAudio';
import RoutingListData from './RoutingListData';

export const RoutingPage = props => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <TabContext value={value}>
                <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                >
                    <Tab label="All" value="1" />
                    <Tab label="Video" value="2" />
                    <Tab label="Audio" value="3" />
                    <Tab label="Data" value="4" />
                </TabList>
                <TabPanel value="1">
                    <RoutingList {...props} />
                </TabPanel>
                <TabPanel value="2">
                    <RoutingListVideo {...props} />
                </TabPanel>
                <TabPanel value="3">
                    <RoutingListAudio {...props} />
                </TabPanel>
                <TabPanel value="4">
                    <RoutingListData {...props} />
                </TabPanel>
            </TabContext>
        </Box>
    );
};

export default RoutingPage;
