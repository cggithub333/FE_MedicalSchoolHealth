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
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import {
  LocalHospital,
  Person,
  Phone,
  CalendarToday,
  Close,
  MedicalServices,
  Assignment,
  ContactPhone,
  School,
  Medication,
  Build,
} from "@mui/icons-material"

// const notiNewEventOfPupils = [
//   {
//     medicalEventId: 1,
//     injuryDescription: "Suspected sprained wrist from fall during playground activity",
//     treatmentDescription: "Applied ice pack, immobilized wrist with bandage, contacted parent for pickup",
//     detailedInformation: "Student fell during recess while playing on monkey bars. Complained of pain in right wrist.",
//     status: "MEDIUM",
//     dateTime: "03/09/2024 10:30:00",
//     isActive: true,
//     pupil: {
//       pupilId: "PP0001",
//       lastName: "Smith",
//       firstName: "Emily",
//       birthDate: "15-03-2018",
//       gender: "F",
//       avatar: "pupil1.jpg",
//       gradeId: 2,
//       startYear: 2024,
//       gradeLevel: "GRADE_2",
//       gradeName: "Grade 2",
//       parents: [
//         {
//           userId: "PR0001",
//           lastName: "Smith",
//           firstName: "John",
//           phoneNumber: 812922996,
//           role: "PARENT",
//         },
//       ],
//     },
//     schoolNurse: {
//       userId: "SN0001",
//       firstName: "Sarah",
//       lastName: "Johnson",
//       phoneNumber: "0812922997",
//     },
//     equipmentUsed: [
//       {
//         equipmentId: 1,
//         name: "Digital Thermometer",
//         description: "Non-contact infrared thermometer for measuring body temperature",
//         unit: "piece",
//         isActive: true,
//       },
//       {
//         equipmentId: 6,
//         name: "Pulse Oximeter",
//         description: "Device for measuring oxygen saturation in blood",
//         unit: "piece",
//         isActive: true,
//       },
//       {
//         equipmentId: 7,
//         name: "Disposable Gloves",
//         description: "Latex-free disposable gloves for medical examinations",
//         unit: "box",
//         isActive: true,
//       },
//       {
//         equipmentId: 9,
//         name: "First Aid Kit",
//         description: "Complete first aid kit with bandages, antiseptics, and basic medications",
//         unit: "piece",
//         isActive: true,
//       },
//     ],
//     medicationUsed: [
//       {
//         medicationId: 1,
//         name: "Paracetamol Syrup",
//         description: "Fever and pain relief medication for children",
//         dosage: "5ml twice daily",
//         unit: "ml",
//         isActive: true,
//       },
//     ],
//   },
// ]

import useNotifyNewMedicalEvents from "@hooks/parent/medical-events/useNotifyNewMedicalEvents"

const MedicalEventsContent = () => {

  const { notiNewEventOfPupils, loading, error, refetch } = useNotifyNewMedicalEvents();

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const formatDateTime = (dateTimeString) => {
    const [datePart, timePart] = dateTimeString.split(" ")
    const [day, month, year] = datePart.split("/")
    return {
      date: `${day}/${month}/${year}`,
      time: timePart,
      fullDateTime: new Date(`${year}-${month}-${day}T${timePart}`).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  const formatPhoneNumber = (phoneNumber) => {
    const phoneStr = phoneNumber.toString()
    return phoneStr.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "LOW":
        return "success"
      case "MEDIUM":
        return "warning"
      case "HIGH":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "LOW":
        return "All Good"
      case "MEDIUM":
        return "Noticed"
      case "HIGH":
        return "In Danger"
      default:
        return status
    }
  }

  const getGenderColor = (gender) => {
    return gender === "M" ? "primary" : "secondary"
  }

  const getGenderText = (gender) => {
    return gender === "M" ? "Male" : "Female"
  }

  const handleCardClick = (event) => {
    setSelectedEvent(event)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedEvent(null)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
          <LocalHospital />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Medical Events
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View medical incidents and treatments for your children
          </Typography>
        </Box>
        <Chip
          label={`${notiNewEventOfPupils?.length || 0} Event(s)`}
          color="primary"
          variant="filled"
          sx={{ ml: "auto", fontWeight: "bold" }}
        />
      </Box>

      {/* Medical Events Grid */}
      {notiNewEventOfPupils?.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <LocalHospital sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              No Medical Events
            </Typography>
            <Typography color="text.secondary">There are no medical events recorded for your children.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {notiNewEventOfPupils?.map((event) => {

            if (event == null) {
              return null;
            }

            return (
              <Grid item size={{xs: 12, md: 6}} lg={4} key={event.medicalEventId}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                  onClick={() => handleCardClick(event)}
                >
                  <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Header with Status */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <MedicalServices color="primary" />
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                          Event #{event.medicalEventId}
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusText(event.status)}
                        color={getStatusColor(event.status)}
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>

                    {/* Injury Description */}
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{
                        mb: 2,
                        minHeight: 48,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {event.injuryDescription}
                    </Typography>

                    {/* Date and Time */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(event.dateTime).date} at {formatDateTime(event.dateTime).time}
                      </Typography>
                    </Box>

                    {/* Student Information */}
                    <Paper sx={{ p: 2, mb: 2, bgcolor: "primary.50", flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Person color="primary" fontSize="small" />
                        <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                          Student
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        {event.pupil.lastName} {event.pupil.firstName}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Chip
                          label={getGenderText(event.pupil.gender)}
                          color={getGenderColor(event.pupil.gender)}
                          size="small"
                          variant="outlined"
                        />
                        <Typography variant="body2" color="text.secondary">
                          Born: {formatDate(event.pupil.birthDate)}
                        </Typography>
                      </Box>
                    </Paper>

                    {/* School Nurse Information */}
                    <Paper sx={{ p: 2, bgcolor: "success.50" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <School color="success" fontSize="small" />
                        <Typography variant="subtitle2" fontWeight="bold" color="success.main">
                          School Nurse
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        {event.schoolNurse.lastName} {event.schoolNurse.firstName}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {event.schoolNurse.phoneNumber}
                        </Typography>
                      </Box>
                    </Paper>

                    {/* Click to view details */}
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                      <Typography variant="body2" color="primary.main" fontWeight="bold">
                        Click to view full details
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          }
          )}
        </Grid>
      )}

      {/* Medical Event Detail Modal */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Assignment color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Medical Event Details - #{selectedEvent?.medicalEventId}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {selectedEvent && (
            <Box>
              {/* Event Overview */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    Event Overview
                  </Typography>
                  <Chip
                    label={getStatusText(selectedEvent.status)}
                    color={getStatusColor(selectedEvent.status)}
                    variant="filled"
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid item size={{xs: 12, md: 6}}>
                    <Typography variant="body2" color="text.secondary">
                      Date & Time
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatDateTime(selectedEvent.dateTime).fullDateTime}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 12, md: 6}}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedEvent.isActive ? "Active" : "Inactive"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Student Information */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "info.50" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "info.main" }}>
                  Student Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{xs: 12, md: 3}}>
                    <Typography variant="body2" color="text.secondary">
                      Student ID
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedEvent.pupil.pupilId}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 12, md: 3}}>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedEvent.pupil.lastName} {selectedEvent.pupil.firstName}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 12, md: 3}}>
                    <Typography variant="body2" color="text.secondary">
                      Birth Date
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatDate(selectedEvent.pupil.birthDate)}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 12, md: 3}}>
                    <Typography variant="body2" color="text.secondary">
                      Class
                    </Typography>
                    <Chip label={selectedEvent.pupil.gradeName} color="info" variant="outlined" />
                  </Grid>
                </Grid>
              </Paper>

              {/* School Nurse Information */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "success.50" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "success.main" }}>
                  Attending School Nurse
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{xs: 12, md: 4}}>
                    <Typography variant="body2" color="text.secondary">
                      Nurse ID
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedEvent.schoolNurse.userId}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 12, md: 4}}>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedEvent.schoolNurse.lastName} {selectedEvent.schoolNurse.firstName}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 12, md: 4}}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ContactPhone color="success" fontSize="small" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedEvent.schoolNurse.phoneNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Medical Details */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "warning.50" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "warning.main" }}>
                  Medical Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Injury Description
                  </Typography>
                  <Typography variant="body1">{selectedEvent.injuryDescription}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Treatment Provided
                  </Typography>
                  <Typography variant="body1">{selectedEvent.treatmentDescription}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Detailed Information
                  </Typography>
                  <Typography variant="body1">{selectedEvent.detailedInformation}</Typography>
                </Box>
              </Paper>

              {/* Equipment Used */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Build color="action" />
                  <Typography variant="h6" fontWeight="bold">
                    Equipment Used ({selectedEvent.equipmentUsed.length} items)
                  </Typography>
                </Box>
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Equipment Name
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Description
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Unit
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedEvent.equipmentUsed.map((equipment) => (
                        <TableRow key={equipment.equipmentId}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {equipment.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{equipment.description}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={equipment.unit} size="small" color="primary" variant="outlined" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* Medication Used */}
              <Paper sx={{ p: 3, bgcolor: "error.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Medication color="error" />
                  <Typography variant="h6" fontWeight="bold" color="error.main">
                    Medication Used ({selectedEvent.medicationUsed.length} items)
                  </Typography>
                </Box>
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Medication Name
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Description
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Dosage
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Unit
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedEvent.medicationUsed.map((medication) => (
                        <TableRow key={medication.medicationId}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {medication.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{medication.description}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="error.main">
                              {medication.dosage}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={medication.unit} size="small" color="error" variant="outlined" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* Parent Contact Information */}
              {selectedEvent.pupil.parents && selectedEvent.pupil.parents.length > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Parent Contact:</strong> {selectedEvent.pupil.parents[0].firstName}{" "}
                    {selectedEvent.pupil.parents[0].lastName} -{" "}
                    {formatPhoneNumber(selectedEvent.pupil.parents[0].phoneNumber)}
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default MedicalEventsContent