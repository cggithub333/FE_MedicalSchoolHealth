"use client"

import { useState } from "react"
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Skeleton,
  Pagination
} from "@mui/material"
import {
  LocalPharmacy,
  Person,
  CalendarToday,
  Schedule,
  Note,
  Close,
  CheckCircle,
  Cancel,
  Medication,
  Image as ImageIcon,
} from "@mui/icons-material"

import { useEffect } from "react"

const renderLoadingSkeleton = ({ length: length }) => (
  <Container maxWidth="md" sx={{ py: 3 }}>
    {Array.from({ length: length }, (_, i) => i).map((index) => (
      <Card key={index} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" height={24} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
            <Skeleton variant="rectangular" width={80} height={32} />
          </Box>
        </CardContent>
      </Card>
    ))}
  </Container>
)

import useUpdatePrescriptionStatus from "@hooks/schoolnurse/send-medication/useUpdatePrescriptionStatus"
import useAllPendingPrescriptions from "@hooks/schoolnurse/useAllPendingPrescriptions"

import { showSuccessToast, showErrorToast, showWarningToast } from "@utils/toast-utils"

const PrescriptionRequestPageRequestList = () => {
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [imageOpen, setImageOpen] = useState(false)

  const REQUESTS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1)

  const { updateStatus, error: updateError, success: updateSuccess } = useUpdatePrescriptionStatus()
  const { pendingMedicationRequests, loading, error, refetch } = useAllPendingPrescriptions()

  // Add useEffect to handle success/error states
  useEffect(() => {
    if (updateSuccess) {
      showSuccessToast("Request status updated successfully.")
      handleCloseDialog() // This will close the dialog when success updates
      // Refetch the pending prescriptions to update the list
      refetch()
    }
  }, [updateSuccess, refetch])

  useEffect(() => {
    if (updateError) {
      showErrorToast("Failed to update request status. Please try again.")
    }
  }, [updateError])



  if (loading) {
    if (pendingMedicationRequests.length === 0) {
      return renderLoadingSkeleton({ length: 3 })
    }
    return renderLoadingSkeleton({ length:  pendingMedicationRequests.length })
  }

  const formatDate = (dateString) => {
    const [datePart, timePart] = dateString.split(" ")
    const [day, month, year] = datePart.split("-")
    return {
      date: `${day}/${month}/${year}`,
      time: timePart || "",
    }
  }

  const formatSimpleDate = (dateString) => {
    const [day, month, year] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning"
      case "APPROVED":
        return "success"
      case "REJECTED":
        return "error"
      default:
        return "default"
    }
  }

  const handleCardClick = (request) => {
    setSelectedRequest(request)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedRequest(null)
  }

  const handleRejectClick = async () => {
    // if no request is selected, return the function:
    if (!selectedRequest) {
      await showWarningToast("No request selected for rejection.")
      return
    }

    // else: - has selectedRequest
    await showWarningToast("You're about to reject this request. Are you sure?");
    if (!window.confirm("Are you sure you want to reject this request?")) {
      showErrorToast("Rejection cancelled.")
      return
    }
    //else: agree to reject the request
    try {
      await updateStatus(selectedRequest.sendMedicationId, "REJECTED")

    } catch (error) {
      console.error("Error rejecting request:", error)
      showErrorToast("Failed to reject the request. Please try again.")
    }
  }

  const handleApproveClick = async () => {
    // if no request is selected, return the function:
    if (!selectedRequest) {
      showWarningToast("No request selected for approval.")
      return
    }

    // else: - has selectedRequest
    await showWarningToast("You're about to approve this request. Are you sure?");
    if (!window.confirm("Are you sure you want to approve this request?")) {
      showErrorToast("Approval cancelled.")
      return
    }
    
    //else: agree to approve the request
    try {
      await updateStatus(selectedRequest.sendMedicationId, "APPROVED")
      
    } catch (error) {
      console.error("Error approving request:", error)
      showErrorToast("Failed to approve the request. Please try again.")
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
          <LocalPharmacy />
        </Avatar>
        <Box>
          <Typography fontSize={'20px'} fontWeight="bold" color="primary.main">
            Prescription Request List
          </Typography>
          <Typography variant="body1" color="text.secondary" fontSize={'17px'}>
            Manage and review all prescription requests from parents
          </Typography>
        </Box>
        <Chip
          label={`${pendingMedicationRequests.length} Requests`}
          color="primary"
          variant="filled"
          sx={{ ml: "auto", fontWeight: "bold" }}
        />
      </Box>

      {/* Request Cards Grid */}
      <Grid container spacing={3} marginTop={2}>
        {pendingMedicationRequests.map((request, idx) => {

          const startIdx = (currentPage - 1) * REQUESTS_PER_PAGE;
          const endIdx = startIdx + REQUESTS_PER_PAGE;

          if (idx < startIdx || idx >= endIdx) { // out of current page range
            return null; // Skip rendering this card
          }

          return (
            <Grid item size={{ xs: 12 }} key={request.sendMedicationId}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  height: "100%",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
                onClick={() => handleCardClick(request)}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header with Status */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Person color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        {request.pupilId}
                      </Typography>
                    </Box>
                    <Chip label={request.status} color={getStatusColor(request.status)} size="small" variant="filled" />
                  </Box>

                  {/* Disease Name */}
                  <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                    {request.diseaseName}
                  </Typography>

                  {/* Dates Information */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Requested:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatDate(request.requestedDate).date}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Schedule fontSize="small" color="success" />
                      <Typography variant="body2" color="text.secondary">
                        Treatment:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {formatSimpleDate(request.startDate)} - {formatSimpleDate(request.endDate)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Medication Count */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      bgcolor: "grey.100",
                      p: 1.5,
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Medication color="primary" fontSize="small" />
                      <Typography variant="body2" fontWeight="bold">
                        {request.medicationItems.length} Medications
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="primary.main" fontWeight="bold">
                      Click to Review
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
        <Grid item size={{xs: 12}} sx={{ display: "flex", justifyContent: "center", mt: 3}}>
        {
          pendingMedicationRequests != null && (pendingMedicationRequests || []) && (
              <Pagination count={Math.ceil(pendingMedicationRequests.length / REQUESTS_PER_PAGE)} 
                          variant="outlined" 
                          color="primary" 
                          onChange={(event, page) => {
                            // debug:
                            // console.log("Page changed to:", page);
                            setCurrentPage(page);
                          }}/>
          )
        }
        </Grid>
      </Grid>

      {/* Detail Modal */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocalPharmacy color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Prescription Request Details
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          {selectedRequest && (
            <Box>
              {/* Basic Information */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
                  Request Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{xs: 6, md: 3}}>
                    <Typography variant="body2" color="text.secondary">
                      Request ID
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      #{selectedRequest.sendMedicationId}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 6, md: 3}}>
                    <Typography variant="body2" color="text.secondary">
                      Student ID
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedRequest.pupilId}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 6, md: 3}}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedRequest.status}
                      color={getStatusColor(selectedRequest.status)}
                      size="small"
                      variant="filled"
                    />
                  </Grid>
                  <Grid item size={{xs: 6, md: 3}}>
                    <Typography variant="body2" color="text.secondary">
                      Requested Date
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatDate(selectedRequest.requestedDate).date}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Disease and Treatment Period */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "warning.50" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "warning.main" }}>
                  Medical Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{xs: 12, md: 4}}>
                    <Typography variant="body2" color="text.secondary">
                      Disease/Condition
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedRequest.diseaseName}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 6, md: 4}}>
                    <Typography variant="body2" color="text.secondary">
                      Treatment Start
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="success.main">
                      {formatSimpleDate(selectedRequest.startDate)}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 6, md: 4}}>
                    <Typography variant="body2" color="text.secondary">
                      Treatment End
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="error.main">
                      {formatSimpleDate(selectedRequest.endDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              

              {/* Prescription Image */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "success.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <ImageIcon color="success" />
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    Prescription Image
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center", cursor: "pointer"}} onClick={() => setImageOpen(true)}>
                  <img
                    src={selectedRequest.prescriptionImage || "/placeholder.svg"}
                    alt="Prescription"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                    }}
                  />
                </Box>
              </Paper>

              {/* Prescription Image Dialog */}
              <Dialog
                open={imageOpen}
                onClose={() => setImageOpen(false)}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent:' space-between' }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ImageIcon color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        Prescription Image
                      </Typography>
                    </Box>
                    <IconButton onClick={() => setImageOpen(false)} size="small">
                      <Close />
                    </IconButton>
                  </Box>
                </DialogTitle>
                <DialogContent sx={{ p: 2, textAlign: "center" }}>
                  <img
                    src={selectedRequest.prescriptionImage || "/placeholder.svg"}
                    alt="Prescription"
                    style={{
                      width: "90%",
                      height: "auto",
                      maxWidth: "90%",
                      maxHeight: "90%",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                    }}
                  />
                </DialogContent>
                <DialogActions sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                  <Button sx={{ background: "red", fontWeight: "700", color:"#fff"}} onClick={() => setImageOpen(false)} variant="outlined" color="inherit">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
              
              {/* Medication List */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "info.50" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "info.main" }}>
                  Medication List ({selectedRequest.medicationItems.length} items)
                </Typography>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Medication Name
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Usage Instructions
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Schedule
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRequest.medicationItems.map((medication) => (
                        <TableRow key={medication.medicationId}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {medication.medicationName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{medication.unitAndUsage}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={medication.medicationSchedule}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* Notes */}
              <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Note color="action" />
                  <Typography variant="h6" fontWeight="bold">
                    Parent's Notes
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.6, fontStyle: "italic" }}>
                  "{selectedRequest.note}"
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined" color="inherit">
            Close
          </Button>
          <Button
            onClick={handleRejectClick}
            variant="contained"
            color="error"
            startIcon={<Cancel />}
            sx={{ minWidth: 120 }}
          >
            Reject
          </Button>
          <Button
            onClick={handleApproveClick}
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            sx={{ minWidth: 120 }}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default PrescriptionRequestPageRequestList