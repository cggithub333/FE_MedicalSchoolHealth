
import AccountMenu from "./account-menu/account-menu";
import DemoVariations from "./account-menu/account-menu-variations";

import { Grid } from "@mui/material";

const Test = () => {
  return (
    <div>
      <Grid container>
        <Grid item size={{ xs: 12 }} alignItems="center">
          <DemoVariations />
        </Grid>
      </Grid>
    </div>
  );
}

export default Test;