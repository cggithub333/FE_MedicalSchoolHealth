import { Card, CardContent, CardHeader, Typography, Chip, Box, Grid, Divider, Paper, Avatar, Button } from "@mui/material"
import { LocalHospital, LocationOn, CalendarToday, Schedule, Warning, Info } from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"

import CircularLoading from '../../magic/CircularLoading/CircularLoading';
import useLatestHealthCheckCampaign from '../../../hooks/parent/useLatestHealthCheckCampaign';

import ScheduleIcon from '@mui/icons-material/CalendarMonth';
import SurveyIcon from '@mui/icons-material/Summarize';
import { Link } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
})

export default function HealthCampaignCard() {

  const { latestHealthCheckCampaign , isLoading } = useLatestHealthCheckCampaign();

  const campaignData = latestHealthCheckCampaign;
  if (campaignData == null || campaignData.length == 0) {
    return <>
      <Grid container justifyContent={'center'} sx={{ width: "100%"}}>
        <Typography>
          There is no on-going campaign.
        </Typography>
      </Grid>
    </>
  }

  const formatDate = (dateString) => {
    console.log("dateString: " + dateString);

    if (dateString == null)
    {
      return "";
    }
    const [datePart, timePart] = dateString.split(" ")
    const [day, month, year] = datePart.split("-")
    return {
      date: `${day}/${month}/${year}`,
      time: timePart || "",
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning"
      case "ACTIVE":
        return "success"
      case "COMPLETED":
        return "info"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ"
      case "ACTIVE":
        return "Đang diễn ra"
      case "COMPLETED":
        return "Hoàn thành"
      default:
        return status
    }
  }

  const startDate = formatDate(campaignData.startExaminationDate)
  const endDate = formatDate(campaignData.endExaminationDate)
  const deadline = formatDate(campaignData.deadlineDate)

  if (isLoading) {
    return <>
      Loading newest health check campaign <CircularLoading />
    </>
  }
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 800, width: "100%",  mx: "auto", p: 2 }}>
        <Card
          elevation={8}
          sx={{
            background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
            borderRadius: 3,
            overflow: "visible",
            position: "relative",
          }}
        >
          {/* Header Section */}
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <LocalHospital />
              </Avatar>
            }
            action={
              <Chip
                label={getStatusText(campaignData.statusHealthCampaign)}
                color={getStatusColor(campaignData.statusHealthCampaign)}
                variant="filled"
                sx={{ fontWeight: "bold" }}
              />
            }
            title={
              <Typography variant="h5" component="h2" fontWeight="bold" color="text.primary">
                {campaignData.title}
              </Typography>
            }
            subheader={
              <Box sx={{ mt: 1 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  {campaignData.description}
                </Typography>
              </Box>
            }
            sx={{ pb: 2 }}
          />

          <CardContent sx={{ pt: 0 }}>
            {/* Location Section */}
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mb: 3,
                bgcolor: "white",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "grey.100", color: "grey.600" }}>
                  <LocationOn />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                    {campaignData.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Địa điểm khám
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Divider sx={{ my: 3 }} />

            {/* Date Information Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Start Date */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "success.light", color: "success.contrastText", width: 40, height: 40 }}>
                      <CalendarToday fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                        Bắt đầu khám
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {startDate.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {startDate.time}
                      </Typography>
                    </Box>
                  </Box>

                  {/* End Date */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "error.light", color: "error.contrastText", width: 40, height: 40 }}>
                      <Schedule fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                        Kết thúc khám
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {endDate.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {endDate.time}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Deadline */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "warning.light", color: "warning.contrastText", width: 40, height: 40 }}>
                      <Warning fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                        Hạn đăng ký
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {deadline.date}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Examination Period Highlight */}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold" sx={{ display: "block", mb: 0.5 }}>
                      Thời gian khám
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {startDate.date} - {endDate.date}
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Footer Information */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Info fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  Tạo ngày: {formatDate(campaignData.createdAt).date}
                </Typography>
              </div>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <Link to={"../schedule"}>
                  <Button type="button" sx={{ "&:hover": { background: "#d9c631" } }}>
                    <ScheduleIcon />
                    <span style={{ marginLeft: "10px", fontSize: "17px" }}>Schedule</span>
                  </Button>
                </Link>
                <Link to={"../surveys"}>
                  <Button type="button" sx={{ "&:hover": { background: "#d9c631" } }}>
                    <SurveyIcon />
                    <span style={{ marginLeft: "10px", fontSize: "17px" }}>Survey</span>
                  </Button>
                </Link>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  )
}