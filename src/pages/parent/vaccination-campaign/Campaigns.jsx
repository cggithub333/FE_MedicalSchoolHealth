import Breadcrumb from '../../../components/magic/Breadcrumb/CustomBreadcrumb';
import { Grid, CircularProgress } from "@mui/material";
import VaccinationCampaignCard from "../../../components/parent/VaccinationCampaignCard/VaccinationCampaignCard";
import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';
import useLatestVaccinationCampaign from '../../../hooks/parent/useLatestVaccinationCampaign';

const Campaigns = () => {
  const { latestVaccinationCampaign, isLoading } = useLatestVaccinationCampaign();

  console.log("Check point => ", latestVaccinationCampaign);

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

      {
        latestVaccinationCampaign?.length > 0 && (
          <Grid container justifyContent={'center'} marginTop="35px">
            {isLoading ? (
              <CircularProgress />
            ) : latestVaccinationCampaign ? (
              <VaccinationCampaignCard latestVaccinationCampaign={latestVaccinationCampaign} />
            ) : null}
          </Grid>
        )
      }
      {
        (latestVaccinationCampaign == null || latestVaccinationCampaign.length == 0) && 
        (
          <div style={{ margin: "30px", fontSize: "19px", display: "flex", justifyContent: "center"}}>
            There is no ongoing vaccination campaign!
          </div>
        )
      }
      
    </div>
  )
}

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/parent/dashboard'
  },
  {
    title: 'Campaigns',
    // link: '/parent/vaccination-campaign/campaigns'
  }
]

export default Campaigns;
