
import { Grid } from "@mui/material";
import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';
import FloatingNavigateButton from '@components/magic/FloatingNavigateButton/FloatingNavigateButton';
import MedicationPreparation from '@components/schoolnurse/send-medication/MedicationPreparation.jsx';

import { ImExit as ExitIcon } from "react-icons/im";

const MedicationPreparationsPage = () => {
  return (
    <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Medication Preparations"} />
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'} sx={{ marginTop: "40px", marginBottom: "40px", backgroundColor: "#E6F8F9", pb: "50px" }}>
        <Grid item size={{ xs: 11 }} backgroundColor="#fff9ea" display={'flex'} justifyContent={'center'} padding="10px">
          <MedicationPreparation />
        </Grid>
      </Grid>
      <FloatingNavigateButton
                      iconForAvatar={ExitIcon}
                      navigateLink={`/schoolnurse/prescription`}
                      backgroundColor={"red"}
                      textContent="Back" />
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
    link: '/schoolnurse/prescription'
  },
  {
    title: 'Medication Preparations',
    link: '/schoolnurse/prescription/medication-preparations'
  }
]

export default MedicationPreparationsPage;