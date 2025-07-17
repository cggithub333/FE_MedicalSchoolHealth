


import { Grid } from "@mui/material";
import MainDashboardContent from "@components/parent/Dashboard/MainDashboardContent";


import useAllNotifications from "@hooks/parent/health-check/useAllNotifications";
import usePersonalInformation from "@hooks/common/useMyInformation";
import useCurrentStoragedPupil from "@hooks/parent/useCurrentStoragedPupil";
import useLatestHealthCheckCampaign from "@hooks/parent/useLatestHealthCheckCampaign";
import useLatestVaccinationCampaign from "@hooks/parent/vaccination/useLatestVaccinationcampaign";
import usePrescriptionByPupil from "@hooks/parent/send-medication/usePrescriptionByPupil";
import useNotifyNewMedicalEvents from "@hooks/parent/medical-events/useNotifyNewMedicalEvents"

const DashboardHome = () => {

  const { countNotificationsByType } = useAllNotifications(); 
  const { personalInforState } = usePersonalInformation();
  const { currentPupil, filterUserInfor } = useCurrentStoragedPupil();
  const { latestHealthCheckCampaign } = useLatestHealthCheckCampaign();
  const { latestCampaign: latestVaccinationCampaign } = useLatestVaccinationCampaign();
  const { injectedNoteObjs } = usePrescriptionByPupil(localStorage.getItem("pupilId"));
  const { getSimplifiedEventsByPupilId } = useNotifyNewMedicalEvents();


  return (
    <div style={{ background: "#E6F8F9", height: "100vh", paddingBottom: "50px", paddingTop: "10px" }}>
      <Grid container justifyContent={'center'} sx={{ marginTop: "20px", backgroundColor: "#E6F8F9", pb: "50px" }}>
        <Grid size={{ xs: 11 }}>
          <MainDashboardContent />
        </Grid>
      </Grid>
    </div>
  )
}


export default DashboardHome;
