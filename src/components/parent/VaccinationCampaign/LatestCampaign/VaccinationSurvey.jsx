"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Alert,
  Skeleton,
  Grid,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Divider,
  Paper,
} from "@mui/material"
import {
  Assignment,
  Warning,
  CheckCircle,
  Cancel,
  Person,
  Vaccines,
  LocalHospital,
  AccessTime,
  Close,
} from "@mui/icons-material"

// const consentForms = [
//   {
//     consentFormId: 1,
//     respondedAt: null,
//     status: "REJECTED",
//     formDeadline: "2025-07-04T23:59:59.999999999",
//     campaignId: 1,
//     campaignName: "Vaccination campaign middle 2025",
//     diseaseId: 5,
//     diseaseName: "Rubella",
//     doseNumber: 1,
//     currDoseNumber: 0,
//     vaccineId: 1,
//     vaccineName: "Vaccine MMR",
//     pupilId: "PP0001",
//     pupilName: "An",
//     gradeLevel: "GRADE_1"
//   },
//   {
//     consentFormId: 7,
//     respondedAt: null,
//     status: "REJECTED",
//     formDeadline: "2025-07-04T23:59:59.999999999",
//     campaignId: 1,
//     campaignName: "Vaccination campaign middle 2025",
//     diseaseId: 5,
//     diseaseName: "Rubella",
//     doseNumber: 1,
//     currDoseNumber: 0,
//     vaccineId: 1,
//     vaccineName: "Vaccine MMR",
//     pupilId: "PP0008",
//     pupilName: "Phát",
//     gradeLevel: "GRADE_5"
//   }
// ];

import useAllVaccinationSurveys from "@hooks/parent/vaccination/useAllVaccinationSurveys"

const VaccinationSurvey = () => {
  const { vaccinationSurveys, loading, error, refetch, submitResponse } = useAllVaccinationSurveys();
  
  const [selectedForm, setSelectedForm] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Debug log
  // console.log("Vaccination Surveys:\n", JSON.stringify(vaccinationSurveys))

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getGradeName = (gradeLevel) => {
    const gradeMap = {
      GRADE_1: "Lớp 1",
      GRADE_2: "Lớp 2",
      GRADE_3: "Lớp 3",
      GRADE_4: "Lớp 4",
      GRADE_5: "Lớp 5",
    }
    return gradeMap[gradeLevel] || gradeLevel
  }

  const getStatusChip = (status) => {
    if (status === "APPROVED") {
      return (
        <Chip
          label="Injected"
          size="small"
          sx={{
            bgcolor: "success.main",
            color: "white",
            fontWeight: "bold",
          }}
        />
      )
    } else if (status === "REJECTED") {
      return (
        <Chip
          label="Injected"
          size="small"
          sx={{
            bgcolor: "error.main",
            color: "white",
            fontWeight: "bold",
          }}
        />
      )
    }
    return null
  }

  const handleCardClick = (form) => {
    setSelectedForm(form)
    setIsConfirmed(false)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedForm(null)
    setIsConfirmed(false)
  }

  const handleSubmitResponse = async (response) => {
    if (!selectedForm || !isConfirmed) return

    setSubmitting(true)
    try {
      await submitResponse(selectedForm.consentFormId, response)
      handleCloseDialog()
    } catch (err) {
      console.error("Error submitting response:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const renderLoadingSkeleton = () => (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={300} height={40} />
      </Box>

      <Grid container spacing={3}>
        {[1, 2, 3].map((index) => (
          <Grid item size={{ xs: 12, md: 6, lg: 4 }} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )

  if (loading) {
    return renderLoadingSkeleton()
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error" icon={<Warning />}>
          Có lỗi xảy ra khi tải danh sách khảo sát tiêm chủng: {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Assignment color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight="bold">
          Vaccination Survey
        </Typography>
      </Box>

      {/* Survey Cards Grid */}
      <Grid container spacing={"100px"}>
        {vaccinationSurveys.map((form) => (
          <Grid item size={{ xs: 12, md: 6, lg: 4 }} key={form.consentFormId}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                width: "350px",
                height: "300px",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
              }}
              onClick={() => handleCardClick(form)}
            >
              {/* Status Chip in top right */}
              <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}>{getStatusChip(form.status)}</Box>

              <CardContent sx={{ pt: 3 }}>
                {/* Student Info */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Person color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    {form.pupilName}
                  </Typography>
                  <Chip label={getGradeName(form.gradeLevel)} size="small" variant="outlined" />
                </Box>

                {/* Disease and Vaccine Info */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, mt: 2 }}>
                    <LocalHospital color="error" fontSize="small" />
                    <Typography variant="body2" color="text.secondary" fontSize={'19px'}>
                      Disease:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" fontSize={'19px'}>
                      {form.diseaseName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 , mb: 2, mt: 2}}>
                    <Vaccines color="success" fontSize="small" />
                    <Typography variant="body2" color="text.secondary" fontSize={'19px'}>
                      Vaccine:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" fontSize={'19px'}>
                      {form.vaccineName}
                    </Typography>
                  </Box>
                </Box>

                {/* Deadline Warning */}
                <Alert
                  severity="warning"
                  icon={<AccessTime />}
                  sx={{
                    mt: 5,
                    "& .MuiAlert-message": {
                      fontSize: "0.875rem",
                    },
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    Form Deadline
                  </Typography>
                  <Typography variant="body2">{formatDate(form.formDeadline)}</Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Data State */}
      {vaccinationSurveys.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Assignment sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              No Vaccination Surveys
            </Typography>
            <Typography color="text.secondary">
              There are currently no vaccination surveys available for review.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Survey Detail Modal */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Assignment color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Vaccination Survey Details
              </Typography>
            </Box>
            <Button onClick={handleCloseDialog} sx={{ minWidth: "auto", p: 1 }}>
              <Close />
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent>
          {selectedForm && (
            <Box sx={{ pt: 1 }}>
              {/* Campaign Information */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.50", ...hoverPaper }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
                  Campaign Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12, md: 6}}>
                    <Typography variant="body2" color="text.secondary">
                      Campaign Name
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedForm.campaignName}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    {/* <Typography variant="body2" color="text.secondary">
                      Campaign ID
                    </Typography> */}
                    {/* <Typography variant="body1" fontWeight="bold">
                      #{selectedForm.campaignId}
                    </Typography> */}
                  </Grid>
                </Grid>
              </Paper>

              {/* Student Information */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "info.50", ...hoverPaper }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "info.main" }}>
                  Student Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Student ID
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedForm.pupilId}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Student Name
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedForm.pupilName}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Grade Level
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {getGradeName(selectedForm.gradeLevel)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Vaccination Details */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "success.50", ...hoverPaper }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "success.main" }}>
                  Vaccination Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary" >
                      Disease
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedForm.diseaseName}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Vaccine
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedForm.vaccineName}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Dose
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedForm.currDoseNumber + 1} of {selectedForm.doseNumber}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Form Deadline
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="warning.main">
                      {formatDate(selectedForm.formDeadline)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Divider sx={{ my: 3 }} />

              {/* Confirmation Checkbox */}
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                  Important Notice
                </Typography>
                <Typography variant="body2">
                  By proceeding with your decision, you acknowledge that you have read and understood all the
                  vaccination information provided. Your decision will affect your child's participation in the
                  vaccination campaign.
                </Typography>
              </Alert>

              <FormControlLabel
                control={<Checkbox checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} />}
                label={
                  <Typography variant="body2">
                    I confirm that I have read and understood the vaccination information and I am making an informed
                    decision for my child.
                  </Typography>
                }
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleSubmitResponse("REJECTED")}
            disabled={!isConfirmed || submitting}
            startIcon={<Cancel />}
          >
            {submitting ? "Processing..." : "Reject"}
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleSubmitResponse("APPROVED")}
            disabled={!isConfirmed || submitting}
            startIcon={<CheckCircle />}
          >
            {submitting ? "Processing..." : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

const hoverPaper = {
  transition: "all 0.8s ease",
  "&:hover": {  
    boxShadow: "0 2px 2px 3px rgba(0, 0, 0, 0.12)",
    transform: "scale(1.02)",
  },
}
export default VaccinationSurvey;
