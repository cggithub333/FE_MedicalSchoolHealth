
import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';

import { Grid } from '@mui/material';
import InstructChooseChildImg from '@assets/images/instruct_choose_child.png';

import { Base64 } from 'js-base64';
import VaccinationHistoryDisplayer from '@components/parent/VaccinationCampaign/CampaignHistory/VaccinationHistoryDisplayer';

const VaccinationHistory = () => {

  // get pupilInfor from localStorage:
  const decodedPupilInfor = Base64.decode(localStorage.getItem("pupilInfor"));
  const pupilObj = JSON.parse(decodedPupilInfor);

  return (
    <div style={{ background: "#e6f8f9", height: "100vh", paddingTop: "20px", paddingBottom: "100px" }}>
      <Grid container>
        <Grid size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Vaccination History"} />
        </Grid>
      </Grid>
      <Grid container backgroundColor={"#e6f8f9"} justifyContent={"center"} alignItems={"center"}>
        {
          pupilObj != null ? (
            <Grid size={{ xs: 10 }} sx={{ marginTop: "50px", marginBottom: "50px" }}>
              <VaccinationHistoryDisplayer pupilObj={pupilObj}/>
            </Grid>
          )
          :
          (
            <Grid size={{ xs: 10}} sx={{ marginTop: "50px", marginBottom: "50px"}}>
                <div style={styleNotificationMssg}>
                  <img src={InstructChooseChildImg} alt="Choose Child" width={'100%'} height={'100%'} />
                  <span>
                    Please select a child to view their vaccination history.
                  </span>
                </div>
            </Grid>
          )
        }
      </Grid>
    </div>
  );
}

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/parent/dashboard'
  },
  {
    title: 'Vaccination History',
    // link: '/parent/vaccination-campaign/campaigns'
  }
]

const styleNotificationMssg = {
  display: "flex",
  fontSize: "19px",
  fontStyle: "italic",
  marginTop: "25px",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  marginBottom: "150px"
}

export default VaccinationHistory;
