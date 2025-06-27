import { Grid } from '@mui/material';

import HealthCheckCampaignCard from '../../../components/parent/HealthCheckCampaignCard/HealthCheckCampaignsCard';

import Breadcrumb from '../../../components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';

const Campaigns = () => {

  return (
    <div style={{ background: "#e6f8f9", height: "100vh", paddingTop: "20px", paddingBottom: "50px"}}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs}/>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6}}>
          <CustomTittle title={"Health Check Campaign"}/>
        </Grid>
      </Grid>
      <Grid container>
        <HealthCheckCampaignCard />
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
    title: 'Campaigns',
    // link: '/parent/vaccination-campaign/campaigns'
  }
]

const styleCardWrapper = {
  marginTop: "30px",
  marginBottom: "100px"
}

export default Campaigns;