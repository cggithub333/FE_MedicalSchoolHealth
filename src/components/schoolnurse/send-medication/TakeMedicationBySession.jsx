"use client"

import { useState, useEffect } from "react"
import {
    Grid,
    Tabs,
    Tab,
    Box,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Container,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Avatar,
    IconButton,
    Checkbox,
    FormControlLabel,
    Skeleton
} from "@mui/material"
import { TabPanel, TabContext } from "@mui/lab"
import { School, Close, Medication, AccessTime, Assignment, CheckCircle, Groups } from "@mui/icons-material"

import useCreateTakeMedicationLogs from "@hooks/schoolnurse/send-medication/useCreateTakeMedicationLogs"
import useTakeMedicationsByEachPupilEachSession from "@hooks/schoolnurse/send-medication/useTakeMedicationsByEachPupilEachSession"
import useAllPupilsBySessionAndGrade from "@hooks/schoolnurse/send-medication/useAllPupilsBySessionAndGrade"
import useTodayTakeMedicationSessions from "@hooks/schoolnurse/send-medication/useTodayTakeMedicationSessions"
import { showErrorToast, showSuccessToast, showWarningToast } from "@utils/toast-utils"

// Mock DigitalClock component
const DigitalClock = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <Box
            sx={{
                bgcolor: "primary.main",
                color: "white",
                px: 3,
                py: 1,
                borderRadius: 2,
                fontFamily: "monospace",
                fontSize: "1.2rem",
                fontWeight: "bold",
            }}
        >
            {time.toLocaleTimeString()}
        </Box>
    )
}

const TakeMedicationBySession = () => {

    const { createTakeMedicationLogs, loading: createLogsLoading, error: createLogsError } = useCreateTakeMedicationLogs()
    const { sessionsInfor, loading: sessionsLoading, error: errorLoading } = useTodayTakeMedicationSessions()
    const { pupilsInfor, loading: pupilsLoading, error: pupilsError, refetch: pupilsRefetch } = useAllPupilsBySessionAndGrade();
    const { medicationDetailsByPupil, loading: medicationDetailsLoading, error: medicationDetailsError, refetch: medicationDetailsRefetch } = useTakeMedicationsByEachPupilEachSession();

    // state for manage insert new medication logs:
    const [ isCreatedLogs, setIsCreatedLogs ] = useState(false)

    const [value, setValue] = useState("1")
    const [pupilListOpen, setPupilListOpen] = useState(false)
    const [prescriptionDetailOpen, setPrescriptionDetailOpen] = useState(false)
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [selectedSession, setSelectedSession] = useState(null)
    const [selectedPupil, setSelectedPupil] = useState(null)
    const [medicationChecks, setMedicationChecks] = useState({})
    const [logMessages, setLogMessages] = useState({ "schoolNurseName": "+ School Nurse's name: " + localStorage.getItem("userFullName") }) 
    // manage log message of each pupil's detail, will be removed if submit for current pupil complete to continue with the next pupil;
    // fill school nurse's name to know which school nurse is taking medication for which pupil

    // handle re-fetch pupils when selectedGrade or selectedSession changes:
    useEffect(() => {
        if (selectedGrade === null || selectedSession === null) {
            return // No grade or session selected yet
        }
        /* Note: selectedSession is 0, 1, 2 properly sessions 1, 2, 3 */
        /*       selectedGrade is the gradeId 1, 2, 3, 4, 5 */
        pupilsRefetch(selectedSession + 1, selectedGrade)

    }, [selectedGrade, selectedSession]);


    // handle re-fetch medication details when selectedPupil changes:
    useEffect(() => {
        if (!selectedPupil) {
            return // No pupil selected yet
        }
        // Fetch medication details for the selected pupil
        medicationDetailsRefetch(selectedSession + 1, selectedPupil.pupilId);
    }, [selectedPupil, selectedSession, selectedGrade, medicationDetailsRefetch]);


    // Simplified useEffect - only for side effects after successful creation
    useEffect(() => {
        if (isCreatedLogs && !createLogsLoading && !createLogsError) {
            showSuccessToast("Medication logs updated successfully!");
            setIsCreatedLogs(false);

            // Refresh medication details to show updated status
            if (selectedPupil && selectedSession !== null) {
                medicationDetailsRefetch(selectedSession + 1, selectedPupil.pupilId);
            }
        }

        if (isCreatedLogs && createLogsError) {
            showErrorToast("Failed to update medication logs. Please try again.");
            setIsCreatedLogs(false);
        }
    }, [isCreatedLogs, createLogsLoading, createLogsError, selectedPupil, selectedSession, medicationDetailsRefetch])


    // render skeletions of waiting fetch data:
    if (sessionsLoading) {
        return renderLoadingSkeleton({ length: 3 }) // Show 3 skeletons for 3 sessions
    }

    // Utils functions:
    const getSessionTime = (sessionIndex) => {
        const times = ["09:30 - 10:00", "10:30 - 11:00", "11:30 - 12:00"]
        return times[sessionIndex] || ""
    }

    const getSessionName = (sessionIndex) => {
        return sessionsInfor?.[sessionIndex]?.session || ""
    }

    const getSessionDisplayText = (sessionIndex) => {
        const sessionName = getSessionName(sessionIndex)
        const sessionTime = getSessionTime(sessionIndex)
        
        if (sessionName && sessionTime) {
            return `${sessionName} - ${sessionTime}`
        } else if (sessionTime) {
            return sessionTime
        } else if (sessionName) {
            return sessionName
        } else {
            return `Session ${sessionIndex + 1}`
        }
    }
    
    // Handle events functions:
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleGradeCardClick = (grade, sessionIndex) => {
        setSelectedGrade(grade)
        setSelectedSession(sessionIndex) 
        setPupilListOpen(true)
    }

    const handlePupilDetailClick = (pupil) => {
        setSelectedPupil(pupil)
        
        // Get all approved medication requests for this pupil
        const pupilMedications = (medicationDetailsByPupil || []).filter(
            request => (request.pupilId === pupil.pupilId && request.status === "APPROVED" && request.medicationItems != null && request.medicationItems.length > 0) // Ensure medicationItems is not null or empty
        )
        
        // Reset medication checks for all medications across all diseases
        const initialChecks = {}
        pupilMedications.forEach((request) => {
            if (request.medicationItems) {
                request.medicationItems.forEach((med) => {
                    initialChecks[med.medicationId] = false
                })
            }
        })
        setMedicationChecks(initialChecks)
        
        // Reset log messages but keep school nurse name
        setLogMessages({ "schoolNurseName": "+ School Nurse's name: " + localStorage.getItem("userFullName") })
        
        setPrescriptionDetailOpen(true)
    }

    const handleMedicationCheck = (medicationId, checked, logMessage) => {

        // add log message for each pupil taking medication details;
        if (checked) {
            // each log message contains medication name, unit and usage, schedule, and mark as given status
            setLogMessages((prev) => ({
                ...prev,
                [medicationId]: logMessage.trim(), // Store log message for each medication
            }))
        }
        else {
            // if not checked, log message will be empty
            setLogMessages((prev) => ({
                ...prev,
                [medicationId]: "", // Clear log message for unchecked medication
            }))
        }
        setMedicationChecks((prev) => ({
            ...prev,
            [medicationId]: checked,
        }))
    }

    // Add new function for handling Given button click
    const handleGivenButtonClick = async (request) => {
        
        const medicatioLogData = {
            sendMedicationId: request.sendMedicationId,
            status: "GIVEN",
            note: getDiseaseLogMessages(request),
        }

        // insert logs into db;
        await createTakeMedicationLogs(medicatioLogData);
        setIsCreatedLogs(true) // This will trigger the useEffect
    }

    // Add function to check if any medication is checked for a specific disease
    const hasCheckedMedications = (request) => {
        // If already given, don't allow clicking again
        if (isDiseaseAlreadyGiven(request)) return false
        
        if (!request.medicationItems) return false
        return request.medicationItems.some(medication => 
            medicationChecks[medication.medicationId] === true
        )
    }

    // Check if disease already has GIVEN status
    const isDiseaseAlreadyGiven = (request) => {
        return request.medicationLogs && 
               request.medicationLogs.length > 0 && 
               request.medicationLogs.some(log => log.status === "GIVEN")
    }

    // Get log messages for a specific disease
    const getDiseaseLogMessages = (request) => {
        // If disease already has logs with GIVEN status, show existing notes
        if (isDiseaseAlreadyGiven(request)) {
            const givenLog = request.medicationLogs.find(log => log.status === "GIVEN")
            return givenLog ? givenLog.note : "Medication already given"
        }

        // Otherwise, generate new log messages as before
        const diseaseMessages = []
        
        // Add school nurse name
        if (logMessages["schoolNurseName"]) {
            diseaseMessages.push(logMessages["schoolNurseName"])
        }
        
        // Add medication messages for this specific disease
        if (request.medicationItems) {
            request.medicationItems.forEach(medication => {
                const medicationLog = logMessages[medication.medicationId]
                if (medicationLog && medicationLog.trim() !== "") {
                    diseaseMessages.push(medicationLog)
                }
            })
        }
        
        return diseaseMessages.join("\n\n").trim() || "No medication given yet for this disease."
    }

    // Modified close dialog function
    const handleCloseDialog = () => {
        showWarningToast("Please ensure all medication administration is complete before closing!")
        
        if (window.confirm("Are you sure you want to close? Any unsaved changes will be lost.")) {
            setPrescriptionDetailOpen(false)
        }
    }

    const getGradeColor = (grade) => {
        const colors = ["primary", "secondary", "success", "warning", "info"]
        return colors[(grade - 1) % colors.length]
    }

    // Get approved medication requests for selected pupil
    const getPupilMedicationRequests = () => {
        if (!selectedPupil || !medicationDetailsByPupil || !Array.isArray(medicationDetailsByPupil)) return []
        return medicationDetailsByPupil.filter(
            request => (request.pupilId === selectedPupil.pupilId && request.status === "APPROVED" && request.medicationItems != null && request.medicationItems.length > 0) // Ensure medicationItems is not null or empty
        )
    }

    const getGenderColor = (gender) => {
        return gender === "M" ? "primary" : "secondary"
    }

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split("-")
        return `${day}/${month}/${year}`
    }

    // Filter pupilsInfor by grade
    const getPupilsByGrade = (grade) => {
        if (!pupilsInfor || !Array.isArray(pupilsInfor)) return []
        return pupilsInfor.filter((pupil) => pupil.gradeId === grade)
    }

    return (
        <Grid
            container
            sx={{
                width: "100%",
                height: "100%",
                padding: "15px",
                backgroundColor: "#fff",
                boxShadow: 1,
                borderRadius: 2,
            }}
        >
            {/* Header with Digital Clock */}
            <Grid item size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                        <Medication />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                        Medication Sessions
                    </Typography>
                </Box>
                <DigitalClock />
            </Grid>

            {/* Tabs Section */}
            <Grid item size={{ xs: 12 }} sx={{ marginTop: "0px" }}>
                <Box sx={{ width: "100%", typography: "body1" }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs value={value} onChange={handleChange} aria-label="medication sessions">
                                <Tab
                                    label={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <AccessTime fontSize="small" />
                                            Session 1
                                        </Box>
                                    }
                                    value="1"
                                />
                                <Tab
                                    label={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <AccessTime fontSize="small" />
                                            Session 2
                                        </Box>
                                    }
                                    value="2"
                                />
                                <Tab
                                    label={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <AccessTime fontSize="small" />
                                            Session 3
                                        </Box>
                                    }
                                    value="3"
                                />
                            </Tabs>
                        </Box>

                        {/* Session 1 */}
                        <TabPanel value="1">
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                    {getSessionDisplayText(0)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Pupils scheduled for medication during this session
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {sessionsInfor?.[0]?.quantityPupilByGrade?.map((gradeData) => (
                                    <Grid item size={{ xs: 6 }} key={gradeData.grade}>
                                        <Card
                                            sx={{
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    transform: "translateY(-4px)",
                                                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                                                },
                                            }}
                                            onClick={() => handleGradeCardClick(gradeData.grade, 0)}
                                        >
                                            <CardContent sx={{ textAlign: "center", p: 3 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: `${getGradeColor(gradeData.grade)}.main`,
                                                        width: 56,
                                                        height: 56,
                                                        mx: "auto",
                                                        mb: 2,
                                                    }}
                                                >
                                                    <School fontSize="large" />
                                                </Avatar>
                                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                                                    Grade {gradeData.grade}
                                                </Typography>
                                                <Chip
                                                    label={`${gradeData.quantity} Pupil${gradeData.quantity > 1 ? "s" : ""}`}
                                                    color={getGradeColor(gradeData.grade)}
                                                    variant="filled"
                                                    sx={{ fontWeight: "bold" }}
                                                />
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    Click to view details
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </TabPanel>

                        {/* Session 2 */}
                        <TabPanel value="2">
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                    {getSessionDisplayText(1)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Pupils scheduled for medication during this session
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {sessionsInfor?.[1]?.quantityPupilByGrade?.map((gradeData) => (
                                    <Grid item size={{ xs: 6 }} key={gradeData.grade}>
                                        <Card
                                            sx={{
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    transform: "translateY(-4px)",
                                                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                                                },
                                            }}
                                            onClick={() => handleGradeCardClick(gradeData.grade, 1)}
                                        >
                                            <CardContent sx={{ textAlign: "center", p: 3 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: `${getGradeColor(gradeData.grade)}.main`,
                                                        width: 56,
                                                        height: 56,
                                                        mx: "auto",
                                                        mb: 2,
                                                    }}
                                                >
                                                    <School fontSize="large" />
                                                </Avatar>
                                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                                                    Grade {gradeData.grade}
                                                </Typography>
                                                <Chip
                                                    label={`${gradeData.quantity} Pupil${gradeData.quantity > 1 ? "s" : ""}`}
                                                    color={getGradeColor(gradeData.grade)}
                                                    variant="filled"
                                                    sx={{ fontWeight: "bold" }}
                                                />
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    Click to view details
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </TabPanel>

                        {/* Session 3 */}
                        <TabPanel value="3">
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                    {getSessionDisplayText(2)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Pupils scheduled for medication during this session
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {sessionsInfor?.[2]?.quantityPupilByGrade?.map((gradeData) => (
                                    <Grid item size={{ xs: 6 }} key={gradeData.grade}>
                                        <Card
                                            sx={{
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    transform: "translateY(-4px)",
                                                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                                                },
                                            }}
                                            onClick={() => handleGradeCardClick(gradeData.grade, 2)}
                                        >
                                            <CardContent sx={{ textAlign: "center", p: 3 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: `${getGradeColor(gradeData.grade)}.main`,
                                                        width: 56,
                                                        height: 56,
                                                        mx: "auto",
                                                        mb: 2,
                                                    }}
                                                >
                                                    <School fontSize="large" />
                                                </Avatar>
                                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                                                    Grade {gradeData.grade}
                                                </Typography>
                                                <Chip
                                                    label={`${gradeData.quantity} Pupil${gradeData.quantity > 1 ? "s" : ""}`}
                                                    color={getGradeColor(gradeData.grade)}
                                                    variant="filled"
                                                    sx={{ fontWeight: "bold" }}
                                                />
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    Click to view details
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Grid>

            {/* Pupil List Modal */}
            <Dialog open={pupilListOpen} onClose={() => setPupilListOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Groups color="primary" />
                            <Typography variant="h6" fontWeight="bold">
                                Grade {selectedGrade} Pupils - {getSessionDisplayText(selectedSession)}
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setPupilListOpen(false)} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Pupil ID
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Gender
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Class
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Birth Date
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Action
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    pupilsLoading ? (
                                        // show skeletons while loading pupils
                                        <>{renderLoadingSkeleton({ length: 3 })}</>
                                    ) : (
                                        getPupilsByGrade(selectedGrade)?.map((pupil) => (
                                            <TableRow key={pupil.pupilId}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {pupil.pupilId}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {pupil.lastName} {pupil.firstName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={pupil.gender === "M" ? "Male" : "Female"}
                                                        color={getGenderColor(pupil.gender)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{pupil.gradeName}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{formatDate(pupil.birthDate)}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<Assignment />}
                                                        onClick={() => handlePupilDetailClick(pupil)}
                                                    >
                                                        Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPupilListOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Prescription Detail Modal */}
            <Dialog open={prescriptionDetailOpen} onClose={() => setPrescriptionDetailOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Medication color="primary" />
                            <Typography variant="h6" fontWeight="bold">
                                Medication Details - {selectedPupil?.lastName} {selectedPupil?.firstName}
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setPrescriptionDetailOpen(false)} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 3 }}>
                        <Paper sx={{ p: 2, bgcolor: "primary.50" }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
                                Pupil Information
                            </Typography>
                            <Typography variant="body2">
                                <strong>ID:</strong> {selectedPupil?.pupilId} | <strong>Class:</strong> {selectedPupil?.gradeName}
                            </Typography>
                        </Paper>
                    </Box>

                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Take Medication by Disease
                    </Typography>

                    {/* Show loading state for medication details */}
                    {medicationDetailsLoading ? (
                        <Box sx={{ mb: 4 }}>
                            {renderLoadingSkeleton({ length: 2 })}
                        </Box>
                    ) : (
                        <>
                            {/* Render each disease as a separate section */}
                            {getPupilMedicationRequests().map((request, diseaseIndex) => (
                        <Box key={request.sendMedicationId} sx={{ mb: 4 }}>
                            {/* Disease Header */}
                            <Paper sx={{ p: 2, mb: 2, bgcolor: isDiseaseAlreadyGiven(request) ? "success.50" : "warning.50" }}>
                                <Typography variant="subtitle1" fontWeight="bold" color={isDiseaseAlreadyGiven(request) ? "success.main" : "warning.main"} sx={{ mb: 1 }}>
                                    Disease #{diseaseIndex + 1}: {request.diseaseName}
                                    {isDiseaseAlreadyGiven(request) && (
                                        <Chip 
                                            label="GIVEN" 
                                            color="success" 
                                            size="small" 
                                            sx={{ ml: 2, fontWeight: "bold" }}
                                        />
                                    )}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Treatment Period:</strong> {request.startDate} to {request.endDate}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Note:</strong> {request.note}
                                </Typography>
                                {isDiseaseAlreadyGiven(request) && (
                                    <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: "bold" }}>
                                        <strong>Given Time:</strong> {request.medicationLogs.find(log => log.status === "GIVEN")?.givenTime}
                                    </Typography>
                                )}
                            </Paper>

                            {/* Medications Table for this disease */}
                            {request.medicationItems && request.medicationItems.length > 0 ? (
                                <TableContainer component={Paper} elevation={0} sx={{ mb: 2 }}>
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
                                                        Unit & Usage
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        Schedule
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        Mark As Given
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {request.medicationItems.map((medication) => {
                                                // each log message contains medication name, unit and usage, schedule, and mark as given status
                                                const logMessage = `+ Disease: ${request.diseaseName}; Medication: ${medication.medicationName}; Unit & Usage: ${medication.unitAndUsage}; Schedule: ${medication.medicationSchedule}; Given: Yes; Given Time: ${new Date().toLocaleTimeString()}`;

                                                return (
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
                                                            <Typography variant="body2">{medication.medicationSchedule}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={isDiseaseAlreadyGiven(request) ? true : (medicationChecks[medication.medicationId] || false)}
                                                                        onChange={(e) => !isDiseaseAlreadyGiven(request) && handleMedicationCheck(medication.medicationId, e.target.checked, logMessage)}
                                                                        color="success"
                                                                        disabled={isDiseaseAlreadyGiven(request)}
                                                                    />
                                                                }
                                                                label={isDiseaseAlreadyGiven(request) ? "Already Given" : "Given"}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "grey.50" }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No medications specified for this disease
                                    </Typography>
                                </Paper>
                            )}

                            {/* Log Messages Section for this disease */}
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Note for {request.diseaseName}: 
                                    {isDiseaseAlreadyGiven(request) 
                                        ? " This medication has been given. Below is the record."
                                        : " This note will be sent to pupil's parents through notification."
                                    }
                                </Typography>
                                <textarea
                                    value={getDiseaseLogMessages(request)}
                                    readOnly
                                    style={{
                                        width: '100%',
                                        height: '120px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        padding: '12px',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        resize: 'none',
                                        backgroundColor: isDiseaseAlreadyGiven(request) ? '#e8f5e8' : '#f9f9f9',
                                        marginBottom: '12px'
                                    }}
                                />
                                {/* Given Button for each disease - positioned under the notes */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    {isDiseaseAlreadyGiven(request) ? (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="medium"
                                            startIcon={<CheckCircle />}
                                            disabled={true}
                                            sx={{ minWidth: 120 }}
                                        >
                                            Already Given
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="medium"
                                            startIcon={<CheckCircle />}
                                            disabled={!hasCheckedMedications(request)}
                                            onClick={() => handleGivenButtonClick(request)}
                                            sx={{ minWidth: 120 }}
                                        >
                                            Given
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    ))}

                    {/* Show message if no approved requests */}
                    {!medicationDetailsLoading && getPupilMedicationRequests().length === 0 && (
                        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "grey.50" }}>
                            <Typography variant="body1" color="text.secondary">
                                No approved medication requests found for this pupil
                            </Typography>
                        </Paper>
                    )}
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} variant="contained" color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

const renderLoadingSkeleton = ({ length: length  }) => (
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

export default TakeMedicationBySession
