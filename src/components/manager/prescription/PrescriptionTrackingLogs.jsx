"use client"
import { useState, useEffect  } from "react"
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Avatar,
    Paper,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Pagination
} from "@mui/material"
import {
    LocalHospital,
    Person,
    Person3,
    Schedule,
    Medication,
    CheckCircle,
    AccessTime,
    Assignment,
    Close,
    Visibility,
} from "@mui/icons-material"

import { FaChild as ChildIcon } from "react-icons/fa";
import { FaCalendarDays as CalendarIcon } from "react-icons/fa6";

import useStoredPrescription from '@hooks/store-hooks/useStoredPrescription';
import useDatePicker from '@hooks/store-hooks/useDatePicker';

import useAllLogsByMedicationIdAndDate from "@hooks/manager/prescription/useAllLogsByMedicationIdAndDate"

import { parseMedicalInfo } from "@utils/parseLogsObject"
import { getDDMMYYYYFromISOString } from "@utils/date-utils";

const rowsPerPage = 4 // Number of logs to display per page
const PrescriptionTrackingLogs = () => {

    // store states:
    const datePicker = useDatePicker();
    const storedPrescription = useStoredPrescription();

    // local states:
    const [pickedDate, setPickedDate] = useState(datePicker?.value || new Date());
    const [selectedPrescription, setSelectedPrescription] = useState(storedPrescription?.selectedPrescription || null);


    const { prescriptionLogs, loading: loadingLogs, error: errorLogs, fetchLogs } = useAllLogsByMedicationIdAndDate(selectedPrescription, pickedDate)

    // refetch if datePicker or storedPrescription changes
    useEffect(() => {

        // debug:
        // console.log("Picked Date:", pickedDate);
        // console.log("Selected Prescription:", selectedPrescription);

        // If datePicker or storedPrescription changes, update local states and fetch logs
        if (datePicker?.value && datePicker.value !== pickedDate) {
            setPickedDate(datePicker.value);
        }
        // If storedPrescription changes, update selectedPrescription
        if (storedPrescription?.selectedPrescription && storedPrescription.selectedPrescription !== selectedPrescription) {
            setSelectedPrescription(storedPrescription.selectedPrescription);
        }
        // Fetch logs with the current medicationId and date
        // Only call fetchLogs if the dependencies actually changed
        if (storedPrescription?.selectedPrescription?.sendMedicationId && (datePicker?.value || pickedDate)) {
            fetchLogs(storedPrescription.selectedPrescription.sendMedicationId, datePicker?.value || pickedDate
        );
        }
    }, [datePicker, storedPrescription, pickedDate, selectedPrescription, fetchLogs]);

    const [selectedLog, setSelectedLog] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [pageIndex, setPageIndex] = useState(1)

    const handleCardClick = (log) => {
        setSelectedLog(log)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
        setSelectedLog(null)
    }

    const formatDateTime = (dateTimeString) => {
        const [datePart, timePart] = dateTimeString.split(" ")
        const [day, month, year] = datePart.split("-")
        return new Date(`${year}-${month}-${day}T${timePart}`).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case "GIVEN":
                return "success"
            case "MISSED":
                return "error"
            case "PENDING":
                return "warning"
            default:
                return "default"
        }
    }

    const getGivenStatusColor = (given) => {
        return given?.toLowerCase() === "yes" ? "success" : "error"
    }

    return (
        <Paper
            sx={{
                width: "100%",
                maxWidth: "400px", // Constrains to about 30% of typical dashboard
                height: "fit-content",
                p: 2,
                bgcolor: "background.paper",
            }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                    <Assignment fontSize="small" />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                    Prescription Logs
                </Typography>
                <Chip label={(prescriptionLogs || []).length} size="small" color="primary" sx={{ ml: "auto" }} />
            </Box>

            {/* Pupil information, date information */}
            <Card
                sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                        transform: "translateX(4px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                    marginBottom: 2,
                }}
            >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    {/* Nurse Name */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <ChildIcon fontSize="small" color="action" />
                        <Typography variant="body2" fontWeight="500">
                            Pupil: {selectedPrescription ? `${selectedPrescription.pupilLastName} ${selectedPrescription.pupilFirstName}` : "No Information"}
                        </Typography>
                    </Box>
                    {/* Date */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2" fontWeight="500">
                            Date: {(pickedDate) ? `${getDDMMYYYYFromISOString(pickedDate)}` : "No Information"}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
            {/* Compact Log Cards */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {(prescriptionLogs || []).map((log, idx) => {

                    const startIdx = (pageIndex - 1) * rowsPerPage;
                    const endIdx = startIdx + rowsPerPage;
                    if (idx < startIdx || idx >= endIdx) return null; // Skip logs not in current page

                    const parsedInfo = parseMedicalInfo(log.note)

                    return (
                        <Card
                            key={log.logId}
                            sx={{
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    transform: "translateX(4px)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                },
                            }}
                            onClick={() => handleCardClick(log)}
                        >
                            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                {/* Header Row */}
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" fontWeight="bold" color="primary.main">
                                        Log #{log.logId}
                                    </Typography>
                                    <Chip label={log.status} color={getStatusColor(log.status)} size="small" />
                                </Box>

                                {/* Nurse Name */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <Person fontSize="small" color="action" />
                                    <Typography variant="body2" fontWeight="500">
                                        School nurse: {parsedInfo.nurseName || "No Information"}
                                    </Typography>
                                </Box>

                                {/* Session Info */}
                                {parsedInfo.sessionInfo && (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <Schedule fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {parsedInfo.sessionInfo}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Bottom Row */}
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <CheckCircle fontSize="small" color={getGivenStatusColor(parsedInfo.diseaseInfor.given)} />
                                        <Typography variant="body2" color="text.secondary">
                                            {parsedInfo.diseaseInfor.given === "Yes" ? "Given" : "Not Given"}
                                        </Typography>
                                    </Box>
                                    <Visibility fontSize="small" color="action" />
                                </Box>
                            </CardContent>
                        </Card>
                    )
                })}
            </Box>
            <Grid container justifyContent="center" sx={{ mt: 3 }}>
                <Pagination count = {
                                    (prescriptionLogs || []).length > 0 ? 
                                        Math.ceil((prescriptionLogs || []).length / rowsPerPage)  : 1
                                }    
                            variant="outlined" 
                            color="primary" 
                            onChange={(_, page) => setPageIndex(page)}/>
            </Grid>

            {/* Detail Modal */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Assignment color="primary" />
                            <Typography variant="h6" fontWeight="bold">
                                Prescription Log Details
                            </Typography>
                        </Box>
                        <IconButton onClick={handleCloseDialog} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ py: 2 }}>
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
                                                    {parsedInfo.sessionInfo}
                                                </Typography>
                                            )}
                                        </Paper>

                                        {/* Administration Status */}
                                        <Paper sx={{ p: 2, mb: 2, bgcolor: "error.50" }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                <AccessTime color="error" fontSize="small" />
                                                <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                                                    Administration Details
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={1}>
                                                <Grid item size={{xs: 6}}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Given Status
                                                    </Typography>
                                                    <Chip
                                                        label={parsedInfo.diseaseInfor.given === "Yes" ? "Given" : "Not Given"}
                                                        color={getGivenStatusColor(parsedInfo.diseaseInfor.given)}
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
                    <Button onClick={handleCloseDialog} variant="contained" size="small">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}


export default PrescriptionTrackingLogs