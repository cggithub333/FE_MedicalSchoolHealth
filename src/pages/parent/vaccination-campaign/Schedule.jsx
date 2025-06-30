import { Grid } from "@mui/material";
import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';

import VaccinationSchedule from "@components/parent/VaccinationCampaign/VaccinationSchedule/VaccinationSchedule";

const Schedule = () => {
  return (
    <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Vaccination Schedule"} />
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'} sx={{ marginTop: "20px", backgroundColor: "#E6F8F9", pb: "50px" }}>
        <Grid item size={{ xs: 10 }} sx={styleScheduleWrapper}>
          <VaccinationSchedule />
        </Grid>
      </Grid>
    </div>
  )
}

const styleScheduleWrapper = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0px 3px 3px 3px rgba(0, 0, 0, 0.1)",
  marginTop: "30px",
}

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/parent/dashboard'
  },
  {
    title: 'Vaccination Schedule',
    // link: '/parent/vaccination-campaign/campaigns'
  }
]

export default Schedule;
