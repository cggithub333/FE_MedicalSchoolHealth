"use client"
import { useEffect, useState } from "react"
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
  Alert
} from "@mui/material"
import {
  Person,
  Visibility,
  Assignment,
  Close,
  LocalHospital,
  Medication,
  Schedule,
  AccessTime,
} from "@mui/icons-material"
import { FaChildReaching as ChildIcon } from "react-icons/fa6";

import usePrescriptionByPupil from "@hooks/parent/send-medication/usePrescriptionByPupil";
import { parseMedicalInfo } from "@utils/parseLogsObject"
import { Base64 } from "js-base64";

const filterInforFromPrescriptionArr = (prescriptionArr) => {
  if (!prescriptionArr)
    return []; // Return empty array if input is null or undefined

  const filteredArr = prescriptionArr.map(item => {

    if (!item) {
      return null; // Handle null or undefined items
    }

    const newItem = {
      diseaseName: item.diseaseName || "disease name",
      status: item.status || "status",
      prescriptionImage: item.prescriptionImage || "prescription image",
      medicationLogs: item.medicationLogs || [],
    }

    return newItem;

  })

  return filteredArr.filter(item => (item != null &&
    item.medicationLogs &&
    item.medicationLogs.length > 0 &&
    item.status && item.status.toLowerCase() === "Approved".toLowerCase())
  ); // Filter out any null/underfined items
}
const filteredPupilInfo = ({ encoded, pupilInfo }) => {

  let pupilInfoIngredient = pupilInfo;

  if (encoded === true) {
    const decodedPupilInfo = Base64.decode(pupilInfo);
    pupilInfoIngredient = JSON.parse(decodedPupilInfo);
  }

  if (!pupilInfoIngredient) {
    return null; // Return empty object if input is null or undefined
  }
  const newPupilInfo = {
    pupilId: pupilInfoIngredient.pupilId || "pupil id",
    pupilName: (pupilInfoIngredient.lastName + " " + pupilInfoIngredient.firstName) || "pupil name",
    className: pupilInfoIngredient.gradeName || "class name",
    dateOfBirth: pupilInfoIngredient.birthDate || "date of birth",
  }
  return newPupilInfo;
}

// const filteredPrescriptionLogs = [
//   {
//     diseaseName: "Upset stomach and mild diarrhea",
//     status: "APPROVED",
//     prescriptionImage:
//       "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751986173965-thuoc-tay-3.jpeg?alt=media&token=9383ed53-64b3-4bce-9e1d-dd8347bb85d2",
//     medicationLogs: [
//       {
//         logId: 4,
//         givenTime: "08-07-2025 21:53:51",
//         note: `+ School Nurse's name: Vy Thủy

// + Disease: Upset stomach and mild diarrhea; Medication: Oral Rehydration Salts; Unit & Usage: Mix 1 sachet with 200ml water after each loose stool; Schedule: Before lunch: 10h30-11h00; Given: Yes; Given Time: 9:53:46 PM

// + Session: 2 (10:30-11:15)`,
//         status: "GIVEN",
//       },
//     ],
//   },
//   {
//     diseaseName: "Seasonal allergies with sneezing",
//     status: "APPROVED",
//     prescriptionImage:
//       "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751986107358-thuoc-tay-2.jpg?alt=media&token=46dee6d7-03ab-4aab-b4bd-ba4dd10e0174",
//     medicationLogs: [
//       {
//         logId: 5,
//         givenTime: "09-07-2025 11:50:12",
//         note: `+ School Nurse's name: Vy Thủy

// + Disease: Seasonal allergies with sneezing; Medication: Loratadine; Unit & Usage: 1 tablet daily in the morning; Schedule: After lunch: 11h30-12h00; Given: Yes; Given Time: 11:50 AM`,
//         status: "GIVEN",
//       },
//     ],
//   },
//   {
//     diseaseName: "Common cold with dry throat",
//     status: "APPROVED",
//     prescriptionImage:
//       "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751636931778-thuoc-tay-2.jpg?alt=media&token=a783bf40-30ef-4b0f-a86f-61e810a5762c",
//     medicationLogs: [
//       {
//         logId: 6,
//         givenTime: "10-07-2025 09:10:00",
//         note: `+ School Nurse's name: Vy Thủy

// + Disease: Common cold with dry throat; Medication: Honey syrup; Unit & Usage: 5ml to soothe dry throat and suppress cough; Schedule: After breakfast: 9h00-9h30; Given: Yes; Given Time: 9:10 AM`,
//         status: "GIVEN",
//       },
//     ],
//   },
//   {
//     diseaseName: "Mild cold and throat irritation",
//     status: "APPROVED",
//     prescriptionImage:
//       "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751627585773-thuoc-tay-4.jpg?alt=media&token=87fa66f2-7cd9-4d03-a663-9ffad8b143cf",
//     medicationLogs: [
//       {
//         logId: 7,
//         givenTime: "10-07-2025 10:45:32",
//         note: `+ School Nurse's name: Vy Thủy

// + Disease: Mild cold and throat irritation; Medication: Paracetamol; Unit & Usage: 1 tablet if child experiences mild discomfort; Schedule: Before lunch: 10h30-11h00; Given: Yes; Given Time: 10:45 AM`,
//         status: "GIVEN",
//       },
//       {
//         logId: 8,
//         givenTime: "10-07-2025 10:45:32",
//         note: `+ School Nurse's name: Vy Thủy

// + Disease: Mild cold and throat irritation; Medication: Paracetamol type 2; Unit & Usage: 1 tablet if child experiences mild discomfort; Schedule: Before lunch: 10h30-11h00; Given: Yes; Given Time: 10:45 AM`,
//         status: "GIVEN",
//       },
//     ],
//   },
// ]

const PrescriptionLogsContent = () => {

  // call custom hooks:
  const { prescriptionArr, loading: loadingPrescription, error: errorPrescription, refetch: refetchPrescription } = usePrescriptionByPupil(localStorage.getItem("pupilId"));
  const PupilInfor = filteredPupilInfo({ encoded: true, pupilInfo: localStorage.getItem("pupilInfor")});
  const filteredPrescriptionLogs = filterInforFromPrescriptionArr(prescriptionArr);

  // debug:
  // console.log("Pupil Information:", JSON.stringify(PupilInfor, null, 2));
  console.log("Filtered Prescription Logs:", JSON.stringify(filteredPrescriptionLogs, null, 2));

  const [medicationLogsDialogOpen, setMedicationLogsDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [selectedLog, setSelectedLog] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const [datePart, timePart] = dateTimeString.split(" ")
    const [day, month, year] = datePart.split("-")
    return `${day}/${month}/${year} ${timePart}`
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "success"
      case "GIVEN":
        return "info"
      case "PENDING":
        return "warning"
      case "REJECTED":
        return "error"
      default:
        return "default"
    }
  }

  const handleWatchClick = (prescription) => {
    setSelectedPrescription(prescription)
    setMedicationLogsDialogOpen(true)
  }

  const handleDetailsClick = (log) => {
    setSelectedLog(log)
    setDetailsDialogOpen(true)
  }

  const handleCloseMedicationLogsDialog = () => {
    setMedicationLogsDialogOpen(false)
    setSelectedPrescription(null)
  }

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false)
    setSelectedLog(null)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
          <Assignment />
        </Avatar>
        <Typography variant="h4" fontWeight="bold">
          Prescription Logs
        </Typography>
      </Box>
      <Box mb={2}>
        <Alert severity="info" sx={{ fontSize: "0.875rem" }}>
          You can watch other pupil's prescription logs by clicking on the <ChildIcon/> icon near the notification bell.
        </Alert>
      </Box>

      {/* Pupil Information */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Person color="primary" />
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              Student Information
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item size={{xs: 12, md:3}}>
              <Typography variant="body2" color="text.secondary">
                Student ID
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {PupilInfor?.pupilId}
              </Typography>
            </Grid>
            <Grid item size={{xs: 12, md:3}}>
              <Typography variant="body2" color="text.secondary">
                Student Name
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {PupilInfor?.pupilName}
              </Typography>
            </Grid>
            <Grid item size={{xs: 12, md:3}}>
              <Typography variant="body2" color="text.secondary">
                Class
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {PupilInfor?.className}
              </Typography>
            </Grid>
            <Grid item size={{xs: 12, md:3}}>
              <Typography variant="body2" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatDate(PupilInfor?.dateOfBirth)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Prescription Logs Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Typography variant="h6" fontWeight="bold">
              Prescription Logs ({filteredPrescriptionLogs.length} records)
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.50" }}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Disease Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight="bold">
                      Medication Logs
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
                {(filteredPrescriptionLogs && filteredPrescriptionLogs.length > 0) ? filteredPrescriptionLogs.map((prescription, index) => (
                  <TableRow key={index} sx={{ "&:hover": { bgcolor: "grey.50" } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {prescription.diseaseName}
                      </Typography>
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
                      <Chip
                        label={prescription.medicationLogs.length}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleWatchClick(prescription)}
                        sx={{ minWidth: 100 }}
                      >
                        Watch
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No prescription logs available.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
                }
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Medication Logs Dialog */}
      <Dialog open={medicationLogsDialogOpen} onClose={handleCloseMedicationLogsDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocalHospital color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Medication Logs - {selectedPrescription?.diseaseName}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseMedicationLogsDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.50" }}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Log ID
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Given Time
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Schedule
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Given Status
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
                  {selectedPrescription.medicationLogs.map((log) => {
                    const parsedInfo = parseMedicalInfo(log.note)
                    return (
                      <TableRow key={log.logId} sx={{ "&:hover": { bgcolor: "grey.50" } }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            #{log.logId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{formatDateTime(log.givenTime)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{parsedInfo.diseaseInfor.schedule || "N/A"}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={parsedInfo.diseaseInfor.given === "Yes" ? "Yes" : "No"}
                            color={parsedInfo.diseaseInfor.given === "Yes" ? "success" : "error"}
                            size="small"
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Assignment />}
                            onClick={() => handleDetailsClick(log)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseMedicationLogsDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={handleCloseDetailsDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Assignment color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Medication Log Details
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDetailsDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedLog && (
            <Box>
              {(() => {
                const parsedInfo = parseMedicalInfo(selectedLog.note)
                return (
                  <>
                    {/* Log Information */}
                    <Paper sx={{ p: 2, mb: 2, bgcolor: "primary.50" }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                        Log Information
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item size={{xs: 6}}>
                          <Typography variant="body2" color="text.secondary">
                            Log ID
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            #{selectedLog.logId}
                          </Typography>
                        </Grid>
                        <Grid item size={{xs: 6}}>
                          <Typography variant="body2" color="text.secondary">
                            Status
                          </Typography>
                          <Chip label={selectedLog.status} color={getStatusColor(selectedLog.status)} size="small" />
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* School Nurse */}
                    <Paper sx={{ p: 2, mb: 2, bgcolor: "success.50" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Person color="success" fontSize="small" />
                        <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                          School Nurse
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        {parsedInfo.nurseName || "N/A"}
                      </Typography>
                    </Paper>

                    {/* Disease Information */}
                    <Paper sx={{ p: 2, mb: 2, bgcolor: "warning.50" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <LocalHospital color="warning" fontSize="small" />
                        <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                          Disease
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        {parsedInfo.diseaseInfor.disease || "N/A"}
                      </Typography>
                    </Paper>

                    {/* Medication Details */}
                    <Paper sx={{ p: 2, mb: 2, bgcolor: "info.50" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Medication color="info" fontSize="small" />
                        <Typography variant="subtitle1" fontWeight="bold" color="info.main">
                          Medication Details
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Medication
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {parsedInfo.diseaseInfor.medication || "N/A"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Unit & Usage
                        </Typography>
                        <Typography variant="body2">{parsedInfo.diseaseInfor.unitUsage || "N/A"}</Typography>
                      </Box>
                    </Paper>

                    {/* Schedule */}
                    <Paper sx={{ p: 2, mb: 2, bgcolor: "grey.100" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Schedule color="action" fontSize="small" />
                        <Typography variant="subtitle1" fontWeight="bold">
                          Schedule
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        {parsedInfo.diseaseInfor.schedule || "N/A"}
                      </Typography>
                      {parsedInfo.sessionInfo && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Session: {parsedInfo.sessionInfo}
                        </Typography>
                      )}
                    </Paper>

                    {/* Medication Status */}
                    <Paper sx={{ p: 2, bgcolor: "error.50" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <AccessTime color="error" fontSize="small" />
                        <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                          Medication Taking Details
                        </Typography>
                      </Box>
                      <Grid container spacing={1}>
                        <Grid item size={{xs: 6}}>
                          <Typography variant="body2" color="text.secondary">
                            Given Status
                          </Typography>
                          <Chip
                            label={parsedInfo.diseaseInfor.given === "Yes" ? "Given" : "Not Given"}
                            color={parsedInfo.diseaseInfor.given === "Yes" ? "success" : "error"}
                            size="small"
                          />
                        </Grid>
                        <Grid item size={{xs: 6}}>
                          <Typography variant="body2" color="text.secondary">
                            Given Time
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {parsedInfo.diseaseInfor.givenTime || "N/A"}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          System Time
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatDateTime(selectedLog.givenTime)}
                        </Typography>
                      </Box>
                    </Paper>
                  </>
                )
              })()}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDetailsDialog} variant="contained" size="small">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default PrescriptionLogsContent
