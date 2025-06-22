import { Grid } from '@mui/material';

import CustomTittle from '../../../components/magic/CustomTittle/CustomTitle';
import Breadcrumbs from '../../../components/magic/Breadcrumb/CustomBreadcrumb';

import useSurveyByPupilId from '../../../hooks/parent/useSurveyByPupilId';
import chooseChildImg from '../../../assets/images/instruct_choose_child.png';
import ReloadPageBtn from '../../../components/magic/ReloadPageBtn/ReloadPageBtn';


const Surveys = () => {

  const { surveys, isLoading, chooseChild } = useSurveyByPupilId();
  console.log(surveys);

  return (
    <>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumbs breadcrumbPairs={breadcrumbPairs}/>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px", display: "flex", justifyContent: "space-between" }} size={{ xs: 12 }}>
          <CustomTittle title={"Health Check Surveys"} />
          <span style={{ marginRight: "20px" }}><ReloadPageBtn /></span>
        </Grid>
      </Grid>
      {
        !chooseChild && (
          <div style={styleNotificationMssg}>
            <div>Choose your child first!</div>
            <div style={{width: "80%", height: "auto"}}>
              <img style={{ width: "100%", height: "100%" }} src={chooseChildImg} alt={"instruction for choosing child"} />
            </div>
          </div>
        )
      }
      {
        (chooseChild && isLoading) && (
          <div style={styleNotificationMssg}>
            Loading surveys ...
          </div>
        )
      }
      <Grid container>
        
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
