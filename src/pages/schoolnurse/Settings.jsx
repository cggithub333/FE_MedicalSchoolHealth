import { Grid } from "@mui/material";

import SettingContent from "@components/common/SettingContent";

const Settings = () => {
  return (
    <div>
      <Grid container justifyContent={"center"}>
        <Grid item size={{xs: 11}}>
          <SettingContent />
        </Grid>
      </Grid>
    </div>
  );
}

export default Settings;