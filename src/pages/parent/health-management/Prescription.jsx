import { Grid, Box } from "@mui/material";

import Breadcrumb from '@components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '@components/magic/CustomTittle/CustomTitle';

import PrescriptionSearching from "@components/parent/HealthManagement/PrescriptionSearching";
import FloatingNavigateButton from "@components/magic/FloatingNavigateButton/FloatingNavigateButton";

import { Base64 } from "js-base64";
import InstructChooseChild from '@assets/images/instruct_choose_child.png';

import { AddBox } from "@mui/icons-material";

const Prescription = () => {

  const decodedPupilInfor = Base64.decode(localStorage.getItem("pupilInfor"));
  const pupilObj = JSON.parse(decodedPupilInfor);

  const userFullName = localStorage.getItem("userFullName");

  return (
    <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px", position: "relative" }}>
          <Grid container>
            <Grid item size={{ xs: 6 }}>
              <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
            </Grid>
          </Grid>  
          <Grid container>
            <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
              <CustomTittle title={"Prescription Information"} />
            </Grid>
          </Grid>   
          <Grid container justifyContent={'center'} sx={{ marginTop: "20px", backgroundColor: "#E6F8F9", pb: "50px"}}>
            <Grid item size={{ xs: 10 }}>
              {
                pupilObj == null || pupilObj.pupilId == null && (
                  <>
                    <img src={InstructChooseChild} alt='choose child instruction image' style={{ width: "100%", height: "100%"}} />
                  </>
                )
              }
              {
                pupilObj && pupilObj.pupilId && (
                  <>
                    <PrescriptionSearching pupil={pupilObj} userFullName={userFullName}/>
                  </>
                )
              }
            </Grid>
          </Grid>
          <FloatingNavigateButton 
              iconForAvatar={AddBox}
              navigateLink={'./new-prescription'}
              backgroundColor={"yellowgreen"} 
              textContent="New"/>
    </div>
  )
}

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/parent/dashboard'
  },
  {
    title: 'Prescription',
  }
]

export default Prescription;
