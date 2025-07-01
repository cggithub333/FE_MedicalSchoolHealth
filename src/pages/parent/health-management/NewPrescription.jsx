
import { Grid } from "@mui/material";
import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';
import PrescriptionSendingForm from "@components/parent/HealthManagement/PrescriptionSendingForm";

const NewPrescription = () => {
  return (
    <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"New Prescription"} />
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'} sx={{ marginTop: "20px", backgroundColor: "#E6F8F9", pb: "50px" }}>
        <Grid item size={{ xs: 10 }}>
          <PrescriptionSendingForm />
        </Grid>
      </Grid>
    </div>
  );
};

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/parent/dashboard'
  },
  {
    title: 'Prescription Information',
    link: '/parent/prescription'
  },
  {
    title: 'New Prescription',
    // link: '/parent/prescription/new-prescription'
  }
]

export default NewPrescription;