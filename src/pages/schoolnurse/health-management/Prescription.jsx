
import { Grid } from "@mui/material";
import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';

import TakeMedicationBySession from '@components/schoolnurse/send-medication/TakeMedicationBySession';
import PrescriptionRequest from '@components/schoolnurse/send-medication/PrescriptionRequest';
import FloatingNavigateButton from '@components/magic/FloatingNavigateButton/FloatingNavigateButton';
import { MdOutlineMedication as MedicationPreparationIcon } from "react-icons/md";
import NewRequestsIcon from '@mui/icons-material/Article';

import { getDDMMYYYYFromISOString } from "@utils/date-utils";

const Prescription = () => {

    // check the date inside the 'medicationCheckList':
    const medicationCheckListStr = localStorage.getItem('medicationCheckList');
    if (medicationCheckListStr) {
        const convertedObj = JSON.parse(medicationCheckListStr);
        const currentDate = getDDMMYYYYFromISOString((new Date).toISOString()); // format: dd-mm-yyyy
        if (convertedObj?.takingDate !== currentDate)
            localStorage.removeItem("medicationCheckList");
    }

    return (
        <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px" }}>
            <Grid container>
                <Grid item size={{ xs: 6 }}>
                    <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
                    <CustomTittle title={"Prescription Information"} />
                </Grid>
            </Grid>
            <Grid container justifyContent={'center'} sx={{ marginTop: "40px", marginBottom: "40px", backgroundColor: "#E6F8F9", pb: "0px" }}>
                <Grid item size={{ xs: 11 }}>
                    <Grid container spacing={2} >
                        <Grid item size={{ xs: 7 }} backgroundColor="#fff9ea" display={'flex'} justifyContent={'center'} padding="10px">
                            <TakeMedicationBySession />
                        </Grid>
                        <Grid item size={{ xs: 5 }} backgroundColor="#fff9ea" display={'flex'} justifyContent={'center'} padding="10px">
                            <PrescriptionRequest linkPrescriptionRequestPage={'./prescription-requests'} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <FloatingNavigateButton
                iconForAvatar={MedicationPreparationIcon}
                navigateLink={`/schoolnurse/prescription/medication-preparations`}
                backgroundColor={"purple"}
                textContent="Preparations" 
                customMaxWidth={"150px"}/>
            <FloatingNavigateButton
                iconForAvatar={NewRequestsIcon}
                navigateLink={'/schoolnurse/prescription/prescription-requests'}
                backgroundColor={"#1976d2"}
                textContent="New Requests"
                customSpaceBottom={'90px'}
                customMaxWidth={'130px'}/>
        </div>
    );
}

const breadcrumbPairs = [
    {
        title: 'Dashboard',
        link: '/schoolnurse/dashboard'
    },
    {
        title: 'Prescription Information',
    }
]

export default Prescription;