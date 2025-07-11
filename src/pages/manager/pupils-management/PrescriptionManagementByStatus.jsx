"use client"
import { useState, useMemo } from "react"
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
} from "@mui/material"
import {
  Assignment,
  Visibility,
  Close,
  Person,
  LocalHospital,
  Medication,
  Schedule,
  Image as ImageIcon,
  FilterList,
  ZoomIn,
} from "@mui/icons-material"

const allPrescriptions = [
  {
    pupilId: "PP0006",
    pupilFirstName: "Em",
    pupilLastName: "Hoàng",
    senderName: "AnhQuốc",
    sendMedicationId: 1,
    diseaseName: "Common cold with cough",
    startDate: "09-07-2025",
    endDate: "22-07-2025",
    requestedDate: "08-07-2025 16:49:33",
    prescriptionImage:
      "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751968169499-thuoc-tay-2.jpg?alt=media&token=7b080e82-2746-4bf5-a094-ea3177a8be39",
    note: "Child has persistent dry cough due to allergy. Needs antihistamine and cough suppressant.",
    status: "APPROVED",
    medicationItems: [
      {
        medicationId: 1,
        medicationName: "Guaifenesin",
        unitAndUsage: "1 tablet taken to loosen mucus and ease chest congestion",
        medicationSchedule: "Before lunch: 10h30-11h00",
      },
    ],
  },
  {
    pupilId: "PP0007",
    pupilFirstName: "Lan",
    pupilLastName: "Võ",
    senderName: "AnhQuốc",
    sendMedicationId: 2,
    diseaseName: "Mild cold and throat irritation",
    startDate: "10-07-2025",
    endDate: "23-07-2025",
    requestedDate: "08-07-2025 16:51:07",
    prescriptionImage:
      "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751968266926-thuoc-tay-3.jpeg?alt=media&token=4a570e39-e026-4732-bfba-ae447c2d553f",
    note: "Child has slight cold symptoms, no fever. Needs throat lozenges and warm fluids.",
    status: "PENDING",
    medicationItems: [
      {
        medicationId: 2,
        medicationName: "Paracetamol",
        unitAndUsage: "1 tablet if child experiences mild discomfort",
        medicationSchedule: "Before lunch: 10h30-11h00",
      },
    ],
  },
  {
    pupilId: "PP0008",
    pupilFirstName: "Phát",
    pupilLastName: "Phan",
    senderName: "Ha NguyenBao Khang",
    sendMedicationId: 3,
    diseaseName: "Common cold with dry throat",
    startDate: "08-07-2025",
    endDate: "16-07-2025",
    requestedDate: "08-07-2025 17:41:19",
    prescriptionImage:
      "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751971278112-thuoc-tay-4.jpg?alt=media&token=61562c39-c297-412f-b53e-13c3f3dc7094",
    note: "Just mild cold, no fever. Took honey-based syrup for throat relief.",
    status: "REJECTED",
    medicationItems: [
      {
        medicationId: 3,
        medicationName: "Honey syrup",
        unitAndUsage: "5ml to soothe dry throat and suppress cough",
        medicationSchedule: "After breakfast: 9h00-9h30",
      },
    ],
  },
  {
    pupilId: "PP0008",
    pupilFirstName: "Phát",
    pupilLastName: "Phan",
    senderName: "Ha NguyenBao Khang",
    sendMedicationId: 4,
    diseaseName: "Mild cold and throat irritation",
    startDate: "08-07-2025",
    endDate: "15-07-2025",
    requestedDate: "08-07-2025 18:02:28",
    prescriptionImage:
      "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751972546961-thuoc-tay-temp.jpg?alt=media&token=4e9e56dd-0774-4c98-8997-f8923c529788",
    note: "Child has slight cold symptoms, no fever. Needs throat lozenges and warm fluids.",
    status: "APPROVED",
    medicationItems: [
      {
        medicationId: 4,
        medicationName: "Paracetamol",
        unitAndUsage: "1 tablet if child experiences mild discomfort",
        medicationSchedule: "Before lunch: 10h30-11h00",
      },
      {
        medicationId: 5,
        medicationName: "Paracetamol 2",
        unitAndUsage: "1.5 tablet if child experiences mild discomfort",
        medicationSchedule: "After lunch: 11h30-12h00",
      },
    ],
  },
  {
    pupilId: "PP0006",
    pupilFirstName: "Em",
    pupilLastName: "Hoàng",
    senderName: "AnhQuốc",
    sendMedicationId: 5,
    diseaseName: "Seasonal allergies with sneezing",
    startDate: "08-07-2025",
    endDate: "17-07-2025",
    requestedDate: "08-07-2025 21:48:31",
    prescriptionImage:
      "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751986107358-thuoc-tay-2.jpg?alt=media&token=46dee6d7-03ab-4aab-b4bd-ba4dd10e0174",
    note: "Student experiences sneezing and watery eyes in the morning. Needs antihistamines and to avoid allergens.",
    status: "APPROVED",
    medicationItems: [
      {
        medicationId: 6,
        medicationName: "Loratadine",
        unitAndUsage: "1 tablet daily in the morning",
        medicationSchedule: "After lunch: 11h30-12h00",
      },
    ],
  },
  {
    pupilId: "PP0007",
    pupilFirstName: "Lan",
    pupilLastName: "Võ",
    senderName: "AnhQuốc",
    sendMedicationId: 6,
    diseaseName: "Upset stomach and mild diarrhea",
    startDate: "08-07-2025",
    endDate: "20-07-2025",
    requestedDate: "08-07-2025 21:49:35",
    prescriptionImage:
      "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751986173965-thuoc-tay-3.jpeg?alt=media&token=9383ed53-64b3-4bce-9e1d-dd8347bb85d2",
    note: "Mild digestive discomfort. Provide electrolyte solution and light meals.",
    status: "PENDING",
    medicationItems: [
      {
        medicationId: 7,
        medicationName: "Oral Rehydration Salts",
        unitAndUsage: "Mix 1 sachet with 200ml water after each loose stool",
        medicationSchedule: "Before lunch: 10h30-11h00",
      },
    ],
  },
]

const PrescriptionManagementByStatus = () => {
  // State for dialogs
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [selectedImage, setSelectedImage] = useState("")

  // State for filters
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [dateFilter, setDateFilter] = useState("")
  // Removed gradeFilter state as grade is not present in allPrescriptions

  // Helper functions
  const formatDateTime = (dateTimeString) => {
    const [datePart, timePart] = dateTimeString.split(" ")
    const [day, month, year] = datePart.split("-")
    return `${day}/${month}/${year} ${timePart}`
  }

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "success"
      case "PENDING":
        return "warning"
      case "REJECTED":
        return "error"
      default:
        return "default"
    }
  }

  // Removed getGradeFromPupilId as grade is not present in allPrescriptions

  // Calculate prescription counts by status
  const prescriptionCounts = useMemo(() => {
    const counts = { APPROVED: 0, PENDING: 0, REJECTED: 0 }
    allPrescriptions.forEach((prescription) => {
      counts[prescription.status] = (counts[prescription.status] || 0) + 1
    })
    return counts
  }, [])

  // Filter prescriptions
  const filteredPrescriptions = useMemo(() => {
    return allPrescriptions.filter((prescription) => {
      // Status filter
      if (statusFilter !== "ALL" && prescription.status !== statusFilter) {
        return false
      }

      // Date filter
      if (dateFilter) {
        const prescriptionDate = prescription.requestedDate.split(" ")[0]
        const [day, month, year] = prescriptionDate.split("-")
        const formattedDate = `${year}-${month}-${day}`
        if (formattedDate !== dateFilter) {
          return false
        }
      }

      return true
    })
  }, [statusFilter, dateFilter])

  // Event handlers
  const handleDetailsClick = (prescription) => {
    setSelectedPrescription(prescription)
    setDetailsDialogOpen(true)
  }

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
    setImageDialogOpen(true)
  }

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false)
    setSelectedPrescription(null)
  }

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false)
    setSelectedImage("")
  }

  const resetFilters = () => {
    setStatusFilter("ALL")
    setDateFilter("")
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
          <Assignment />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Prescription Management by Status
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage all prescriptions in the system
          </Typography>
        </Box>
      </Box>

      {/* Status Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item size={{xs: 12, md:4}}>
          <Card sx={{ bgcolor: "success.50", boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.1)" }}>
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="h3" fontWeight="bold" color="success.main">
                {prescriptionCounts.APPROVED}
              </Typography>
              <Typography variant="h6" color="success.dark">
                Approved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{xs: 12, md:4}}>
          <Card sx={{ bgcolor: "warning.50", boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.1)" }}>
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="h3" fontWeight="bold" color="warning.main">
                {prescriptionCounts.PENDING}
              </Typography>
              <Typography variant="h6" color="warning.dark">
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{xs: 12, md:4}}>
          <Card sx={{ bgcolor: "error.50", boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.1)" }}>
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="h3" fontWeight="bold" color="error.main">
                {prescriptionCounts.REJECTED}
              </Typography>
              <Typography variant="h6" color="error.dark">
                Rejected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Card */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Filter Board */}
          <Box sx={{ p: 3, bgcolor: "grey.50" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <FilterList color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Filter Prescriptions
              </Typography>
            </Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item size={{xs: 12, md:4}}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="ALL">All Status</MenuItem>
                    <MenuItem value="APPROVED">Approved</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="REJECTED">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item size={{xs: 12, md:4}}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Requested Date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item size={{xs: 12, md:4}}>
                <Button variant="outlined" onClick={resetFilters} sx={{ height: 40 }}>
                  Reset Filters
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Table Header */}
          <Box sx={{ p: 3, pb: 0 }}>
            <Typography variant="h6" fontWeight="bold">
              Prescription Records ({filteredPrescriptions.length} of {allPrescriptions.length})
            </Typography>
          </Box>

          {/* Prescriptions Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.50" }}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Pupil ID
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Pupil Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Disease Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Requested Date
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight="bold">
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPrescriptions.map((prescription) => (
                  <TableRow key={prescription.sendMedicationId} sx={{ "&:hover": { bgcolor: "grey.50" } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {prescription.pupilId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {prescription.pupilLastName} {prescription.pupilFirstName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{prescription.diseaseName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDateTime(prescription.requestedDate)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={prescription.status}
                        color={getStatusColor(prescription.status)}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleDetailsClick(prescription)}
                        sx={{ minWidth: 100 }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPrescriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No prescriptions found matching the selected filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Assignment color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Prescription Details
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDetailsDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedPrescription && (
            <Box>
              {/* Basic Information */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: "primary.50" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{xs: 6}}>
                    <Typography variant="body2" color="text.secondary">
                      Prescription ID
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      #{selectedPrescription.sendMedicationId}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 6}}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedPrescription.status}
                      color={getStatusColor(selectedPrescription.status)}
                      size="small"
                    />
                  </Grid>
                  <Grid item size={{xs: 6}}>
                    <Typography variant="body2" color="text.secondary">
                      Requested Date
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatDateTime(selectedPrescription.requestedDate)}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 6}}>
                    <Typography variant="body2" color="text.secondary">
                      Sender
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {selectedPrescription.senderName}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Student Information */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: "success.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Person color="success" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                    Student Information
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item size={{xs: 6}}>
                    <Typography variant="body2" color="text.secondary">
                      Student ID
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {selectedPrescription.pupilId}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 6}}>
                    <Typography variant="body2" color="text.secondary">
                      Student Name
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {selectedPrescription.pupilLastName} {selectedPrescription.pupilFirstName}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Medical Information */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: "warning.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <LocalHospital color="warning" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                    Medical Information
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Disease
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedPrescription.diseaseName}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Treatment Period
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(selectedPrescription.startDate)} - {formatDate(selectedPrescription.endDate)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body2">{selectedPrescription.note}</Typography>
                </Box>
              </Paper>

              {/* Medications */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: "info.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Medication color="info" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight="bold" color="info.main">
                    Medications ({selectedPrescription.medicationItems.length})
                  </Typography>
                </Box>
                {selectedPrescription.medicationItems.map((medication, index) => (
                  <Box key={medication.medicationId} sx={{ mb: 2, p: 2, bgcolor: "white", borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                      {index + 1}. {medication.medicationName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Usage: {medication.unitAndUsage}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Schedule: {medication.medicationSchedule}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>

              {/* Prescription Image */}
              <Paper sx={{ p: 2, bgcolor: "grey.100" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <ImageIcon color="action" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Prescription Image
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src={selectedPrescription.prescriptionImage || "/placeholder.svg"}
                    alt="Prescription"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "200px",
                      objectFit: "contain",
                      cursor: "pointer",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                    onClick={() => handleImageClick(selectedPrescription.prescriptionImage)}
                  />
                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ZoomIn />}
                      onClick={() => handleImageClick(selectedPrescription.prescriptionImage)}
                    >
                      View Full Size
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDetailsDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Zoom Dialog */}
      <Dialog open={imageDialogOpen} onClose={handleCloseImageDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight="bold">
              Prescription Image
            </Typography>
            <IconButton onClick={handleCloseImageDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", p: 2 }}>
          {selectedImage && (
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Prescription Full Size"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseImageDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default PrescriptionManagementByStatus