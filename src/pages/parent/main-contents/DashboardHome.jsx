
import { Grid } from "@mui/material";
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';


const DashboardHome = () => {

  return (
    <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px" }}>
      <Grid container>
        <Grid sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Parent's Dashboard"} />
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'} sx={{ marginTop: "20px", backgroundColor: "#E6F8F9", pb: "50px" }}>
        <Grid size={{ xs: 10 }}>
        </Grid>
      </Grid>
    </div>
  )
}

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/parent/dashboard'
  }
]


export default DashboardHome;
