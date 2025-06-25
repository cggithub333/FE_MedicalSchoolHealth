import FloatingFilterBar from "../../../components/parent/FloatingFilterBar";

import { Grid } from "@mui/material";
import Breadcrumb from '../../../components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from "../../../components/magic/CustomTittle/CustomTitle";

import usePupils from "../../../hooks/parent/usePupils";
import useHealthCheckHistoryByPupilId from "../../../hooks/parent/useHealthCheckHistoryByPupilId";

const HealthCheckHistory = () => {
  const { pupils } = usePupils();
  const { healthCheckHistoryList, isLoading } = useHealthCheckHistoryByPupilId();
  
  // For debugging - log the data we're receiving
  console.log("Health Check History List:", healthCheckHistoryList);
  console.log("Pupil ID from localStorage:", localStorage.getItem('pupilId'));
  console.log("Health Check Year from localStorage:", localStorage.getItem('healthCheckYear'));
  console.log("Is Loading:", isLoading);

  // collect unique school years from health check history of a pupil:
  let years = [];  
  if (healthCheckHistoryList && healthCheckHistoryList.length > 0) {
    healthCheckHistoryList.forEach((healthCheck) => {
      const schoolYear = healthCheck.schoolYear;
      if (schoolYear && !years.includes(schoolYear)) {
        years.push(schoolYear);
      }
    });
  }
  
  // For debugging - log the years extracted
  console.log("Available Years:", years);

  return (
    <div style={{ background: "#e6f8f9", height: "100vh", paddingTop: "20px", paddingBottom: "100px" }}>
      <Grid container>
        <Grid item size={{ xs: 6 }}>
          <Breadcrumb breadcrumbPairs={breadcrumbPairs} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ marginLeft: "20px", marginTop: "25px" }} size={{ xs: 6 }}>
          <CustomTittle title={"Health Check History"} />
        </Grid>
      </Grid>

      {/* Health check history of current pupil by year stored on localStorage with the key='healthCheckYear' */}
      <Grid container sx={{ marginTop: "50px", marginLeft: "20px" }} justifyContent={"center"}>
        {
          <>
            {/* if healthCheckHistoryList is empty and no pupilId is stored then show message*/}
            {
              (!healthCheckHistoryList || healthCheckHistoryList.length === 0) && !localStorage.getItem('pupilId') && (
                <>
                  <p style={{ color: 'red', fontSize: "18px" }}>Choose any pupil for continuing!</p>
                </>
              )
            }

            {/* healthCheckHistoryList is empty even if chosen pupil */}
            {
              healthCheckHistoryList && healthCheckHistoryList.length === 0 && localStorage.getItem('pupilId') && (
                <>
                  <p style={{ color: 'red', fontSize: "18px" }}>There is no health check history for this pupil!</p>
                </>
              )
            }

            {/* if (healthCheckYear) is not existed then ask for choose year */}
            {
              !localStorage.getItem('healthCheckYear') && (
                <>
                  <p style={{ color: 'red', fontSize: "18px" }}>Choose year for health check history!</p>
                </>
              )
            }

            {/* if healthCheckHistoryList is not empty then show the list */}
            {
              healthCheckHistoryList && healthCheckHistoryList.length > 0 && localStorage.getItem('healthCheckYear') && (
                <>
                  {/* Debug information */}
                  <div style={{ backgroundColor: "#ffe6e6", padding: "10px", marginBottom: "15px", borderRadius: "4px" }}>
                    <p><strong>Health Check Overview {localStorage?.getItem('healthCheckYear')}</strong></p>
                    {/* <p>Total records: {healthCheckHistoryList.length}</p> */}
                    <p>Selected year: {localStorage.getItem('healthCheckYear')}</p>
                    <p>History health check in {localStorage?.getItem('healthCheckYear')}: {
                      healthCheckHistoryList.filter(check => 
                        String(check.schoolYear) === String(localStorage.getItem('healthCheckYear'))
                      ).length
                    } record(s)</p>
                  </div>
                  
                  <ul>
                    {
                      healthCheckHistoryList
                      .filter(currHealthCheck => {
                        console.log("Checking record:", currHealthCheck);
                        console.log("Comparing:", currHealthCheck.schoolYear, localStorage.getItem('healthCheckYear'));
                        // Convert both values to strings to ensure comparison works regardless of type
                        return String(currHealthCheck.schoolYear) === String(localStorage.getItem('healthCheckYear'));
                      })
                      .map((healthCheck, index) => (
                        <li key={index} style={{ marginBottom: "30px", listStyle: "none", backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                          <h4 style={{ color: "#1976d2", marginBottom: "10px" }}>Health Check on {healthCheck.checkupDate}</h4>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <div>
                              <p><strong>Height:</strong> {healthCheck.height} cm</p>
                              <p><strong>Weight:</strong> {healthCheck.weight} kg</p>
                              <p><strong>Blood Pressure:</strong> {healthCheck.bloodPressure}</p>
                              <p><strong>Heart Rate:</strong> {healthCheck.heartRate} bpm</p>
                              <p><strong>Vision (Right):</strong> {healthCheck.rightEyeVision}</p>
                              <p><strong>Vision (Left):</strong> {healthCheck.leftEyeVision}</p>
                            </div>
                            
                            <div>
                              <p><strong>Dental:</strong> {healthCheck.dentalCheckUp}</p>
                              <p><strong>Ear Condition:</strong> {healthCheck.earCondition}</p>
                              <p><strong>Nose Condition:</strong> {healthCheck.noseCondition}</p>
                              <p><strong>Throat Condition:</strong> {healthCheck.throatCondition}</p>
                              <p><strong>Skin:</strong> {healthCheck.skinAndMucosa}</p>
                            </div>
                          </div>
                          
                          <div style={{ marginTop: "10px", backgroundColor: "#f8f8f8", padding: "10px", borderRadius: "5px" }}>
                            <p><strong>Additional Notes:</strong> {healthCheck.additionalNotes || 'No additional notes'}</p>
                            <p><strong>Doctor's Note:</strong> {healthCheck.note || 'No notes provided'}</p>
                          </div>
                          
                          <button style={{ marginTop: "10px", backgroundColor: "#1976d2", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>
                            View Full Report
                          </button>
                        </li>
                      ))
                    }
                  </ul>
                </>
              )
            }
          </>
        }
      </Grid>

      <FloatingFilterBar 
        pupils={pupils} 
        yearList={years} 
      />
    </div>
  );
}

const breadcrumbPairs = [
  {
    title: 'Dashboard',
    link: '/parent/dashboard'
  },
  {
    title: 'Health Check History',
    // link: '/parent/vaccination-campaign/campaigns'
  }
]

export default HealthCheckHistory;
