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

const pendingMedicationRequests = [
  {
    pupilId: "PP0001",
    sendMedicationId: 2,
    diseaseName: "Seasonal allergy",
    startDate: "03-07-2025",
    endDate: "08-07-2025",
    requestedDate: "02-07-2025 08:15:10",
    prescriptionImage: "https://cdn.medigoapp.com/website/uploads/2022/10/toa-thuoc-mau-1.jpg",
    note: "Child is sneezing and has watery eyes in the morning.",
    status: "PENDING",
    medicationItems: [
      {
        medicationId: 4,
        medicationName: "Loratadine",
        unitAndUsage: "1 tablet for allergy relief",
        medicationSchedule: "After breakfast: 8h00-8h30",
      },
      {
        medicationId: 5,
        medicationName: "Saline nasal spray",
        unitAndUsage: "1 spray per nostril",
        medicationSchedule: "Before bed: 20h30-21h00",
      },
    ],
    medicationLogs: [],
  },
  {
    pupilId: "PP0002",
    sendMedicationId: 3,
    diseaseName: "Stomach flu",
    startDate: "02-07-2025",
    endDate: "06-07-2025",
    requestedDate: "02-07-2025 12:33:44",
    prescriptionImage: "https://images.benhvienvinhchuc.vn/2023/03/toa-thuoc-viem-da-co-dia.jpg",
    note: "She has mild diarrhea and stomach cramps.",
    status: "PENDING",
    medicationItems: [
      {
        medicationId: 6,
        medicationName: "ORS (Oral Rehydration Salts)",
        unitAndUsage: "100ml after each loose stool",
        medicationSchedule: "As needed",
      },
      {
        medicationId: 7,
        medicationName: "Buscopan",
        unitAndUsage: "1 tablet to ease abdominal pain",
        medicationSchedule: "After lunch: 12h30-13h00",
      },
    ],
    medicationLogs: [],
  },
  {
    pupilId: "PP0003",
    sendMedicationId: 4,
    diseaseName: "Mild fever and fatigue",
    startDate: "04-07-2025",
    endDate: "07-07-2025",
    requestedDate: "03-07-2025 10:20:33",
    prescriptionImage: "https://toathuoc.vn/wp-content/uploads/2021/06/toa-thuoc-1.jpg",
    note: "Child feels tired with a slight fever.",
    status: "PENDING",
    medicationItems: [
      {
        medicationId: 8,
        medicationName: "Paracetamol 250mg",
        unitAndUsage: "1 tablet to reduce fever",
        medicationSchedule: "Every 6 hours as needed",
      },
    ],
    medicationLogs: [],
  },
  {
    pupilId: "PP0004",
    sendMedicationId: 5,
    diseaseName: "Eye infection",
    startDate: "05-07-2025",
    endDate: "09-07-2025",
    requestedDate: "04-07-2025 15:45:01",
    prescriptionImage: "https://trungtamthuoc.com/images/ckeditor/toathuoc.jpg",
    note: "His right eye is red and watery.",
    status: "PENDING",
    medicationItems: [
      {
        medicationId: 9,
        medicationName: "Tobramycin eye drops",
        unitAndUsage: "1 drop in affected eye",
        medicationSchedule: "Morning, noon, and evening",
      },
    ],
    medicationLogs: [],
  },
  {
    pupilId: "PP0005",
    sendMedicationId: 6,
    diseaseName: "Sore throat",
    startDate: "01-07-2025",
    endDate: "05-07-2025",
    requestedDate: "01-07-2025 19:12:59",
    prescriptionImage: "https://ytevietnhat.com/upload/images/news/toathuocmau.jpg",
    note: "She complains of throat pain when swallowing.",
    status: "PENDING",
    medicationItems: [
      {
        medicationId: 10,
        medicationName: "Cefixime 100mg",
        unitAndUsage: "1 tablet to treat infection",
        medicationSchedule: "After dinner: 18h00-18h30",
      },
      {
        medicationId: 11,
        medicationName: "Betadine gargle",
        unitAndUsage: "Gargle for 30 seconds",
        medicationSchedule: "Morning and night",
      },
    ],
    medicationLogs: [],
  },
  {
    pupilId: "PP0006",
    sendMedicationId: 1,
    diseaseName: "Common cold with cough",
    startDate: "01-07-2025",
    endDate: "10-07-2025",
    requestedDate: "01-07-2025 21:54:22",
    prescriptionImage: "https://anh.24h.com.vn/upload/4-2014/images/2014-10-24/1414124020-toa-thuoc.jpg",
    note: "My child has a mild cough and sore throat. Please help him take the medicine on time.",
    status: "PENDING",
    medicationItems: [
      {
        medicationId: 1,
        medicationName: "Dextromethorphan",
        unitAndUsage: "1 capsule taken by mouth to suppress dry cough",
        medicationSchedule: "After breakfast: 9h00-9h30",
      },
      {
        medicationId: 2,
        medicationName: "Guaifenesin",
        unitAndUsage: "1 tablet taken to loosen mucus and ease chest congestion",
        medicationSchedule: "After lunch: 11h30-12h00",
      },
      {
        medicationId: 3,
        medicationName: "Strepsils lozenges",
        unitAndUsage: "1 lozenge dissolved slowly in mouth to soothe throat",
        medicationSchedule: "Before lunch: 10h30-11h00",
      },
    ],
    medicationLogs: [],
  },
  {
    pupilId: "PP0007",
    sendMedicationId: 7,
    diseaseName: "Skin rash",
    startDate: "06-07-2025",
    endDate: "11-07-2025",
    requestedDate: "05-07-2025 11:00:15",
    prescriptionImage: "https://cdn.medigoapp.com/website/uploads/2022/11/toa-thuoc-bac-si.jpg",
    note: "Red rash appeared on his arms and back.",
    status: "PENDING",
    medicationItems: [
      {
        medicationId: 12,
        medicationName: "Hydrocortisone cream",
        unitAndUsage: "Apply a thin layer on affected area",
        medicationSchedule: "Morning and night",
      },
      {
        medicationId: 13,
        medicationName: "Cetirizine",
        unitAndUsage: "1 tablet for itching",
        medicationSchedule: "After dinner: 19h00-19h30",
      },
    ],
    medicationLogs: [],
  },
]

const PrescriptionRequestPageRequestList = () => {
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

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

  const handleRejectClick = () => {
    // Empty function - logic to be added later
    console.log("Reject clicked for request:", selectedRequest?.sendMedicationId)
  }

  const handleApproveClick = () => {
    // Empty function - logic to be added later
    console.log("Approve clicked for request:", selectedRequest?.sendMedicationId)
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
      <Grid container spacing={3}>
        {pendingMedicationRequests.map((request) => (
          <Grid item size={{ xs: 12}} key={request.sendMedicationId}>
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
        ))}
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
                <Box sx={{ textAlign: "center" }}>
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