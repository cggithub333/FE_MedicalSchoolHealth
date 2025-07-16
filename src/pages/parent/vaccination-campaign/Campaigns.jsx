import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';
import { Grid } from "@mui/material";
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';

import LatestVaccinationCampaign from '@components/parent/VaccinationCampaign/LatestCampaign/LatestVaccinationCampaign';

const Campaigns = () => {
  

  return (
    <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>  
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Vaccination Campaign"} />
        </Grid>
      </Grid>   
      <Grid container justifyContent={'center'} sx={{ marginTop: "20px", backgroundColor: "#E6F8F9", pb: "50px"}}>
        <Grid item size={{ xs: 10 }}>
          <LatestVaccinationCampaign />
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

export default Campaigns;
