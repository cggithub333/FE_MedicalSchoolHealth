import { Grid } from '@mui/material';

import CustomTittle from '@components/magic/CustomTittle/CustomTitle';
import Breadcrumbs from '@components/magic/Breadcrumb/CustomBreadcrumb';

import chooseChildImg from  '@assets/images/instruct_choose_child.png';
import VaccinationSurvey from '@components/parent/VaccinationCampaign/LatestCampaign/VaccinationSurvey';

const Surveys = () => {
  
  return (
    <div style={{ background: "#e6f8f9", width: "100%", height: "100vh" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumbs breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 12 }}>
          <CustomTittle title={"Vaccination Surveys"} />
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'}>
        <Grid item size={{ xs: 11 }}>
          <VaccinationSurvey />
        </Grid>
      </Grid>
    </div>
  )
}

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/parent/dashboard'
  },
  {
    title: 'Surveys',
    // link: '/parent/vaccination-campaign/surveys'
  }
]

const styleNotificationMssg = {
  display: "flex",
  fontSize: "19px",
  fontStyle: "italic",
  marginTop: "25px",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  marginBottom: "150px"
}

export default Surveys;