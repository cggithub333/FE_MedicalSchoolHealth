
import DiseaseBox from "./DiseaseBox";

import useVaccinationHistoryByPupilId from "../../../../hooks/parent/useVaccinationHistoryByPupilId";
import CircularLoading from '../../../magic/CircularLoading/CircularLoading';
import { Grid } from "@mui/material";

const DiseaseBoxList = () => {

  const { vaccinationHistory, isLoading } = useVaccinationHistoryByPupilId();


  console.log("vaccination history:");
  console.log(vaccinationHistory);
  console.log("--");

  if (isLoading) {
    return (
      <>
        <span>Loading vaccination history <CircularLoading/></span>
      </>
    )
  }
  return (
    <Grid container justifyContent={"center"} spacing={3}>
      {
        vaccinationHistory.map((diseaseHistory, idx) => {

          return (
              <DiseaseBox key={idx} diseaseHistory={diseaseHistory} />
          )
        })
      }
    </Grid>
  )
}

export default DiseaseBoxList;