"use client"

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Divider,
  Alert,
  Skeleton,
  Grid,
  Box,
  Container,
  Paper,
} from "@mui/material"
import {
  Vaccines,
  CalendarToday,
  Warning,
  CheckCircle,
  Schedule,
  LocalHospital,
  Info,
  Assignment,
  Refresh,
} from "@mui/icons-material"

import useLatestVaccinationCampaign from "@hooks/parent/vaccination/useLatestVaccinationcampaign";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}


const LatestVaccinationCampaign = () => {1
  const { latestCampaign, loading, error, refetch } = useLatestVaccinationCampaign();

  //debug:
  // console.log("Latest Vaccination Campaign Data:", latestCampaign);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "success"
      case "pending":
        return "warning"
      case "completed":
        return "info"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return <CheckCircle />
      case "pending":
        return <Schedule />
      case "completed":
        return <CheckCircle />
      case "cancelled":
        return <Warning />
      default:
        return <Info />
    }
  }

  const renderLoadingSkeleton = () => (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={300} height={40} />
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardHeader>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={400} height={24} />
        </CardHeader>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6}}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Skeleton variant="rectangular" height={80} />
          </Box>
        </CardContent>
      </Card>
    </Container>
  )

  if (loading) {
    return renderLoadingSkeleton()
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert
          severity="error"
          icon={<Warning />}
          action={<Chip label="Thử lại" onClick={refetch} icon={<Refresh />} variant="outlined" size="small" />}
        >
          Có lỗi xảy ra khi tải thông tin chiến dịch tiêm chủng: {error}
        </Alert>
      </Container>
    )
  }

  if (!latestCampaign?.campaign) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Vaccines sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Không có chiến dịch tiêm chủng
            </Typography>
            <Typography color="text.secondary">Hiện tại không có chiến dịch tiêm chủng nào được công bố</Typography>
          </CardContent>
        </Card>
      </Container>
    )
  }

  const { campaign } = latestCampaign

  return (
    <Container maxWidth="lg" sx={{ py: 3}}>
      

      {/* Main Campaign Card */}
      <Card sx={{ mb: 3, padding: 3, borderRadius: 4, boxShadow: 3 }}>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Vaccines color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main", display: "flex", justifyItems: "center" }}>
            Newest Vaccination Campaign
          </Typography>
        </Box>

        <CardHeader>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocalHospital color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Chiến dịch #{campaign.campaignId}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label={campaign.campaignStatus}
                color={getStatusColor(campaign.campaignStatus)}
                icon={getStatusIcon(campaign.campaignStatus)}
                variant="filled"
              />
              <Chip label={campaign.status} color={getStatusColor(campaign.status)} variant="outlined" />
            </Box>
          </Box>
        </CardHeader>

        <CardContent>
          <Grid container spacing={3}>
            {/* Disease Information */}
            <Grid item size={{ xs: 12, md: 6 }} >
              <Paper sx={{ p: 3, height: "100%", bgcolor: "error.50", ...hoverPaper }}> { /* Content of Disease Information */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Warning color="error" />
                  <Typography variant="h6" fontWeight="bold" color="error.main">
                    Disease Information
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Disease Name
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {campaign.disease.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body2">{campaign.disease.description}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Chip
                      label={`${campaign.disease.doseQuantity} liều`}
                      size="medium"
                      color="primary"
                      variant="outlined"
                    />
                    {campaign.disease.isInjectedVaccine && (
                      <Chip label="Tiêm chủng" size="medium" color="success" variant="outlined" />
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Vaccine Information */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, height: "100%", bgcolor: "success.50", ...hoverPaper }}> { /* Content of Vaccine Information */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Vaccines color="success" />
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    Vaccine Information
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Vaccine Name
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {campaign.vaccine.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Manufacturer
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {campaign.vaccine.manufacturer}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Recommended Age
                    </Typography>
                    <Chip sx={{ mt: 1}} label={campaign.vaccine.recommendedAge} size="medium" color="info" variant="filled" />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Important Dates */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2}}>
              <CalendarToday color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Important Schedules
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, md: 4}}> 
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "warning.50", ...hoverPaper }}> { /* Content of form deadline Dates */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Consent Form Deadline
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {formatDate(campaign.consentFormDeadline)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "info.50", ...hoverPaper }}> { /* Content of start examination Dates */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Start Examination Date
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="info.main">
                    {formatDate(campaign.startDate)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item size={{ xs: 12, md: 4}}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "success.50", ...hoverPaper }}> { /* Content of end examination Dates */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    End Examination Date
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {formatDate(campaign.endDate)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ my: 3 }} />

          {/* Campaign Notes */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Assignment color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Campaign Notes
              </Typography>
            </Box>
            <Paper sx={{ p: 3, bgcolor: "grey.50", ...hoverPaper }}>
              <Typography variant="body2" sx={{ lineHeight: 1.6, fontSize: "17.6px" }}>
                {campaign.notes}
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>

      {/* Action Alert */}
      {campaign.status === "Pending" && (
        <Alert severity="warning" icon={<Info />} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontSize: "18px" }}>
            <strong>Notes:</strong> Please submit the consent form before{" "}
            <strong>{formatDate(campaign.consentFormDeadline)}</strong> for your child to participate in the vaccination campaign.
          </Typography>
        </Alert>
      )}
    </Container>
  )
}

const hoverPaper = {
  "&:hover": {
    boxShadow: 5,
    transform: "scale(1.03)",
    transition: "transform 0.9s, box-shadow 0.2s",
  },
}

export default LatestVaccinationCampaign