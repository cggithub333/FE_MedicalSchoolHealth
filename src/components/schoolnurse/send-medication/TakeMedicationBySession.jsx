
import { Grid } from "@mui/material";
import DigitalClock from "@components/magic/DigitalClock/DigitalClock";
import { useState, useEffect } from "react";
import { getCurrentTime } from "@utils/clock-utils";
import { transform } from "typescript";

import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel'; 
import TabContext from '@mui/lab/TabContext';


const TakeMedicationBySession = () => {

    const [value, setValue] = React.useState('1');
    const [currentTime, setCurrentTime] = useState(getCurrentTime());

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 1000); // Update every second

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return (
        <Grid container sx={{ width: "100%", height: "100%",padding: "20px", backgroundColor: "#fff", boxShadow: 1, borderRadius: 2 }}>
            <Grid item size={{xs: 12}} justifyContent={'space-between'} alignItems={'center'} display={'flex'} >
                <div></div>
                <div><DigitalClock /></div>
            </Grid>
            <Grid item size={{xs: 12}} sx={{ marginTop: "20px" }}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Session 1" value="1" />
                                <Tab label="Session 2" value="2" />
                                <Tab label="Session 3" value="3" />
                            </Tabs>
                        </Box>
                        <TabPanel value="1">
                            Session 1: (09:30 - 10:00)
                        </TabPanel>
                        <TabPanel value="2">
                            Session 2: (10:30 - 11:00)
                        </TabPanel>
                        <TabPanel value="3">
                            Session 3: (11:30 - 12:00)
                        </TabPanel>
                    </TabContext>
                </Box>
            </Grid>
        </Grid>
    );
}
export default TakeMedicationBySession;
