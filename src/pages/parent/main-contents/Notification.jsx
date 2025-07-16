import ParentNotifications from "@components/parent/MainContent/ParentNotification"

import { Grid } from "@mui/material"
import CustomTittle from "@components/magic/CustomTittle/CustomTitle";
import Breadcrumbs from "@components/magic/Breadcrumb/CustomBreadcrumb";

const Notification = () => {

  return (
    <div style={{ background: "#e6f8f9", width: "100%", height: "100vh" }}>
      <Grid container>
        <Grid size={{ xs: 6 }}>
          <Breadcrumbs breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 12 }}>
          <CustomTittle title={"Parent's Notifications"} />
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'} backgroundColor={'#e6f8f9'} >
        <Grid size={{ xs: 12 }}>
          <ParentNotifications />
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
    title: 'Notifications',
    // link: '/parent/vaccination-campaign/surveys'
  }
]

export default Notification;