import { Grid } from '@mui/material';

import HealthCheckCampaignCard from '../../../components/parent/HealthCheckCampaignCard/HealthCheckCampaignsCard';

import Breadcrumb from '../../../components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';

import useLatestHealthCheckCampaign from '../../../hooks/parent/useLatestHealthCheckCampaign';

const Campaigns = () => {

  const { latestHealthCheckCampaign, isLoading } = useLatestHealthCheckCampaign();

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
      {
        latestHealthCheckCampaign ? 
          (
            <Grid container justifyContent={'center'} sx={styleCardWrapper}>
              <Grid item sx={{ xs: 12 }}>
                <HealthCheckCampaignCard  latestHealthCheckCampaign={latestHealthCheckCampaign}
                                          isLoading={isLoading}
                />
              </Grid>
            </Grid>
          )
          :
          (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: "30px",
              fontSize: "20px",
              fontStyle: "italic"
            }}>There is no ongoing health check campaign!</div>
          )
      }
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