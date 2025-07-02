
import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';
import { Grid } from '@mui/material';

import { ImExit as ExitIcon } from "react-icons/im";
import FloatingNavigateButton from '@components/magic/FloatingNavigateButton/FloatingNavigateButton';
import PrescriptionRequestPageContent from '@components/schoolnurse/send-medication/PrescriptionRequestPageContent';

const PrescriptionRequestPage = () => {
  return (
    <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px", position: "relative" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Prescription Requests"} />
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'} sx={{ marginTop: "20px", backgroundColor: "#E6F8F9", pb: "50px" }}>
        <Grid item size={{ xs: 11 }}>
          <PrescriptionRequestPageContent/>
          <FloatingNavigateButton
                  navigateLink="./../../prescription"
                  iconForAvatar={ExitIcon}
                  backgroundColor="#FF6B6B"
                  textContent="Back"/>
        </Grid>
      </Grid>
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
    title: "Prescription Requests",
  }
]


export default PrescriptionRequestPage;