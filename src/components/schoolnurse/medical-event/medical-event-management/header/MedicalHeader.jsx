import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));
const MedicalHeader = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 8 }}>
                    <Item>TITLE
                        <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                            Please fill in the details of the new medical event.
                        </Box>
                        <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                            Please fill in the details of the new medical event.
                        </Box>
                        <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                            Please fill in the details of the new medical event.
                        </Box>
                    </Item>
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                    <Item>NEW EVENT</Item>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }} offset={{ xs: 4, md: 0 }}>
                    <Item>TOTAL PUPILS</Item>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }} offset={{ xs: 0, md: 0.5 }}>
                    <Item>TOTAL PATIENT</Item>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }} offset={{ xs: 0, md: 0.5 }}>
                    <Item>TOTAL NEW PATIENT(for last 1 month)</Item>
                </Grid>



            </Grid>
        </Box>
    );
}
export default MedicalHeader;
