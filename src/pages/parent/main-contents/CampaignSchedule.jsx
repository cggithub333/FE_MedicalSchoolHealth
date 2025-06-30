import { Grid } from '@mui/material';

import Breadcrumb from '../../../components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';
import CampaignScheduleContent from '@components/parent/MainContent/CampaignScheduleContent';

const CampaignSchedule = () => {

  return (
    <div style={{ background: "#e6f8f9", height: "100vh", paddingTop: "20px", paddingBottom: "50px" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Campaign Schedule"} />
        </Grid>
      </Grid>
      <Grid container backgroundColor={"#e6f8f9"} justifyContent={"center"} mt={'50px'} pb={'100px'}>
        <Grid item size={{ xs: 10 }} sx={styleScheduleWrapper}>
          <CampaignScheduleContent />
        </Grid>
      </Grid>
    </div>
  )
}

const styleScheduleWrapper = {
  backgroundColor: '#ffff',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: "0px 3px 3px 3px rgba(0, 0, 0, 0.1)",
  marginBottom: '30px',
}

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/parent/dashboard'
  },
  {
    title: 'Campaign Schedule',
  }
]

export default CampaignSchedule;