import ProfileComponent from "../../../components/schoolnurse/main-contents/profile/Profile.jsx";
import { Grid } from "@mui/material";
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';
import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';


const Profile = () => {

  return (
    <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Manager's Profile"} />
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'} sx={{ backgroundColor: "#E6F8F9" }}>
        {/* <Grid item size={{ xs: 10 }}> */}
        <ProfileComponent />
        {/* </Grid> */}
      </Grid>
    </div>
  )
}

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/manager/dashboard'
  },
  {
    title: 'Profile',
    // link: '/parent/profile'
  }
]


export default Profile;
