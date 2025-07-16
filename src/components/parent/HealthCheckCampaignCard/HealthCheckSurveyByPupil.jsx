"use client"

import { useState } from "react"
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Avatar,
  Chip,
  FormControlLabel,
  Checkbox,
  Alert,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material"
import {
  LocalHospital,
  CalendarToday,
  LocationOn,
  Schedule,
  Person,
  Close,
  CheckCircle,
  Assignment,
} from "@mui/icons-material"

/*
const currentPupil = {
  pupilId: "PP0006",
  lastName: "Hoàng",
  firstName: "Em",
  birthDate: "12-01-2018",
  gender: "M",
  gradeId: 1,
  startYear: 2025,
  gradeLevel: "GRADE_1",
  gradeName: "Lớp 1D",
}
  */

import useLatestHealthCheckCampaign from "@hooks/parent/useLatestHealthCheckCampaign"
import useSendHealthCheckSurvey from "@hooks/parent/health-check/useSendHealthCheckSurvey"
import { showErrorToast, showSuccessToast } from "@utils/toast-utils"

const HealthCheckSurveyByPupil = ({ currentPupil}) => {

  const { latestHealthCheckCampaign: healthCampaignInfo, isLoading: campaignLoading, refetch: campaignRefetch, error: campaignError } = useLatestHealthCheckCampaign();
  const { sendHealthCheckSurvey, loading: surveyLoading, error: surveyError } = useSendHealthCheckSurvey();


  // debug:
  // console.log("Health check campaign info:", JSON.stringify(healthCampaignInfo, null, 2));

  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDiseases, setSelectedDiseases] = useState([])
  const [agreementChecked, setAgreementChecked] = useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "success"
      case "PENDING":
        return "warning"
      case "COMPLETED":
        return "info"
      default:
        return "default"
    }
  }

  const handleCardClick = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    // Reset form state when closing
    setSelectedDiseases([])
    setAgreementChecked(false)
  }

  const handleDiseaseChange = (diseaseId, checked) => {
    if (checked) {
      setSelectedDiseases([...selectedDiseases, diseaseId])
    } else {
      setSelectedDiseases(selectedDiseases.filter((id) => id !== diseaseId))
    }
  }

  const handleAgreementChange = (event) => {
    setAgreementChecked(event.target.checked)
  }

  const handleSubmitSurvey = async () => {
    // Prepare form data
    const confirmationData = {
      campaignId: healthCampaignInfo?.campaignId,
      pupilId: currentPupil?.pupilId,
      diseaseId: selectedDiseases,
    }

    // debug:
    console.log("Survey data to be submitted:", JSON.stringify(confirmationData, null, 2))

    // logic for sending confitmationData to server:
    try {
      await sendHealthCheckSurvey(confirmationData);
      showSuccessToast("Health check survey submitted successfully!");
      // Close dialog after successful submission
      handleCloseDialog()
    } catch (error) {
      console.error("Error submitting health check survey:", error);
      showErrorToast("Failed to submit health check survey. Please try again later.");
    }
  }

  const isSubmitDisabled = selectedDiseases.length === 0 || !agreementChecked || surveyLoading

  if (healthCampaignInfo === null || healthCampaignInfo.length === 0 || campaignLoading) {
    return (
      <Card sx={{ mt: 5}}>
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          <Assignment sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            No Health Check Surveys
          </Typography>
          <Typography color="text.secondary">
            There are currently no health check survey available for review.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Container sx={{ py: 3, width: "100%" }}>
      {/* Campaign Card */}
      <Card
        sx={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          },
        }}
        onClick={handleCardClick}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Campaign Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "success.main", width: 56, height: 56 }}>
                <LocalHospital fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Health Check Survey
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {healthCampaignInfo?.title}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Student Info */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Person color="primary" />
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Student Information
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 6, md:3}}>
                <Typography variant="body2" color="text.secondary">
                  Student ID
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {currentPupil?.pupilId}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6, md:3}}>
                <Typography variant="body2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {currentPupil?.lastName} {currentPupil?.firstName}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6, md:3}}>
                <Typography variant="body2" color="text.secondary">
                  Birth Date
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {currentPupil?.birthDate}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6, md:3}}>
                <Typography variant="body2" color="text.secondary">
                  Class
                </Typography>
                <Chip label={currentPupil?.gradeName} color="primary" variant="outlined" />
              </Grid>
            </Grid>
          </Paper>

          {/* Examination Period */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "info.50" }}>
            <Typography variant="h6" fontWeight="bold" color="info.main" sx={{ mb: 2 }}>
              Examination Period
            </Typography>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Schedule color="success" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight="bold" color="success.main">
                    Start Date
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {formatDateTime(healthCampaignInfo?.startExaminationDate)}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Schedule color="error" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight="bold" color="error.main">
                    End Date
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {formatDateTime(healthCampaignInfo?.endExaminationDate)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Click to Continue */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body1" color="primary.main" fontWeight="bold">
              Click to review and confirm examination details
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Survey Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Assignment color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Health Check Consent Form
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {/* Student Information */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
              Student Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 6, md:3}}>
                <Typography variant="body2" color="text.secondary">
                  Student ID
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {currentPupil?.pupilId}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6, md:3}}>
                <Typography variant="body2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {currentPupil?.lastName} {currentPupil?.firstName}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6, md:3}}>
                <Typography variant="body2" color="text.secondary">
                  Birth Date
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {currentPupil?.birthDate}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6, md:3}}>
                <Typography variant="body2" color="text.secondary">
                  Class
                </Typography>
                <Chip label={currentPupil?.gradeName} color="primary" variant="outlined" />
              </Grid>
            </Grid>
          </Paper>

          {/* Campaign Information */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "success.50" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "success.main" }}>
              Campaign: {healthCampaignInfo?.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {healthCampaignInfo?.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Location:</strong> {healthCampaignInfo?.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Date:</strong> {formatDateTime(healthCampaignInfo?.startExaminationDate)} -{" "}
              {formatDateTime(healthCampaignInfo?.endExaminationDate)}
            </Typography>
          </Paper>

          {/* Disease Selection */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "warning.50" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "warning.main" }}>
              Sensitive diseases
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please select which examinations you consent to for your child:
            </Typography>

            {healthCampaignInfo?.diseases?.map((disease) => (
              <Paper key={disease.diseaseId} sx={{ p: 2, mb: 2, bgcolor: "white" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedDiseases.includes(disease.diseaseId)}
                      onChange={(e) => handleDiseaseChange(disease.diseaseId, e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {disease.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {disease.description}
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            ))}

            {selectedDiseases.length === 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Please select at least one examination area to proceed.
              </Alert>
            )}
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* Agreement Checkbox */}
          <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
            <FormControlLabel
              control={
                <Checkbox checked={agreementChecked} onChange={handleAgreementChange} color="success" size="large" />
              }
              label={
                <Box sx={{ ml: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    I agree to the selected examinations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    I understand and consent to the selected health examinations being performed on my child by
                    qualified school nurses during the scheduled health check campaign.
                  </Typography>
                </Box>
              }
            />
          </Paper>

          {!agreementChecked && selectedDiseases.length > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Please confirm your agreement to proceed with the submission.
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitSurvey}
            variant="contained"
            color="success"
            startIcon={surveyLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            disabled={isSubmitDisabled}
            sx={{ minWidth: 120 }}
          >
            {surveyLoading ? "Submitting..." : "Submit Survey"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default HealthCheckSurveyByPupil