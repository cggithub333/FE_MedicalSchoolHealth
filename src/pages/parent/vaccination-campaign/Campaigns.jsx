
import Breadcrumb from '../../../components/magic/Breadcrumb/CustomBreadcrumb';
import { Grid } from "@mui/material";
import VaccinationCampaignCard from "../../../components/parent/VaccinationCampaignCard/VaccinationCampaignCard";
import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';

const campaign = {
  campaignId: 101,
  name: "Campaign for Measles, Mumps, and Rubella",
  status: "Published",
  startDate: "July 12–13, 2025",
  consentDeadline: "July 10, 2025",
  disease: {
    name: "Measles, Mumps, and Rubella (MMR)",
    description: "A combined vaccine to protect against measles, mumps and rubella.",
    doseRequired: 2,
  },
  vaccine: {
    name: "MMR-VaxPro",
    manufacturer: "PharmaHealth Co.",
    recommendedAge: "1 year and older",
    description: "Live vaccine for MMR prevention.",
  },
  notes: [
    "Ensure your child has eaten before the injection day."
  ]
};

const Campaigns = () => {

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
      <Grid container justifyContent={'center'} marginTop="35px">
        <VaccinationCampaignCard campaign={campaign}/>
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
    title: 'Campaigns',
    // link: '/parent/vaccination-campaign/campaigns'
  }
]

export default Campaigns;
