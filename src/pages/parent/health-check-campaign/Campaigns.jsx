import HealthCheckCampaignCard from '../../../components/parent/HealthCheckCampaignCard/Card';

import Breadcrumb from '../../../components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';

import { Grid } from '@mui/material';

const Campaigns = () => {

  return (
    <div>
      <Grid container>
        <Grid item sx={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs}/>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ xs: 6, marginLeft: "20px", marginTop: "25px" }}>
          <CustomTittle title={"Health Check Campaign"}/>
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'} sx={styleCardWrapper}>
        <Grid item sx={{ xs: 12 }}>
          <HealthCheckCampaignCard />
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
    title: 'Campaigns',
    // link: '/parent/vaccination-campaign/campaigns'
  }
]

const styleCardWrapper = {
  marginTop: "30px",
  marginBottom: "100px"
}

export default Campaigns;