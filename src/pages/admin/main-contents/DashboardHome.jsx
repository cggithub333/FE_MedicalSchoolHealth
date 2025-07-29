import DashboardOverview from '@components/admin/Dashboard/dashboard/DashboardOverview'
import { Grid } from '@mui/material';

const DashboardHome = () => {

  return (
    <Grid container paddingBottom={'50px'} bgcolor={"#E6F8F9"}>
      <Grid size={{xs: 12}}>
        <DashboardOverview />
      </Grid>
    </Grid>
  );
}

export default DashboardHome;