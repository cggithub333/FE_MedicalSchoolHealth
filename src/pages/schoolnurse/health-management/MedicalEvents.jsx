import MedeicalHeader from '../../../components/schoolnurse/medical-event/medical-event-management/MedicalHeader.jsx';

import { Box, Grid } from '@mui/material';
const MedicalEvents = () => {

    return (
        <Box sx={{
            width: "auto",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 3,
        }}>
            {/* Pupils Management */}

            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {/* header */}
                <Grid size={12} container
                    direction="row"
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <MedeicalHeader />
                </Grid>




            </Grid>
        </Box>
    );
}

export default MedicalEvents;   