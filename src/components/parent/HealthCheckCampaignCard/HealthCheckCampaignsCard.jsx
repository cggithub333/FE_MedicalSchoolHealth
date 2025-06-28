"use client"

import { Typography, Chip, Box, Grid, Paper, Avatar, Button, Container, Alert } from "@mui/material"

import {
  LocalHospital,
  LocationOn,
  CalendarToday,
  Schedule,
  Warning,
  Info,
  CalendarMonth,
  Summarize,
} from "@mui/icons-material"

import { createTheme, ThemeProvider } from "@mui/material/styles"
import { Link } from "react-router-dom"

import useLatestHealthCheckCampaign from "@hooks/parent/useLatestHealthCheckCampaign"


const theme = createTheme({
  palette: {
    primary: {
      main: "#65aee7",
    },
    secondary: {
      main: "#f50057",
    },
  },
})

const getStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "warning"
    case "ACTIVE":
      return "success"
    case "COMPLETED":
      return "info"
    case "PUBLISHED":
      return "primary"
    default:
      return "default"
  }
}


const formatDate = (dateString) => {
  if (dateString == null) {
    return { date: "", time: "" }
  }
  const [datePart, timePart] = dateString.split(" ")
  const [day, month, year] = datePart.split("-")
  return {
    date: `${day}/${month}/${year}`,
    time: timePart || "",
  }
}

const SkeletonLoadingComp = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ height: 60, bgcolor: "grey.200", borderRadius: 1 }} />
      <Box sx={{ height: 120, bgcolor: "grey.200", borderRadius: 1 }} />
      <Box sx={{ height: 200, bgcolor: "grey.200", borderRadius: 1 }} />
    </Box>
  </Container>
)

export default function HealthCampaignPage() {

  const { latestHealthCheckCampaign, isLoading, error, refetch } = useLatestHealthCheckCampaign();

  const campaignData = latestHealthCheckCampaign;

  if (isLoading) {
    return SkeletonLoadingComp();
  }

  if (campaignData == null || Object.keys(campaignData).length === 0) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="info" icon={<Info />}>
            <Typography variant="h6" fontWeight="bold">
              No Ongoing Campaign
            </Typography>
            <Typography>There is no ongoing health check campaign at the moment.</Typography>
          </Alert>
        </Container>
      </ThemeProvider>
    )
  }

  const startDate = formatDate(campaignData.startExaminationDate)
  const endDate = formatDate(campaignData.endExaminationDate)
  const deadline = formatDate(campaignData.deadlineDate)

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", width: "100%",bgcolor: "grey.50", borderRadius: '15px', overflow: "hidden", boxShadow: 5 }}>
        {/* Hero Section */}
        <Box
          sx={{
            color: "white",
            py: 6,
            background: "#65aee7",
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "white", color: "primary.main", width: 56, height: 56 }}>
                  <LocalHospital fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                    {campaignData.title}
                  </Typography>
                  {/* <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Campaign ID: #{campaignData.campaignId}
                  </Typography> */}
                </Box>
              </Box>
              <Chip
                label={(campaignData.statusHealthCampaign)}
                color={getStatusColor(campaignData.statusHealthCampaign)}
                variant="filled"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  py: 2,
                  px: 3,
                  bgcolor: "white",
                  color: "primary.main",
                }}
              />
            </Box>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600 }} fontStyle={"italic"}>
              Description: {campaignData.description}
            </Typography>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Location Section */}
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, ...hoverPaper }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                <LocationOn />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  Examination Location
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Where the health check will take place
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                bgcolor: "primary.50",
                p: 3,
                borderRadius: 2,
                borderColor: "primary.200",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Location: {campaignData.address}
              </Typography>
            </Box>
          </Paper>

          {/* Schedule Section */}
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, ...hoverPaper }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarToday color="primary"/>
              Campaign Schedule
            </Typography>

            <Grid container spacing={4}>
              {/* Registration Deadline */}
              <Grid item size={{xs: 12, md: 4}}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    bgcolor: "warning.50",
                    borderRadius: 2,
                    borderColor: "warning.200",
                  }}
                >
                  <Avatar sx={{ bgcolor: "warning.main", mx: "auto", mb: 2, width: 56, height: 56 }}>
                    <Warning fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" color="warning.main" sx={{ mb: 1 }}>
                    Registration Deadline
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {deadline.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Last day to register
                  </Typography>
                </Box>
              </Grid>

              {/* Examination Start */}
              <Grid item size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    bgcolor: "success.50",
                    borderRadius: 2,
                    borderColor: "success.200",
                  }}
                >
                  <Avatar sx={{ bgcolor: "success.main", mx: "auto", mb: 2, width: 56, height: 56 }}>
                    <CalendarToday fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" color="success.main" sx={{ mb: 1 }}>
                    Examination Starts
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {startDate.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {startDate.time}
                  </Typography>
                </Box>
              </Grid>

              {/* Examination End */}
              <Grid item size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    bgcolor: "error.50",
                    borderRadius: 2,
                    borderColor: "error.200",
                  }}
                >
                  <Avatar sx={{ bgcolor: "error.main", mx: "auto", mb: 2, width: 56, height: 56 }}>
                    <Schedule fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" color="error.main" sx={{ mb: 1 }}>
                    Examination Ends
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {endDate.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {endDate.time}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Examination Period Summary */}
            <Box sx={{ mt: 4 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  bgcolor: "primary.main",
                  color: "white",
                  textAlign: "center",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  Health Check Period
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {startDate.date} - {endDate.date}
                </Typography>
              </Paper>
            </Box>
          </Paper>

          {/* Action Buttons Section */}
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, ...hoverPaper }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Link to="../schedule" style={{ textDecoration: "none" }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<CalendarMonth />}
                    sx={{
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      borderRadius: 2,
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    View Schedule
                  </Button>
                </Link>
              </Grid>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Link to="../surveys" style={{ textDecoration: "none" }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Summarize />}
                    sx={{
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      borderRadius: 2,
                      borderWidth: 2,
                      "&:hover": {
                        borderWidth: 2,
                        bgcolor: "primary.50",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Take Survey
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Paper>

          {/* Campaign Information Footer */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: "grey.100" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Info fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Campaign created on: {formatDate(campaignData.createdAt).date}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Campaign ID: #{campaignData.campaignId}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

const hoverPaper = {
  "&:hover": {
    boxShadow: 6,
    transform: "scale(1.03)",
  },
  transition: "all 0.8s ease",
}
