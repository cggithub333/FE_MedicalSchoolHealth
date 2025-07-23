import CustomTittle from '@components/magic/CustomTittle/CustomTitle';
import Breadcrumbs from '@components/magic/Breadcrumb/CustomBreadcrumb';
import HealthCheckSurveyByPupil from '@components/parent/HealthCheckCampaignCard/HealthCheckSurveyByPupil';
import useLatestHealthCheckCampaign from "@hooks/parent/useLatestHealthCheckCampaign"

import { Box, Container, Typography, Avatar, Card, Grid, CardContent } from '@mui/material';
import LocalHospital from '@mui/icons-material/LocalHospital';
import Assignment from '@mui/icons-material/Assignment';

import usePupils from '@hooks/parent/usePupils';

const Surveys = () => {

  const { pupils } = usePupils();
  const { latestHealthCheckCampaign: healthCampaignInfo, isLoading: campaignLoading, refetch: campaignRefetch, error: campaignError } = useLatestHealthCheckCampaign();

  console.log("🔧 Health Campaign Info:", JSON.stringify(healthCampaignInfo, null, 2));

  return (
    <div style={{ background: "#e6f8f9", width: "100%", height: "100vh" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumbs breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 12 }}>
          <CustomTittle title={"Health Check Surveys"} />
        </Grid>
      </Grid>
      <Grid container backgroundColor={"#e6f8f9"} justifyContent={'center'} paddingBottom="60px">
        <Grid item size={{ xs: 11 }}>
          {(healthCampaignInfo === null || healthCampaignInfo.length === 0 || campaignLoading) && noAvailableSurveys()}
          <Grid item size={{ xs: 11 }}>
            {(!(healthCampaignInfo === null || healthCampaignInfo.length === 0 || campaignLoading)) && (
              <>
                {header()}
                <Grid container>
                  {pupils.map((pupil) => (
                    <Grid item size={{ xs: 12, sm: 6 }} key={pupil.pupilId} sx={{ marginBottom: "20px" }}>
                      <HealthCheckSurveyByPupil currentPupil={pupil} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

function header() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, mt: 4 }}>
      <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
        <LocalHospital />
      </Avatar>
      <Box>
        <Typography variant="h4" fontWeight="bold">
          Health Check Survey
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Health examination consent for your child
        </Typography>
      </Box>
    </Box>
  )
}

function noAvailableSurveys() {
  return (
    <Card sx={{ mt: 5 }}>
      <CardContent sx={{ textAlign: "center", py: 6 }}>
        <Assignment sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          No Health Check Surveys
        </Typography>
        <Typography color="text.secondary">
          There are currently no health check survey available for review.
        </Typography>
      </CardContent>
    </Card>
  )
}

function filterPupilsInformation(pupils) {

  return pupils.map(pupil => ({
    pupilId: pupil.id,
    lastName: pupil.name,
    firstName: pupil.firstName,
    birthDate: pupil.birthDate,
    gender: pupil.gender,
    gradeId: pupil.gradeId,
    gradeName: pupil.gradeName,
    gradeLevel: pupil.gradeLevel,
    schoolYear: pupil.schoolYear,
  }));

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
