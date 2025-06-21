import { Grid } from '@mui/material';

import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';
import Breadcrumbs from '../../../components/magic/Breadcrumb/CustomBreadcrumb';

const Surveys = () => {
  return (
    <>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumbs breadcrumbPairs={breadcrumbPairs}/>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Health Check Surveys"} />
        </Grid>
      </Grid>
      <Grid container>
        
      </Grid>
    </>
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

export default Surveys;
