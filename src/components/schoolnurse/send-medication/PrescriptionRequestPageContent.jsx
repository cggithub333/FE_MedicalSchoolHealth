
import SearchPupilInformationById from "./SearchPupilInformationById";
import PrescriptionRequestPageRequestList from "./PrescriptionRequestPageRequestList";

import { Grid } from "@mui/material";

const PrescriptionRequestPageContent = () => {
  return (
    <div>
      <Grid container spacing={1} backgroundColor="#e6f8f9" margin={'40px 0px'} position={'relative'}>
        <Grid item size={{xs: 8}} backgroundColor="#fff" padding={2}>
          <PrescriptionRequestPageRequestList />
        </Grid>
        <Grid item size={{ xs: 4}} backgroundColor="#fff" padding={2}>
          <SearchPupilInformationById />
        </Grid>
      </Grid>
    </div>
  );
}

export default PrescriptionRequestPageContent;