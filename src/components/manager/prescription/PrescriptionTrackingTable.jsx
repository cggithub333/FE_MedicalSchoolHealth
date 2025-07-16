"use client"

import * as React from "react"
import { useState, useEffect } from "react"
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
import useDatePicker from "@hooks/store-hooks/useDatePicker"
import useStoredPrescription from "@hooks/store-hooks/useStoredPrescription"

import { useDispatch } from "react-redux"
import { setSelectedPrescription as setStoredPrescription } from "@store/slices/prescriptionSlice"

import useGetInProgressPrescriptions from "@hooks/manager/prescription/useGetInProgressPrescriptions"
import useGetAllPrescriptions from "@hooks/manager/prescription/useGetAllPrescriptions"
import useGetCompletedPrescriptions from "@hooks/manager/prescription/useCompletedPrescriptions"
import { formatISOToYYYYMMDD, convertDDMMYYYYToYYYYMMDD } from "@utils/date-utils"


const PrescriptionTrackingTable = () => {

    const dispatch = useDispatch()

    const { allPrescriptions, loading: allLoading, error: allError, refetch: allRefetch } = useGetAllPrescriptions()
    const { inProgressPrescriptions, loading: inProgressLoading, error: inProgressError, refetch: inProgressRefetch } = useGetInProgressPrescriptions()
    const { completedPrescriptions, loading: completedLoading, error: completedError, refetch: completedRefetch } = useGetCompletedPrescriptions()

    // debug:
    // console.log("All Prescriptions:", JSON.stringify(allPrescriptions, null, 2));

    const [value, setValue] = useState("1")
    const [selectedPrescription, setSelectedPrescription] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [imageZoomOpen, setImageZoomOpen] = useState(false)

    const datePickerData = useDatePicker()
    const storedPrescription = useStoredPrescription()

    // filter:
    const [filterAllPrescriptionsByDate, setFilterAllPrescriptionsByDate] = useState([])
    const [filterInProgressPrescriptionsByDate, setFilterInProgressPrescriptionsByDate] = useState([])
    const [filterCompletedPrescriptionsByDate, setFilterCompletedPrescriptionsByDate] = useState([])

    // refetched new value for storedPrescription:
    useEffect(() => {
        // console.log("-------useEffect code -------");
        if (storedPrescription?.selectedPrescription) {
            // debug:
            // console.log("Redux updated state: ", storedPrescription.selectedPrescription);
        } else{
            // debug:
            // console.log("No selected prescription in Redux state.");
        }
        // console.log("-----End useEffect code -----");
    }, [storedPrescription]); // catch the changes of prescription inside the  storedPrescription for debugging

    // refetch prescriptions when datePickerData changes
    useEffect(() => {
        // console.log("-------useEffect code -------");
        if (datePickerData) {
            // debug:
            // console.log("DatePickerData available, filtering prescriptions by date...");

            setFilterAllPrescriptionsByDate(filterPrescriptionsByDate(allPrescriptions))
            setFilterInProgressPrescriptionsByDate(filterPrescriptionsByDate(inProgressPrescriptions))
            setFilterCompletedPrescriptionsByDate(filterPrescriptionsByDate(completedPrescriptions))
        } else{
            // debug:
            // console.log("No datePickerData available, skipping filter.");
        }
        // console.log("------End useEffect code -----");
    }, [datePickerData, allPrescriptions, inProgressPrescriptions, completedPrescriptions])

    // Separate page states for each tab
    const [pageIndexes, setPageIndexes] = useState({
        "all": 1, // All prescriptions
        "inprogress": 1, // In progress
        "completed": 1  // Completed
    })

    const filterPrescriptionsByDate = (prescriptions) => {
        if (prescriptions == null || prescriptions.length === 0) {
            return []
        }

        const datePickerValue = datePickerData?.value; // ISOString;
        const convertedDatePickerValue = formatISOToYYYYMMDD(datePickerValue);

        // else:
        return prescriptions.filter(item => {

            if (item.medicationItems == null || item.medicationItems.length === 0) {
                return false;   // Skip items without medication items
            }

            if (item.status === "PENDING") {
                return false; // Skip pending prescriptions
            }

            const startDate = item.startDate ? convertDDMMYYYYToYYYYMMDD(item.startDate) : null;
            const endDate = item.endDate ? convertDDMMYYYYToYYYYMMDD(item.endDate) : null;

            if (startDate === null || endDate === null) {
                // If either startDate or endDate is null, we cannot filter by date
                return false;
            }

            // debug:
            // console.log("convertedDatePickerValue:", convertedDatePickerValue);
            // console.log("Start Date:", startDate);
            // console.log("End Date:", endDate);

            return convertedDatePickerValue && (
                        convertedDatePickerValue.localeCompare(startDate) >= 0 
                        && 
                        convertedDatePickerValue.localeCompare(endDate) <= 0
            );
        })
    }

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

    const handleRowClick = (prescription) => {

        if (prescription) {
            dispatch(setStoredPrescription(prescription))
        }

        // debug:
        // console.log("----Handel Row Click----")

        // console pupil id, name:
        // console.log("Pupil ID:", prescription.pupilId)
        // console.log("Pupil Name:", prescription.pupilLastName, prescription.pupilFirstName)

        // debug: test filter function
        const  filteredPrescriptions = filterPrescriptionsByDate(allPrescriptions);
        // console.log("Filtered from ALl Prescriptions by Date:", filteredPrescriptions);
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
                                    <TableRow   key={prescription.sendMedicationId} 
                                                sx={{ "&:hover": { bgcolor: "grey.50", transform: "scale(1.02)" }, 
                                                    cursor: "pointer",
                                                    transition: "all 0.4s ease-in-out"
                                                }}
                                                onClick={() => handleRowClick(prescription)}                                                
                                                >
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
                            {prescriptions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No prescriptions found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
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
                            // console.log("Page number:" , page);

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
                                    All ({filterAllPrescriptionsByDate?.length})
                                </Box>
                            }
                            value="1"
                        />
                        <Tab
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <CalendarToday fontSize="small" />
                                    In Progress ({filterInProgressPrescriptionsByDate?.length})
                                </Box>
                            }
                            value="2"
                        />
                        <Tab
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Medication fontSize="small" />
                                    Completed ({filterCompletedPrescriptionsByDate?.length})
                                </Box>
                            }
                            value="3"
                        />
                    </TabList>
                </Box>

                <TabPanel value="1" sx={{ px: 0 }}>
                    <PrescriptionTable prescriptions={filterAllPrescriptionsByDate} option="all" />
                </TabPanel>

                <TabPanel value="2" sx={{ px: 0 }}>
                    <PrescriptionTable prescriptions={filterInProgressPrescriptionsByDate} option="inprogress" />
                </TabPanel>

                <TabPanel value="3" sx={{ px: 0 }}>
                    <PrescriptionTable prescriptions={filterCompletedPrescriptionsByDate} option="completed" />
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