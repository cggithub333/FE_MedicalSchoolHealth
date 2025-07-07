import { Grid } from '@mui/material';

import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';
import Breadcrumbs from '../../../components/magic/Breadcrumb/CustomBreadcrumb';

import chooseChildImg from '../../../assets/images/instruct_choose_child.png';

import HealthCheckSurveyByPupil from '@components/parent/HealthCheckCampaignCard/HealthCheckSurveyByPupil';
import CircularLoading from '../../../components/magic/CircularLoading/CircularLoading';

const Surveys = () => {

  return (
    <div style={{ background: "#e6f8f9", width: "100%", height: "100vh" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumbs breadcrumbPairs={breadcrumbPairs}/>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px"}} size={{ xs: 12 }}>
          <CustomTittle title={"Health Check Surveys"} />
        </Grid>
      </Grid>
      <Grid container backgroundColor={"#e6f8f9"} justifyContent={'center'} paddingBottom="60px">
        <Grid item size={{ xs: 11}}>
          <HealthCheckSurveyByPupil  />
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
