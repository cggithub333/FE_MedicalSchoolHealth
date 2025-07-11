
import { Grid } from "@mui/material";
import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';

import FloatingNavigateButton from '@components/magic/FloatingNavigateButton/FloatingNavigateButton';
import { GiMedicines as MedicineIcon } from "react-icons/gi";

import PrescriptionTrackingLogs from "@components/manager/prescription/PrescriptionTrackingLogs";
import PrescriptionTrackingTable from "@components/manager/prescription/PrescriptionTrackingTable";

const PrescriptionTracking = () => {
    return (
        <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px" }}>
            <Grid container>
                <Grid item size={{ xs: 6 }}>
                    <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
                    <CustomTittle title={"Prescriptions Tracking"} />
                </Grid>
            </Grid>
            <Grid container justifyContent={'center'} sx={{ marginTop: "20px", backgroundColor: "#E6F8F9", pb: "50px" }}>
                <Grid item size={{ xs: 11 }}>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 8 }} backgroundColor={"#fff"} padding={2}>
                            <PrescriptionTrackingTable />
                        </Grid>
                        <Grid item size={{ xs: 4 }} backgroundColor={"#fff"} padding={2}>
                            <PrescriptionTrackingLogs />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <FloatingNavigateButton
                iconForAvatar={MedicineIcon}
                navigateLink={'./..'}
                backgroundColor={"#42a5f5"}
                textContent="Manage" />
        </div>
    );
}

const breadcrumbPairs = [
    {
        title: 'Dashboard',
        link: '/manager/dashboard'
    },
    {
        title: 'Prescriptions Management',
        link: '/manager/prescriptions'
    },
    {
        title: 'Prescriptions Tracking',
        link: '/manager/prescriptions/tracking'
    }
]

export default PrescriptionTracking;