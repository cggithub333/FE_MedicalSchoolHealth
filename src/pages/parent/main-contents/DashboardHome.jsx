


import { Grid } from "@mui/material";
import MainDashboardContent from "@components/parent/Dashboard/MainDashboardContent";


const DashboardHome = () => {

  return (
    <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px" }}>
      <Grid container justifyContent={'center'} sx={{ marginTop: "20px", backgroundColor: "#E6F8F9", pb: "50px" }}>
        <Grid size={{ xs: 11 }}>
          <MainDashboardContent />
        </Grid>
      </Grid>
    </div>
  )
}


export default DashboardHome;
