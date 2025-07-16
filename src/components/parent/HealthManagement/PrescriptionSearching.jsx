"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Alert,
  Skeleton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material"
import {
  Search,
  LocalPharmacy,
  CalendarToday,
  Note,
  Close,
  FilterList,
  Assignment,
  Schedule,
  CheckCircle,
  Cancel,
  Pending,
  ZoomIn,
  Fullscreen,
} from "@mui/icons-material"


import { FaChildReaching as ChildIcon } from "react-icons/fa6";
import usePrescriptionByPupil from "@hooks/parent/send-medication/usePrescriptionByPupil";
import useDeleteSendMedicationById from "@hooks/parent/send-medication/useDeleteSendMedicationById";

import { showWarningToast, showErrorToast, showSuccessToast } from "@utils/toast-utils";

const PrescriptionSearching = ({ pupil, userFullName }) => {

  const { prescriptionArr, loading, error, refetch } = usePrescriptionByPupil(pupil.pupilId)
  const { responseData, error: errorDelete, deleteSendMedicationWithId } = useDeleteSendMedicationById();
  
  const [isDeleting, setIsDeleting] = useState(false);

  // reload prescription data when a prescription is deleted
  // This is to ensure that the prescription list is updated after deletion
  useEffect(() => {
    if (errorDelete && isDeleting) {
      showErrorToast("Failed to delete prescription. Please try again.");
      setIsDeleting(false);
    }
  }, [errorDelete, isDeleting])

  useEffect(() => {
    if (responseData && isDeleting) {
      showSuccessToast("Prescription deleted successfully.");
      refetch(pupil.pupilId);
      setIsDeleting(false);
    }
  }, [responseData, isDeleting, pupil.pupilId, refetch])

  // debug:
  // console.log('PrescriptionSearching - prescriptionArr:\n', JSON.stringify(prescriptionArr))

  // Search and filter states
  const [searchYear, setSearchYear] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("ALL")
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")

  // Filter records based on search criteria
  const filteredRecords = useMemo(() => {
    return prescriptionArr.filter((record) => {

      // debug:
      // console.log('PrescriptionSearching - record:\n', JSON.stringify(record))

      const matchesYear = searchYear === "" || record.requestedDate.includes(searchYear)
      const matchesStatus = selectedStatus === "ALL" || record.status === selectedStatus
      return matchesYear && matchesStatus
    })
  }, [prescriptionArr, searchYear, selectedStatus])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning"
      case "APPROVED":
        return "success"
      case "REJECTED":
        return "error"
      case "COMPLETED":
        return "info"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Pending />
      case "APPROVED":
        return <CheckCircle />
      case "REJECTED":
        return <Cancel />
      case "COMPLETED":
        return <CheckCircle />
      default:
        return <Assignment />
    }
  }

  const handleCardClick = (record) => {
    setSelectedRecord(record)

    //debug:
    // console.log('PrescriptionSearching - handleCardClick - record:\n', JSON.stringify(record))

    setDialogOpen(true)
  }

  const handleDeletePrescription = async () => {

    if (!selectedRecord) {
      return;
    }

    if (selectedRecord.status !== "PENDING") {
      showErrorToast("Only pending prescriptions can be deleted.");
      return;
    }
    
    await showWarningToast("Making sure you want to delete this prescription");

    if (!confirm("You can't get back the prescription if you delete it. Do you want to continue?")) {
      showErrorToast("Prescription deletion cancelled.");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteSendMedicationWithId(selectedRecord.sendMedicationId);
      setDialogOpen(false)
    } catch (error) {
      setIsDeleting(false);
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedRecord(null)
  }

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
    setImageDialogOpen(true)
  }

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false)
    setSelectedImage("")
  }

  const clearFilters = () => {
    setSearchYear("")
    setSelectedStatus("ALL")
  }

  const renderLoadingSkeleton = () => (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={300} height={40} />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          {[1, 2, 3].map((index) => (
            <Grid item size={{ xs: 12, md: 4 }} key={index}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>
          ))}
        </Grid>
      </Paper>

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
        <Alert severity="error">Error loading prescription data: {error}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
            <LocalPharmacy />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Prescription Searching
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Search and manage medication prescriptions
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box mb={2}>
        <Alert severity="info" sx={{ fontSize: "0.875rem" }}>
          You can watch other pupil's prescription logs by clicking on the <ChildIcon /> icon near the notification bell.
        </Alert>
      </Box>

      {/* Pupil Information */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
          Student Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Student ID
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {pupil.pupilId}
            </Typography>
          </Grid>
          <Grid item size={{ xs: 12, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Full Name
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {pupil.lastName} {pupil.firstName}
            </Typography>
          </Grid>
          <Grid item size={{ xs: 12, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Birth Date
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {pupil.birthDate}
            </Typography>
          </Grid>
          <Grid item size={{ xs: 12, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Class
            </Typography>
            <Chip label={pupil.gradeName} color="primary" variant="outlined" />
          </Grid>
        </Grid>
      </Paper>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <FilterList color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Search and Filter
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="end">
          <Grid item size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Search by Year"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              placeholder="2025, 2024..."
              InputProps={{
                startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>

          <Grid item size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={selectedStatus} label="Status" onChange={(e) => setSelectedStatus(e.target.value)}>
                <MenuItem value="ALL">All Status</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item size={{ xs: 12, md: 3}}>
            <Button fullWidth sx={{ padding: "12px 10px", fontSize: "16px"}} variant="outlined" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Grid>

          <Grid item size={{ xs: 12, md: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 2.5 }}>
              {filteredRecords.length} results found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Status Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {["PENDING", "APPROVED", "REJECTED", "COMPLETED"].map((status) => {
          const count = prescriptionArr.filter((record) => record.status === status).length
          return (
            <Grid item size={{ xs: 6, md: 3 }} key={status}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: `${getStatusColor(status)}.50` }}>
                <Typography variant="h4" fontWeight="bold" color={`${getStatusColor(status)}.main`}>
                  {count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {status}
                </Typography>
              </Paper>
            </Grid>
          )
        })}
      </Grid>

      {/* Prescription Records */}
      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <LocalPharmacy sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              No Results Found
            </Typography>
            <Typography color="text.secondary">No prescription records match your search criteria</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredRecords.map((record) => {

            // debug:
            return (
              <Grid item size={{ xs: 12, md: 6, lg: 4 }} key={record.sendMedicationId}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                    height: 280, // Fixed height for uniform cards
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                  onClick={() => handleCardClick(record)}
                >
                  {/* Sender Name Chip in top right */}
                  <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}>
                    <Chip
                      label={userFullName || "Parent"}
                      color="primary"
                      size="small"
                      variant="filled"
                      sx={{ fontWeight: "bold", maxWidth: 120 }}
                    />
                  </Box>

                  <CardContent sx={{ pt: 5, flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Disease Name */}
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="primary.main"
                      sx={{
                        mb: 2,
                        pr: 8,
                        minHeight: 48,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {record.diseaseName}
                    </Typography>

                    {/* Request Date */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Request:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {(record.requestedDate)}
                      </Typography>
                    </Box>

                    {/* Start Date */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, mt: 1 }}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Start:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {(record.startDate)}
                      </Typography>
                    </Box>


                    {/* End Date */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        End:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {(record.endDate)}
                      </Typography>
                    </Box>

                    {/* Bottom section */}
                    <Box sx={{ mt: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Chip
                        label={record.status}
                        color={getStatusColor(record.status)}
                        icon={getStatusIcon(record.status)}
                        variant="filled"
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {record.medicationItems.length} medication(s)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Detail Modal - Smaller Size */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocalPharmacy color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Prescription Details
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          {selectedRecord && (
            <Box>
              {/* Basic Information */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: "primary.50" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                  Basic Information
                </Typography>
                <Grid container spacing={1}>
                  <Grid item size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Disease
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedRecord.diseaseName}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedRecord.status}
                      color={getStatusColor(selectedRecord.status)}
                      size="small"
                      variant="filled"
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Prescription Image */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: "success.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                    Prescription Image
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleImageClick(selectedRecord.prescriptionImage)}
                    sx={{ color: "success.main" }}
                  >
                    <ZoomIn />
                  </IconButton>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src={selectedRecord.prescriptionImage || "/placeholder.svg"}
                    alt="Prescription"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "150px",
                      borderRadius: "4px",
                      border: "1px solid #e0e0e0",
                      cursor: "pointer",
                    }}
                    onClick={() => handleImageClick(selectedRecord.prescriptionImage)}
                  />
                </Box>
              </Paper>

              {/* Medication List */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: "warning.50" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "warning.main" }}>
                  Medications ({selectedRecord.medicationItems.length})
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 200 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            Medication
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            Schedule
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRecord.medicationItems.map((medication, idx) => {
                      
                        // debug:
                        // console.log('PrescriptionSearching - medication:\n', JSON.stringify(medication))
                        
                        return (
                          <TableRow key={idx}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {medication.medicationName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="primary.main" fontWeight="bold">
                                {medication.medicationSchedule}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )
                      } )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
 
              {/* Usage and Unit */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: "warning.50" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "warning.main" }}>
                  Usages & Unit ({selectedRecord.medicationItems.length})
                </Typography>

                {selectedRecord.medicationItems.map((medication, idx) => {

                  const usage = medication.unitAndUsage || "No usage information available."

                  return (
                    <Box key={idx}>
                      <Typography fontSize={'15px'} variant="caption" color="text.primary">
                        <b>+ {medication.medicationName} : </b>
                        <span>{usage}</span>
                      </Typography>
                    </Box>
                  )
                })
                }
              </Paper>

              {/* Notes */}
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Note color="action" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Notes
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                  {selectedRecord.note}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleDeletePrescription} sx={{background: "red"}} variant="contained" size="small">
            Delete
          </Button>
          <Button onClick={handleCloseDialog} variant="contained" size="small">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Viewer Modal */}
      <Dialog open={imageDialogOpen} onClose={handleCloseImageDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Fullscreen color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Prescription Image
              </Typography>
            </Box>
            <IconButton onClick={handleCloseImageDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", p: 2 }}>
          <img
            src={selectedImage || "/placeholder.svg"}
            alt="Prescription Full Size"
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseImageDialog} variant="contained" size="small">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default PrescriptionSearching
