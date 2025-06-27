import FloatingFilterBar from "../../../components/parent/FloatingFilterBar";

import { Grid } from "@mui/material";
import Breadcrumb from '../../../components/magic/Breadcrumb/CustomBreadcrumb';
import CustomTittle from "../../../components/magic/CustomTittle/CustomTitle";

import HistoryByPupilBySchoolYear from "../../../components/parent/HealthCheckCampaign/HistoryByPupilBySchoolYear";

import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: 8,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
        },
      },
    },
  })

const HealthCheckHistory = () => {

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
      <Grid container sx={{ background: "#e6f8f9", pb: "50px"}}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <HistoryByPupilBySchoolYear />
        </ThemeProvider>
      </Grid>
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
