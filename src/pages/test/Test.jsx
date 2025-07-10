import AccountMenu from "./account-menu/account-menu";
import DemoVariations from "./account-menu/account-menu-variations";

import { Grid } from "@mui/material";

import useMyInformation from "@hooks/common/useMyInformation";

const Test = () => {
  const { personalInforState, error } = useMyInformation();

  // Enhanced debugging:
  console.log("personalInforState:", personalInforState);
  console.log("error:", error);
  console.log("error exists:", !!error);
  console.log("personalInforState exists:", !!personalInforState);

  return (
    <div>
      <Grid container>
        <Grid size={{ xs: 12 }} alignItems="center">
          <DemoVariations />
        </Grid>
      </Grid>

      {/* Add this debug section to see what's happening */}
      <Grid container pl={2}>
        <Grid size={{xs:12}}>
          <p>Debug: error = {error ? "true" : "false"}</p>
          <p>Debug: personalInforState = {personalInforState ? "true" : "false"}</p>
        </Grid>
      </Grid>

      <Grid container pl={2}>
        {error && (
          <Grid size={{xs:12}}>
            <p>Error fetching personal information: {error.message}</p>
            <p>Please login first before using this features</p>
          </Grid>
        )}
        {!error && personalInforState && (
          <Grid size={{xs:12}}>
            <AccountMenu
              username={(`${personalInforState.lastName} ${personalInforState.firstName}`) || "User"}
              gender="male"
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default Test;