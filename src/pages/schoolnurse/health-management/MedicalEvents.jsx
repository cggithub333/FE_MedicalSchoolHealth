import PupilsManagement from '../../../components/schoolnurse/medical-event/pupils-management/PupilsManagement.jsx';
import MedicalEventForm from '../../../components/schoolnurse/medical-event/new-medical-event/EventForm.jsx';
import MedicalEvent from '../../../components/schoolnurse/medical-event/medical-event-management/content/MedicalEvent.jsx';
import MedeicalHeader from '../../../components/schoolnurse/medical-event/medical-event-management/header/MedicalHeader.jsx';
import MedicalEventResultForm from '../../../components/schoolnurse/medical-event/pupils-information/new-medical-event/EventForm.jsx';
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
                <MedeicalHeader />

                {/* Pupils Management */}
                <Grid size={12} container
                    direction="row"
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    pupils - title
                </Grid>
                <Grid size={12} container
                    direction="row"
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <MedicalEvent />
                </Grid>
                <Grid size={12} container
                    direction="row"
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <MedicalEventForm />
                </Grid>
                <Grid size={12} container
                    direction="row"
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <MedicalEventResultForm />
                </Grid>

            </Grid>
        </Box>
    );
}

export default MedicalEvents;   