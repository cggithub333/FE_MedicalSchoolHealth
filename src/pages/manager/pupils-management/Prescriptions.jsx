
import { Grid } from "@mui/material";
import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';

import FloatingNavigateButton from "@components/magic/FloatingNavigateButton/FloatingNavigateButton";
import { IoDocumentAttachSharp as LogsIcon } from "react-icons/io5";
// import { IoDocumentAttachOutline as LogsIcon } from "react-icons/io5";

const Prescriptions = () => {
    return (
        <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px" }}>
            <Grid container>
                <Grid item size={{ xs: 6 }}>
                    <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
                    <CustomTittle title={"Prescriptions Management"} />
                </Grid>
            </Grid>
            <Grid container justifyContent={'center'} sx={{ marginTop: "20px", backgroundColor: "#E6F8F9", pb: "50px" }}>
                <Grid item size={{ xs: 10 }}>
                    </Grid>
            </Grid>
            <FloatingNavigateButton 
                        iconForAvatar={LogsIcon}
                        navigateLink={'./tracking'}
                        backgroundColor={"#5c00c2"} 
                        textContent="Tracking"/>
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
    }
  ]

export default Prescriptions;