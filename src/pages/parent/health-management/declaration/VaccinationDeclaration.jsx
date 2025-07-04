
import { Grid } from "@mui/material";
import CustomTittle from "@components/magic/CustomTittle/CustomTitle";
import Breadcrumbs from "@components/magic/Breadcrumb/CustomBreadcrumb";

import FloatingNavigateButton from "@components/magic/FloatingNavigateButton/FloatingNavigateButton";
import VaccinationDeclarationFormContent from "@components/parent/HealthManagement/Declaration/VaccinationDeclarationContent";

import { LuFileSearch as VaccinationHistoryIcon } from "react-icons/lu";

const VaccinationDeclaration = () => {

  return (
    <div style={{ background: "#e6f8f9", width: "100%", height: "100vh", marginBottom: "60px", position: "relative" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumbs breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 12 }}>
          <CustomTittle title={"Vaccination Declaration"} />
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'}
            sx={{
                background: "#e6f8f9", padding: "20px", marginTop: "10px"
            }}>
        <Grid item size={{ xs: 11 }}>
          <VaccinationDeclarationFormContent />
        </Grid>
      </Grid>
      <FloatingNavigateButton 
              iconForAvatar={VaccinationHistoryIcon}
              navigateLink={'./../../vaccination-campaign/vaccination-history'}
              backgroundColor={"orange"} 
              textContent="History"/>
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

export default VaccinationDeclaration;
