
import Breadcrumb from '../../../components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';

import { Grid } from '@mui/material';
import DiseaseBoxList from '../../../components/parent/VaccinationCampaign/CampaignHistory/DiseaseBoxList';

import InstructChooseChildImg from '../../../assets/images/instruct_choose_child.png';
import { useEffect } from 'react';

import useHealthCheckHistoryByPupilId from '../../../hooks/parent/useHealthCheckHistoryByPupilId.js';

const VaccinationHistory = () => {

  const [storedPupilId, setStoredPupilId] = useState(null);
  const [storedPupilName, setStoredPupilName] = useState(null);

  useEffect(() => {
    const storedPupilId = localStorage.getItem('pupilId');
    const storedPupilName = localStorage.getItem('pupilName');
    setStoredPupilId(storedPupilId);
    setStoredPupilName(storedPupilName);
  }, []);

  return (
    <div style={{ background: "#e6f8f9", height: "100vh", paddingTop: "20px", paddingBottom: "100px" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Vaccination History"} />
        </Grid>
      </Grid>
      {(storedPupilId == null || storedPupilName == null) ?
        (
          <div style={styleNotificationMssg}>
            <div>Choose your child first!</div>
            <div style={{ width: "80%", height: "auto" }}>
              <img style={{ width: "100%", height: "100%" }} src={InstructChooseChildImg} alt={"instruction for choosing child"} />
            </div>
          </div>
        )
        :
        (<Grid container justifyContent={'center'} sx={{ width: "100%", marginTop: "30px" }}>
          <Grid size={{ sx: 1 }}></Grid>
          <Grid size={{ sx: 8 }}>
            <DiseaseBoxList />
          </Grid>
          <Grid size={{ sx: 1 }}></Grid>
        </Grid>)
      }
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
