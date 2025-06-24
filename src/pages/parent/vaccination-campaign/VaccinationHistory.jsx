
import Breadcrumb from '../../../components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';

import { Grid } from '@mui/material';
import DiseaseBoxList from '../../../components/parent/VaccinationCampaign/CampaignHistory/DiseaseBoxList';

const VaccinationHistory = () => {
  return (
    <div style={{ background: "#e6f8f9", height: "100vh", paddingTop: "20px", paddingBottom: "100px" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Vaccination History"} />
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'} sx={{ width: "100%", marginTop: "30px" }}>
        <Grid size={{ sx: 1}}></Grid>
        <Grid size={{ sx: 8 }}>
          <DiseaseBoxList />
        </Grid>
        <Grid size={{ sx: 1 }}></Grid>
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
    title: 'Vaccination History',
    // link: '/parent/vaccination-campaign/campaigns'
  }
]

export default VaccinationHistory;
