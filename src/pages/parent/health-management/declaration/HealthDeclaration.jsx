
import { Grid } from "@mui/material";
import CustomTittle from "@components/magic/CustomTittle/CustomTitle";
import Breadcrumbs from "@components/magic/Breadcrumb/CustomBreadcrumb";
import HealthDeclarationContent from "@components/parent/HealthManagement/Declaration/HealthDeclarationContent";

const HealthDeclaration = () => {

  return (
    <div style={{ background: "#e6f8f9", width: "100%", height: "100vh" }}>
      <Grid container sx={{ background: "#e6f8f9" }}>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumbs breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container sx={{ background: "#e6f8f9" }}>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 12 }}>
          <CustomTittle title={"Health Declaration"} />
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'} sx={{ background: "#e6f8f9" }}>
        <Grid item size={{ xs: 11 }}>
          <HealthDeclarationContent />
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
    title: 'Health Declaration',
    // link: '/parent/vaccination-campaign/surveys'
  }
]

export default HealthDeclaration;
