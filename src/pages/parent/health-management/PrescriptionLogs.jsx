
import { Grid } from "@mui/material";
import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';

import PrescriptionLogsContent from '@components/parent/HealthManagement/PrescriptionLogsContent';
import { ImExit as ExitIcon } from "react-icons/im";
import FloatingNavigateButton from "@components/magic/FloatingNavigateButton/FloatingNavigateButton";
import SearchPrescriptionIcon from '@mui/icons-material/ContentPasteSearch';

const PrescriptionLogs = () => {
  return (
    <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Medication Taking History"} />
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'} sx={{ marginTop: "20px", backgroundColor: "#E6F8F9", pb: "50px" }}>
        <Grid item size={{ xs: 10 }}>
          <PrescriptionLogsContent />
        </Grid>
      </Grid>
      <FloatingNavigateButton
        navigateLink="/parent/prescription"
        iconForAvatar={SearchPrescriptionIcon}
        backgroundColor="#699cb4"
        textContent="Search" />
    </div>
  );
};


const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/parent/dashboard'
  },
  {
    title: 'Prescription',
    link: '/parent/prescription',
  },
  {
    title: 'Medication Taking History',
    link: '/parent/prescription/prescription-logs',
  }
]

export default PrescriptionLogs;