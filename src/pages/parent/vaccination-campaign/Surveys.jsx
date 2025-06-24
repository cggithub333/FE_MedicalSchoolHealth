import { Grid } from '@mui/material';

import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';
import Breadcrumbs from '../../../components/magic/Breadcrumb/CustomBreadcrumb';

import useParentVaccinationSurvey from '../../../hooks/parent/useParentVaccinationSurvey';

import SurveysCard from '../../../components/parent/VaccinationCampaignCard/SurveysCard';
import chooseChildImg from '../../../assets/images/instruct_choose_child.png';
import { useEffect, useState } from 'react';


const Surveys = () => {
  // Read pupilId and pupilName from localStorage
  const storedPupilId = window.localStorage.getItem('pupilId');
  const storedPupilName = window.localStorage.getItem('pupilName');

  // If either is missing, show instruction image
  if (!storedPupilId || !storedPupilName) {
    return (
      <div style={styleNotificationMssg}>
        <div>Choose your child first!</div>
        <div style={{ width: "80%", height: "auto" }}>
          <img style={{ width: "100%", height: "100%" }} src={chooseChildImg} alt={"instruction for choosing child"} />
        </div>
      </div>
    );
  }

  const { surveys, isLoading } = useParentVaccinationSurvey();

  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    if (!surveys) return;
    // Find the survey for the current pupil
    const foundSurvey = surveys.find(s => s.pupilId === storedPupilId);
    setSurvey(foundSurvey || null);
  }, [surveys, storedPupilId]);

  return (
    <>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumbs breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 12 }}>
          <CustomTittle title={"Vaccination Surveys"} />
        </Grid>
      </Grid>
      {
        isLoading && (
          <div style={styleNotificationMssg}>
            Loading surveys ...
          </div>
        )
      }
      <Grid container justifyContent={'center'}>
      {
        !isLoading && survey && 
        (
          <Grid item>
            <SurveysCard survey={survey} />
          </Grid>
        )
      }
      {
        !isLoading && !survey && 
        (
            <Grid item sx={{ fontSize: "18px", marginTop: "40px" }}>
              No survey is available for pupil {storedPupilName}.
            </Grid>
        )
      }
      </Grid>
    </>
  )
}

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/parent/dashboard'
  },
  {
    title: 'Surveys',
    // link: '/parent/vaccination-campaign/surveys'
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

export default Surveys;