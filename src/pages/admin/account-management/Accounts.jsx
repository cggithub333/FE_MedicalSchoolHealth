
import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';
import { Grid } from "@mui/material";
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';

import AccountManagementPageContent from "@components/admin/Account/AccountManagementPageContent";

const Accounts = () => {

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
            <Grid item size={{ xs: 11 }}>
              <AccountManagementPageContent />
            </Grid>
          </Grid>
        </div>
  );
}

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/dashboard'
  },
  {
    title: 'Account Management',
  }
]


export default Accounts;