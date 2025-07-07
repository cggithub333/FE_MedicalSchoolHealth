"use client"

import * as React from "react"
import { useState } from "react"
import {
    Box,
    Tab,
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
    Typography,
    Chip,
    Grid,
    IconButton,
    Pagination,
} from "@mui/material"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import {
    Visibility,
    Person,
    LocalPharmacy,
    CalendarToday,
    Note,
    Close,
    Medication,
    Image as ImageIcon,
} from "@mui/icons-material"
import PrescriptionDatePicker from "./PrescriptionDatePicker"

// Fake prescriptions data:
const allPrescriptions = [
    {
        pupilId: "PP0006",
        pupilFirstName: "Em",
        pupilLastName: "Hoàng",
        senderName: "AnhQuốc",
        sendMedicationId: 1,
        diseaseName: "Common cold with cough",
        startDate: "05-07-2025",
        endDate: "09-07-2025",
        requestedDate: "04-07-2025 18:10:43",
        prescriptionImage:
            "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751627439623-thuoc-tay-2.jpg?alt=media&token=728206e9-054f-4d20-8fb8-1d4dcd1e0ab9",
        note: "Child has persistent dry cough due to allergy. Needs antihistamine and cough suppressant.",
        status: "APPROVED",
        medicationItems: [
            {
                medicationId: 15,
                medicationName: "Betadine gargle",
                unitAndUsage: "Gargle for 30 seconds",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
        ],
    },
    {
        pupilId: "PP0006",
        pupilFirstName: "Em",
        pupilLastName: "Hoàng",
        senderName: "AnhQuốc",
        sendMedicationId: 2,
        diseaseName: "Allergic cough",
        startDate: "04-07-2025",
        endDate: "15-07-2025",
        requestedDate: "04-07-2025 18:11:46",
        prescriptionImage:
            "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751627504653-thuoc-tay-3.jpeg?alt=media&token=bd7153ef-7b49-4582-be0d-0b8465ae1b42",
        note: "Child has persistent dry cough due to allergy. Needs antihistamine and cough suppressant.",
        status: "COMPLETED",
        medicationItems: [
            {
                medicationId: 15,
                medicationName: "Betadine gargle",
                unitAndUsage: "Gargle for 30 seconds",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
        ],
    },
    {
        pupilId: "PP0007",
        pupilFirstName: "Lan",
        pupilLastName: "Võ",
        senderName: "AnhQuốc",
        sendMedicationId: 3,
        diseaseName: "Mild cold and throat irritation",
        startDate: "04-07-2025",
        endDate: "10-07-2025",
        requestedDate: "04-07-2025 18:13:06",
        prescriptionImage:
            "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751627585773-thuoc-tay-4.jpg?alt=media&token=87fa66f2-7cd9-4d03-a663-9ffad8b143cf",
        note: "Child has slight cold symptoms, no fever. Needs throat lozenges and warm fluids.",
        status: "APPROVED",
        medicationItems: [
            {
                medicationId: 15,
                medicationName: "Betadine gargle",
                unitAndUsage: "Gargle for 30 seconds",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
        ],
    },
    {
        pupilId: "PP0007",
        pupilFirstName: "Lan",
        pupilLastName: "Võ",
        senderName: "AnhQuốc",
        sendMedicationId: 4,
        diseaseName: "Mild cold and throat irritation",
        startDate: "04-07-2025",
        endDate: "10-07-2025",
        requestedDate: "04-07-2025 18:13:06",
        prescriptionImage:
            "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751627585773-thuoc-tay-4.jpg?alt=media&token=87fa66f2-7cd9-4d03-a663-9ffad8b143cf",
        note: "Child has slight cold symptoms, no fever. Needs throat lozenges and warm fluids.",
        status: "APPROVED",
        medicationItems: [
            {
                medicationId: 15,
                medicationName: "Betadine gargle",
                unitAndUsage: "Gargle for 30 seconds",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
        ],
    },
    {
        pupilId: "PP0007",
        pupilFirstName: "Lan",
        pupilLastName: "Võ",
        senderName: "AnhQuốc",
        sendMedicationId: 5,
        diseaseName: "Mild cold and throat irritation",
        startDate: "04-07-2025",
        endDate: "10-07-2025",
        requestedDate: "04-07-2025 18:13:06",
        prescriptionImage:
            "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751627585773-thuoc-tay-4.jpg?alt=media&token=87fa66f2-7cd9-4d03-a663-9ffad8b143cf",
        note: "Child has slight cold symptoms, no fever. Needs throat lozenges and warm fluids.",
        status: "APPROVED",
        medicationItems: [
            {
                medicationId: 15,
                medicationName: "Betadine gargle",
                unitAndUsage: "Gargle for 30 seconds",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
        ],
    },
    {
        pupilId: "PP0007",
        pupilFirstName: "Lan",
        pupilLastName: "Võ",
        senderName: "AnhQuốc",
        sendMedicationId: 6,
        diseaseName: "Mild cold and throat irritation",
        startDate: "04-07-2025",
        endDate: "10-07-2025",
        requestedDate: "04-07-2025 18:13:06",
        prescriptionImage:
            "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751627585773-thuoc-tay-4.jpg?alt=media&token=87fa66f2-7cd9-4d03-a663-9ffad8b143cf",
        note: "Child has slight cold symptoms, no fever. Needs throat lozenges and warm fluids.",
        status: "APPROVED",
        medicationItems: [
            {
                medicationId: 15,
                medicationName: "Betadine gargle",
                unitAndUsage: "Gargle for 30 seconds",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
        ],
    },
    {
        pupilId: "PP0007",
        pupilFirstName: "Lan",
        pupilLastName: "Võ",
        senderName: "AnhQuốc",
        sendMedicationId:7,
        diseaseName: "Mild cold and throat irritation",
        startDate: "04-07-2025",
        endDate: "10-07-2025",
        requestedDate: "04-07-2025 18:13:06",
        prescriptionImage:
            "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751627585773-thuoc-tay-4.jpg?alt=media&token=87fa66f2-7cd9-4d03-a663-9ffad8b143cf",
        note: "Child has slight cold symptoms, no fever. Needs throat lozenges and warm fluids.",
        status: "APPROVED",
        medicationItems: [
            {
                medicationId: 15,
                medicationName: "Betadine gargle",
                unitAndUsage: "Gargle for 30 seconds",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
        ],
    },
]

const inProgressPrescriptions = [
    {
        pupilId: "PP0006",
        pupilFirstName: "Em",
        pupilLastName: "Hoàng",
        senderName: "AnhQuốc",
        sendMedicationId: 1,
        diseaseName: "Common cold with cough",
        startDate: "05-07-2025",
        endDate: "09-07-2025",
        requestedDate: "04-07-2025 18:10:43",
        prescriptionImage:
            "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751627439623-thuoc-tay-2.jpg?alt=media&token=728206e9-054f-4d20-8fb8-1d4dcd1e0ab9",
        note: "Child has persistent dry cough due to allergy. Needs antihistamine and cough suppressant.",
        status: "APPROVED",
        medicationItems: [
            {
                medicationId: 15,
                medicationName: "Betadine gargle",
                unitAndUsage: "Gargle for 30 seconds",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
        ],
    },
    {
        pupilId: "PP0006",
        pupilFirstName: "Em",
        pupilLastName: "Hoàng",
        senderName: "AnhQuốc",
        sendMedicationId: 2,
        diseaseName: "Allergic cough",
        startDate: "04-07-2025",
        endDate: "15-07-2025",
        requestedDate: "04-07-2025 18:11:46",
        prescriptionImage:
            "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751627504653-thuoc-tay-3.jpeg?alt=media&token=bd7153ef-7b49-4582-be0d-0b8465ae1b42",
        note: "Child has persistent dry cough due to allergy. Needs antihistamine and cough suppressant.",
        status: "APPROVED",
        medicationItems: [
            {
                medicationId: 15,
                medicationName: "Betadine gargle",
                unitAndUsage: "Gargle for 30 seconds",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
        ],
    },
    {
        pupilId: "PP0007",
        pupilFirstName: "Lan",
        pupilLastName: "Võ",
        senderName: "AnhQuốc",
        sendMedicationId: 3,
        diseaseName: "Mild cold and throat irritation",
        startDate: "04-07-2025",
        endDate: "10-07-2025",
        requestedDate: "04-07-2025 18:13:06",
        prescriptionImage:
            "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751627585773-thuoc-tay-4.jpg?alt=media&token=87fa66f2-7cd9-4d03-a663-9ffad8b143cf",
        note: "Child has slight cold symptoms, no fever. Needs throat lozenges and warm fluids.",
        status: "APPROVED",
        medicationItems: [
            {
                medicationId: 15,
                medicationName: "Betadine gargle",
                unitAndUsage: "Gargle for 30 seconds",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
        ],
    },
]

const completedPrescriptions = [
    {
        pupilId: "PP0007",
        pupilFirstName: "Lan",
        pupilLastName: "Võ",
        senderName: "AnhQuốc",
        sendMedicationId: 7,
        diseaseName: "Common cold with dry throat",
        startDate: "04-07-2025",
        endDate: "05-07-2025",
        requestedDate: "04-07-2025 20:48:55",
        prescriptionImage:
            "https://firebasestorage.googleapis.com/v0/b/school-medical-health-system.firebasestorage.app/o/images%2F1751636931778-thuoc-tay-2.jpg?alt=media&token=a783bf40-30ef-4b0f-a86f-61e810a5762c",
        note: "Just mild cold, no fever. Took honey-based syrup for throat relief.",
        status: "COMPLETED",
        medicationItems: [
            {
                medicationId: 12,
                medicationName: "Honey syrup",
                unitAndUsage: "5ml to soothe dry throat and suppress cough",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
            {
                medicationId: 13,
                medicationName: "Honey syrup 2",
                unitAndUsage: "5ml to soothe dry throat and suppress cough",
                medicationSchedule: "Before lunch: 10h30-11h00",
            },
            {
                medicationId: 14,
                medicationName: "Honey syrup 3",
                unitAndUsage: "5ml to soothe dry throat and suppress cough",
                medicationSchedule: "After lunch: 11h30-12h00",
            },
        ],
    },
    {
        pupilId: "PP0006",
        pupilFirstName: "Em",
        pupilLastName: "Hoàng",
        senderName: "AnhQuốc",
        sendMedicationId: 8,
        diseaseName: "New disease",
        startDate: "18-07-2025",
        endDate: "22-07-2025",
        requestedDate: "05-07-2025 16:19:52",
        prescriptionImage: "https://anh.24h.com.vn/upload/4-2014/images/2014-10-24/1414124020-toa-thuoc.jpg",
        note: "asdasdasd",
        status: "COMPLETED",
        medicationItems: [
            {
                medicationId: 15,
                medicationName: "Betadine gargle",
                unitAndUsage: "Gargle for 30 seconds",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
        ],
    },
]

const PrescriptionTrackingTable = () => {
    const [value, setValue] = useState("1")
    const [selectedPrescription, setSelectedPrescription] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [imageZoomOpen, setImageZoomOpen] = useState(false)

    // Separate page states for each tab
    const [pageIndexes, setPageIndexes] = useState({
        "all": 1, // All prescriptions
        "inprogress": 1, // In progress
        "completed": 1  // Completed
    })

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleDetailClick = (prescription) => {
        setSelectedPrescription(prescription)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
        setSelectedPrescription(null)
    }

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split("-")
        return `${day}/${month}/${year}`
    }

    const formatDateTime = (dateTimeString) => {
        const [datePart, timePart] = dateTimeString.split(" ")
        const [day, month, year] = datePart.split("-")
        return `${day}/${month}/${year} ${timePart}`
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "APPROVED":
                return "success"
            case "COMPLETED":
                return "info"
            case "PENDING":
                return "warning"
            case "REJECTED":
                return "error"
            default:
                return "default"
        }
    }

    const PrescriptionTable = ({ prescriptions, option }) => {

        const rowsPerPage = 4;
        const paginationLength = prescriptions.length === 0 ? 1 : (Math.ceil(prescriptions.length / rowsPerPage));

        return (
            <>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                                        Start Date
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        End Date
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
                            {prescriptions.map((prescription, idx) => {

                                // filder number of rows:
                                const startIndex = (pageIndexes[option] - 1) * rowsPerPage;
                                const endIndex = startIndex + rowsPerPage;

                                if (idx < startIndex || idx >= endIndex) {
                                    return null; // Skip rendering this row
                                }

                                return (
                                    <TableRow key={prescription.sendMedicationId} sx={{ "&:hover": { bgcolor: "grey.50", transform: "scale(1.02)" }, 
                                                                                        cursor: "pointer",
                                                                                        transition: "all 0.4s ease-in-out"
                                                                                    }}>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">
                                                {prescription.pupilId}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Person fontSize="small" color="primary" />
                                                <Typography variant="body2">
                                                    {prescription.pupilLastName} {prescription.pupilFirstName}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="500">
                                                {prescription.diseaseName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{formatDate(prescription.startDate)}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{formatDate(prescription.endDate)}</Typography>
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
                                                onClick={() => handleDetailClick(prescription)}
                                                sx={{ minWidth: 100 }}
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
                <Grid container justifyContent={'center'} size={{ xs: 12 }} mt={3}>
                    <Pagination 
                        count={paginationLength} 
                        page={pageIndexes[option]}
                        variant="outlined" 
                        color="primary" 
                        onChange={(event, page) => { 
                            
                            // debug:
                            console.log("Page number:" , page);

                            setPageIndexes(prev => ({ 
                                ...prev, 
                                [option]: page 
                            }));
                        }}/>
                </Grid>
            </>
        )
    }
//<DatePicker label="Basic date picker" />
    return (
        <Box sx={{ width: "100%", typography: "body1" }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                            Prescription Tracking
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Monitor and manage prescription requests and treatments
                        </Typography>
                    </Grid>
                    <Grid item>
                        <PrescriptionDatePicker />
                    </Grid>
                </Grid> 
            </Box>

            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChange} aria-label="prescription tracking tabs">
                        <Tab
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <LocalPharmacy fontSize="small" />
                                    All ({allPrescriptions.length})
                                </Box>
                            }
                            value="1"
                        />
                        <Tab
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <CalendarToday fontSize="small" />
                                    In Progress ({inProgressPrescriptions.length})
                                </Box>
                            }
                            value="2"
                        />
                        <Tab
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Medication fontSize="small" />
                                    Completed ({completedPrescriptions.length})
                                </Box>
                            }
                            value="3"
                        />
                    </TabList>
                </Box>

                <TabPanel value="1" sx={{ px: 0 }}>
                    <PrescriptionTable prescriptions={(allPrescriptions != null ? allPrescriptions : [])} option="all" />
                </TabPanel>

                <TabPanel value="2" sx={{ px: 0 }}>
                    <PrescriptionTable prescriptions={(inProgressPrescriptions != null ? inProgressPrescriptions : [])} option="inprogress" />
                </TabPanel>

                <TabPanel value="3" sx={{ px: 0 }}>
                    <PrescriptionTable prescriptions={(completedPrescriptions != null ? completedPrescriptions : [])} option="completed" />
                </TabPanel>
            </TabContext>

            {/* Detail Modal */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LocalPharmacy color="primary" />
                            <Typography variant="h6" fontWeight="bold">
                                Prescription Details - #{selectedPrescription?.sendMedicationId}
                            </Typography>
                        </Box>
                        <IconButton onClick={handleCloseDialog} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ py: 3 }}>
                    {selectedPrescription && (
                        <Box>
                            {/* Basic Information */}
                            <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
                                    Basic Information
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item size={{xs: 6, md: 3}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Prescription ID
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            #{selectedPrescription.sendMedicationId}
                                        </Typography>
                                    </Grid>
                                    <Grid item size={{xs: 6, md: 3}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Pupil ID
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {selectedPrescription.pupilId}
                                        </Typography>
                                    </Grid>
                                    <Grid item size={{xs: 6, md: 3}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Pupil Name
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {selectedPrescription.pupilLastName} {selectedPrescription.pupilFirstName}
                                        </Typography>
                                    </Grid>
                                    <Grid item size={{xs: 6, md: 3}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Status
                                        </Typography>
                                        <Chip
                                            label={selectedPrescription.status}
                                            color={getStatusColor(selectedPrescription.status)}
                                            size="small"
                                            variant="filled"
                                        />
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
                                            {selectedPrescription.diseaseName}
                                        </Typography>
                                    </Grid>
                                    <Grid item size={{xs: 6, md: 4}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Treatment Start
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold" color="success.main">
                                            {formatDate(selectedPrescription.startDate)}
                                        </Typography>
                                    </Grid>
                                    <Grid item size={{xs: 6, md: 4}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Treatment End
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold" color="error.main">
                                            {formatDate(selectedPrescription.endDate)}
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
                                <Box sx={{ textAlign: "center" }} onClick={(e) => { setImageZoomOpen(true) }} style={{ cursor: "pointer" }}>
                                    <img
                                        src={selectedPrescription.prescriptionImage || "/placeholder.svg"}
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

                            {/* Zoom in image */}
                            <Dialog open={imageZoomOpen} onClose={() => setImageZoomOpen(false)}  maxWidth="md" fullWidth>
                                <DialogTitle>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <ImageIcon color="success" />
                                            <Typography variant="h6" fontWeight="bold" color="success.main">
                                                Prescription Image
                                            </Typography>
                                        </Box>
                                        <IconButton onClick={() => setImageZoomOpen(false)} size="small">
                                            <Close />
                                        </IconButton>
                                    </Box>
                                </DialogTitle>
                                <DialogContent sx={{ py: 3, textAlign: "center" }}>
                                    <img
                                        src={selectedPrescription.prescriptionImage || "/placeholder.svg"}
                                        alt="Prescription"
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            objectFit: "contain",
                                            borderRadius: "8px",
                                            border: "2px solid #e0e0e0",
                                        }}
                                    />
                                </DialogContent>
                                <DialogActions sx={{ p: 3 }}>
                                    <Button onClick={() => setImageZoomOpen(false)} variant="contained">
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            {/* Medication List */}
                            <Paper sx={{ p: 3, mb: 3, bgcolor: "info.50" }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "info.main" }}>
                                    Medication List ({selectedPrescription.medicationItems.length} items)
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
                                            {selectedPrescription.medicationItems.map((medication) => (
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

                            {/* Additional Information */}
                            <Paper sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                    Additional Information
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item size={{xs: 12, md: 6}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Sender Name
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {selectedPrescription.senderName}
                                        </Typography>
                                    </Grid>
                                    <Grid item size={{xs: 12, md: 6}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Requested Date
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {formatDateTime(selectedPrescription.requestedDate)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Notes */}
                            <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                    <Note color="action" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Notes
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ lineHeight: 1.6, fontStyle: "italic" }}>
                                    "{selectedPrescription.note}"
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default PrescriptionTrackingTable