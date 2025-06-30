import { Alert, Grid } from '@mui/material';

import Breadcrumb from '../../../components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';
import CampaignScheduleContent from '@components/parent/MainContent/CampaignScheduleContent';
import { Link } from 'react-router-dom';

import { Base64 } from 'js-base64';
import ChooseChildImage from '@assets/images/instruct_choose_child.png';
import { FaChildReaching as ChildIcon } from "react-icons/fa6";

const CampaignSchedule = () => {

  // get pupilInfor from localStorage:
  const decodedPupilInfo = Base64.decode(localStorage.getItem('pupilInfor'));
  const pupilObj = JSON.parse(decodedPupilInfo);

  return (
    <div style={{ background: "#e6f8f9", height: "100vh", paddingTop: "20px", paddingBottom: "50px" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Campaign Schedule"} />
        </Grid>
      </Grid>
      <Grid container backgroundColor={"#e6f8f9"} justifyContent={"center"} mt={'50px'} pb={'100px'}>
        <Grid item size={{ xs: 10 }}>
          <Alert severity="success" sx={styleAlertInfor}>
            <span>Notes: You can change schedule for other child by lick on</span>
            {" "}
            <ChildIcon />
            {" "}
            <span>icon near the search bar.</span>
          </Alert>
        </Grid>
        <Grid item size={{ xs: 10 }} sx={styleScheduleWrapper}>
          {
            (pupilObj == null || pupilObj.pupilId == null) && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <img src={ChooseChildImage} alt="Choose Child" style={{ width: '100%', height:'100%' }} />
                <h3 style={{ textAlign: 'center' }}>Please choose a child to view their campaign schedule.</h3>
              </div>
            )
          }
          {
            pupilObj != null && pupilObj.pupilId != null && (
              <>
                <CampaignScheduleContent pupil={pupilObj} />
              </>
            )
          }
        </Grid>
      </Grid>
    </div>
  )
}

const styleScheduleWrapper = {
  backgroundColor: '#ffff',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: "0px 3px 3px 3px rgba(0, 0, 0, 0.1)",
  marginBottom: '30px',
}

const styleAlertInfor = {
  display: 'flex', alignItems: 'center',
  justifyContent: 'center', marginBottom: '20px',
  borderRadius: '10px', fontSize: '16px',
  boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.1)"
}

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/parent/dashboard'
  },
  {
    title: 'Campaign Schedule',
  }
]

export default CampaignSchedule;