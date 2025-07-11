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

import { getDateFromDDMMYYYY } from "@utils/date-utils"

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

const currentSessionInfor = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    return {
        "session1": (currentHour === 9 && currentMinute >= 30) || (currentHour === 10 && currentMinute < 15),
        "session2": (currentHour === 10 && currentMinute >= 30) || (currentHour === 11 && currentMinute < 15),
        "session3": (currentHour === 11 && currentMinute >= 30) || (currentHour === 12 && currentMinute < 15)
    }
}

// for testing sesion 1:
const currentSessionInfor1 = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    return {
        "session1": true,
        "session2": (currentHour === 10 && currentMinute >= 30) || (currentHour === 11 && currentMinute < 15),
        "session3": (currentHour === 11 && currentMinute >= 30) || (currentHour === 12 && currentMinute < 15)
    }
}

// for testing sesion 2:
const currentSessionInfor2 = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    return {
        "session1": (currentHour === 9 && currentMinute >= 30) || (currentHour === 10 && currentMinute < 15),
        "session2": true,
        "session3": (currentHour === 11 && currentMinute >= 30) || (currentHour === 12 && currentMinute < 15)
    }
}

//for testing sesion 3:
const currentSessionInfor3 = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    return {
        "session1": (currentHour === 9 && currentMinute >= 30) || (currentHour === 10 && currentMinute < 15),
        "session2": (currentHour === 10 && currentMinute >= 30) || (currentHour === 11 && currentMinute < 15),
        "session3": true
    }
}


const TakeMedicationBySession = () => {

    const { createTakeMedicationLogs, loading: createLogsLoading, error: createLogsError } = useCreateTakeMedicationLogs()
    const { sessionsInfor, loading: sessionsLoading, error: errorLoading } = useTodayTakeMedicationSessions()
    const { pupilsInfor, loading: pupilsLoading, error: pupilsError, refetch: pupilsRefetch } = useAllPupilsBySessionAndGrade();
    const { medicationDetailsByPupil, loading: medicationDetailsLoading, error: medicationDetailsError, refetch: medicationDetailsRefetch } = useTakeMedicationsByEachPupilEachSession();

    // state for manage insert new medication logs:
    const [ isCreatedLogs, setIsCreatedLogs ] = useState(false)
    // Session tracking state for time-based control
    const [givenSessions, setGivenSessions] = useState({}) // Track which sessions are given for each disease

    // state for selected pupil and medication details of that pupil:
    const [selectedMedicationDetails, setSelectedMedicationDetails] = useState(null);

    const [value, setValue] = useState("1")
    const [givenPrescriptionBySession, setGivenPrescriptionBySession] = useState([]);
    const [pupilListOpen, setPupilListOpen] = useState(false)
    const [prescriptionDetailOpen, setPrescriptionDetailOpen] = useState(false)
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [selectedSession, setSelectedSession] = useState(null)
    const [selectedPupil, setSelectedPupil] = useState(null)
    const [medicationChecks, setMedicationChecks] = useState({})
    const [logMessages, setLogMessages] = useState({ "schoolNurseName": "+ School Nurse's name: " + localStorage.getItem("userFullName") }) 
    // manage log message of each pupil's detail, will be removed if submit for current pupil complete to continue with the next pupil;
    // fill school nurse's name to know which school nurse is taking medication for which pupil

    // debug:
    // console.log("Current session information:", JSON.stringify(sessionsInfor, null, 2)) // ✅ Shows actual data
    // console.log("Pupils information:", JSON.stringify(pupilsInfor, null, 2)) // ✅ Shows actual data
    // console.log("Medication details by pupil:", JSON.stringify(medicationDetailsByPupil, null, 2)) // ✅ Shows actual data


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
        return (
            <TableContainer component={Paper} elevation={0}>
                <Table>
                    <TableBody>
                        {renderTableLoadingSkeleton({ length: 3 })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
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
        const sessionName = getSessionName(sessionIndex) // ex: "Morning Session"
        const sessionTime = getSessionTime(sessionIndex) // ex: "09:30 - 10:00"
        
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

    // Function to check if current time is within a session window
    const isCurrentTimeInSession = (sessionIndex) => {
        const now = new Date()
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()
        const currentTotalMinutes = currentHour * 60 + currentMinute
        
        // Define session time windows (when GIVEN button can be clicked)
        const sessionTimeWindows = [
            { start: 9 * 60 + 30, end: 10 * 60 + 15}, // Session 1: 9:30-10:15
            { start: 10 * 60 + 30, end: 11 * 60 + 15 },  // Session 2: 10:30-11:15
            { start: 11 * 60 + 30, end: 12 * 60 + 15 }   // Session 3: 11:30-12:15
        ]

        // for test session 1:
        const sessionTimeWindows1 = [
            { start: currentTotalMinutes - 30, end: currentTotalMinutes + 30 }, // Session 1: Current time ±30 min
            { start: 10 * 60 + 30, end: 11 * 60 + 15 },  // Session 2: 10:30-11:15
            { start: 11 * 60 + 30, end: 12 * 60 + 15 }   // Session 3: 11:30-12:15
        ]

        // for test session 2:
        const sessionTimeWindows2 = [
            { start: 9 * 60 + 30, end: 10 * 60 + 15},   // Session 1: 9:30-10:15
            { start: currentTotalMinutes - 30, end: currentTotalMinutes + 30 }, // Session 1: Current time ±30 min
            { start: 11 * 60 + 30, end: 12 * 60 + 15 }   // Session 3: 11:30-12:15
        ]

        // for test session 3:
        const sessionTimeWindows3 = [
            { start: 9 * 60 + 30, end: 10 * 60 + 15},   // Session 1: 9:30-10:15
            { start: 10 * 60 + 30, end: 11 * 60 + 15 },  // Session 2: 10:30-11:15
            { start: currentTotalMinutes - 30, end: currentTotalMinutes + 30 }, // Session 1: Current time ±30 min
        ]
        
        const sessionWindow = sessionTimeWindows[sessionIndex]
        if (!sessionWindow) return false
        
        return currentTotalMinutes >= sessionWindow.start && currentTotalMinutes <= sessionWindow.end
    }

    // Get session time window text for display
    const getSessionTimeWindow = (sessionIndex) => {
        const timeWindows = [
            "9:30-10:15",   // Session 1
            "10:30-11:15",  // Session 2  
            "11:30-12:15"   // Session 3
        ]
        return timeWindows[sessionIndex] || ""
    }

    // Function to check if given in current session
    const isGivenInCurrentSession = (request) => {
        // Check local tracking first
        const localGivenSessions = givenSessions[request.sendMedicationId] || []
        if (localGivenSessions.includes(selectedSession + 1)) {
            return true
        }
        
        // Check existing logs from API (if backend supports sessionNumber)
        if (request.medicationLogs && request.medicationLogs.length > 0) {
            return request.medicationLogs.some(log => 
                log.status === "GIVEN" && log.sessionNumber === (selectedSession + 1)
            )
        }
        
        return false
    }
    
    // Handle events functions:
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleGradeCardClick = (grade, sessionIndex) => {

        // debug:
        console.log("handleGradeCardClick called!!!!");

        if (currentSessionInfor()[`session1`] === true) {
            const listGiven = localStorage.getItem("givenPrescriptionSession1");
            if (listGiven === null) {
                localStorage.setItem("givenPrescriptionSession1", "[]");
            }
            setGivenPrescriptionBySession(JSON.parse(listGiven) || []);
            // remove other given sessiosn from localStorage
            localStorage.removeItem("givenPrescriptionSession2");
            localStorage.removeItem("givenPrescriptionSession3");
        }
        else if (currentSessionInfor()[`session2`] === true) {
            const listGiven = localStorage.getItem("givenPrescriptionSession2");
            if (listGiven === null) {
                localStorage.setItem("givenPrescriptionSession2", "[]");
            }
            setGivenPrescriptionBySession(JSON.parse(listGiven) || []);
            // remove other given sessiosn from localStorage
            localStorage.removeItem("givenPrescriptionSession1");
            localStorage.removeItem("givenPrescriptionSession3");
        }
        else if (currentSessionInfor()[`session3`] === true) {
            const listGiven = localStorage.getItem("givenPrescriptionSession3");
            if (listGiven === null) {
                localStorage.setItem("givenPrescriptionSession3", "[]");
            }
            setGivenPrescriptionBySession(JSON.parse(listGiven) || []);
            // remove other given sessiosn from localStorage
            localStorage.removeItem("givenPrescriptionSession1");
            localStorage.removeItem("givenPrescriptionSession2");
        } else {
            showErrorToast("No active session available for now.")
            // return
        }

        setSelectedGrade(grade)
        setSelectedSession(sessionIndex) 
        setPupilListOpen(true)
    }

    const handlePupilDetailClick = (pupil) => {
        setSelectedPupil(pupil)

        setSelectedMedicationDetails(null); // Reset selected medication details
        
        // Get all approved medication requests for this pupil
        const pupilMedications = (medicationDetailsByPupil || []).filter(
            request => (request.pupilId === pupil.pupilId && request.status === "APPROVED" && request.medicationItems != null && request.medicationItems.length > 0) // Ensure medicationItems is not null or empty
        )

        setSelectedMedicationDetails(pupilMedications) // Set medication details for this pupil

        // debug, show selectedMedicationDetails and getPupilMedicationRequests:
        console.log("Selected pupil medication details:", pupilMedications) // ✅ Shows actual data
        console.log("Medication requests for pupil:", pupilMedications)      // ✅ Same data
        
        
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
        
        // Reset session tracking for new pupil
        setGivenSessions({})
        
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

        if (request == null || request.medicationItems == null || request.medicationItems.length === 0) {
            showErrorToast("No medications available for this request.")
            return
        }

        // append pupilId to the "givenPrescriptionSession":
        setGivenPrescriptionBySession(prev => {
            const updatedGiven = [...prev]  // clone previous state
            const pupilId = request.pupilId
            // check if already exists
            if ((updatedGiven || []).some(item => item.pupilId === pupilId)) {
                return updatedGiven // already exists, no need to add again
            }
            // if not exists, add new object
            updatedGiven.push(pupilId);
            // save to localStorage
            if (currentSessionInfor()[`session1`] === true) {
                localStorage.setItem("givenPrescriptionSession1", JSON.stringify(updatedGiven));
            }
            else if (currentSessionInfor()[`session2`] === true) {
                localStorage.setItem("givenPrescriptionSession2", JSON.stringify(updatedGiven));
            }
            else if (currentSessionInfor()[`session3`] === true) {
                localStorage.setItem("givenPrescriptionSession3", JSON.stringify(updatedGiven));
            }
            return updatedGiven
        })


        // Check if current time is within session window
        if (!isCurrentTimeInSession(selectedSession)) {
            const sessionTime = getSessionTimeWindow(selectedSession)
            showErrorToast(`Medication can only be given during Session ${selectedSession + 1} time window: ${sessionTime}`)
            return
        }
        
        // Check if already given for this session
        if (isGivenInCurrentSession(request)) {
            showWarningToast(`This medication has already been given for Session ${selectedSession + 1}!`)
            return
        }

        const medicationLogData = {
            sendMedicationId: request.sendMedicationId,
            status: "GIVEN",
            note: getDiseaseLogMessages(request),
            sessionNumber: selectedSession + 1, // Add session number to the payload
        }

        try {
            // insert logs into db;
            await createTakeMedicationLogs(medicationLogData)
            
            // Track locally that this disease was given in this session
            setGivenSessions(prev => ({
                ...prev,
                [request.sendMedicationId]: [
                    ...(prev[request.sendMedicationId] || []),
                    selectedSession + 1
                ]
            }))
            
            setIsCreatedLogs(true) // This will trigger the useEffect
        } catch (error) {
            showErrorToast("Failed to create medication log. Please try again.")
        }
    }

    // Add function to check if any medication is checked for a specific disease
    const hasCheckedMedications = (request) => {
        // If already given for current session, don't allow clicking
        if (isGivenInCurrentSession(request)) return false
        
        // If not in session time window, don't allow clicking
        if (!isCurrentTimeInSession(selectedSession)) return false
        
        if (!request.medicationItems) return false
        return request.medicationItems.some(medication => 
            medicationChecks[medication.medicationId] === true
        )
    }

    // Check if disease already has GIVEN status for current session
    const isDiseaseAlreadyGiven = (request) => {
        return isGivenInCurrentSession(request)
    }

    // Get log messages for a specific disease
    const getDiseaseLogMessages = (request) => {
        // If disease already given for current session, show existing notes
        if (isGivenInCurrentSession(request)) {
            const currentSessionLog = request.medicationLogs?.find(log => 
                log.status === "GIVEN" && log.sessionNumber === (selectedSession + 1)
            )
            
            if (currentSessionLog) {
                return currentSessionLog.note
            }
            
            return `Medication already given for Session ${selectedSession + 1}`
        }

        // Otherwise, generate new log messages
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
        
        // Add session information
        diseaseMessages.push(`+ Session: ${selectedSession + 1} (${getSessionTimeWindow(selectedSession)})`)
        
        return diseaseMessages.join("\n\n").trim() || `No medication given yet for Session ${selectedSession + 1}.`
    }

    // Modified close dialog function
    const handleCloseDialog = () => {
        showWarningToast("Please ensure all medication administration is complete before closing!")
        
        if (window.confirm("Are you sure you want to close? Any unsaved changes will be lost.")) {
            setPrescriptionDetailOpen(false)
            setSelectedMedicationDetails(null) // Reset selected medication details
            setSelectedPupil(null) // Reset selected pupil
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

    // getupilsInfor by grade
    const getPupilsByGrade = (grade) => {
        if (!pupilsInfor || !Array.isArray(pupilsInfor)) return []

        // debug:
        // console.log("--");
        // console.log("Filtering pupils by grade:", grade) // ✅ Shows actual data
        // console.log("Pupils information:", pupilsInfor) // ✅ Shows actual data
        // console.log("--");

        return pupilsInfor;
    }

    return (
        <>
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
                                            <>{renderTableLoadingSkeleton({ length: 3 })}</>
                                        ) : (
                                            getPupilsByGrade(selectedGrade)?.map((pupil) => {

                                                return (
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
                                                                disabled={
                                                                    (currentSessionInfor()[`session${selectedSession + 1}`] === true &&  // in prescription session time
                                                                    localStorage.getItem(`givenPrescriptionSession${selectedSession + 1}`) &&  // has givenPrescriptionSession
                                                                    JSON.parse(localStorage.getItem(`givenPrescriptionSession${selectedSession + 1}`)).includes(pupil.pupilId)) // but already given
                                                                }
                                                            >
                                                                DETAIL
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
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
                <Dialog open={prescriptionDetailOpen} onClose={() => {
                                                                    setPrescriptionDetailOpen(false)
                                                                    setSelectedMedicationDetails(null); // Reset selected medication details
                                                                    setSelectedPupil(null); // Reset selected pupil
                                                                }
                } maxWidth="md" fullWidth>
                    <DialogTitle>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Medication color="primary" />
                                <Typography variant="h6" fontWeight="bold">
                                    Medication Details - {selectedPupil?.lastName} {selectedPupil?.firstName}
                                </Typography>
                            </Box>
                            <IconButton onClick={() => {
                                setPrescriptionDetailOpen(false);
                                setSelectedMedicationDetails(null); // Reset selected medication details
                                setSelectedPupil(null); // Reset selected pupil
                            }} size="small">
                                <Close />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    {/* Presctiption details */}
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
                                {getPupilMedicationRequests().map((request, diseaseIndex) => {

                                    // debug:
                                    // console.log("Rendering disease request:", request) // ✅ Shows actual data

                                    const startDate = request.startDate ? getDateFromDDMMYYYY(request.startDate) : null;
                                    const endDate = request.endDate ? getDateFromDDMMYYYY(request.endDate) : null;
                                    const currrentDate = new Date();

                                    if (startDate && endDate && (currrentDate < startDate || currrentDate > endDate)) {
                                        // Skip this disease if current date is outside treatment period
                                        return <Box key={request.sendMedicationId} sx={{ mb: 4 }}>
                                            <Paper sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
                                                <Typography variant="subtitle1" fontWeight="bold" color={isDiseaseAlreadyGiven(request) ? "success.main" : "warning.main"} sx={{ mb: 1 }}>
                                                    Disease #{diseaseIndex + 1}: {request.diseaseName}
                                                    {isDiseaseAlreadyGiven(request) && (
                                                        <Chip
                                                            label={`GIVEN (SESSION ${selectedSession + 1})`}
                                                            color="success"
                                                            size="small"
                                                            sx={{ ml: 2, fontWeight: "bold" }}
                                                        />
                                                    )}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    This disease is not currently in the treatment period (from {request.startDate} to {request.endDate}).
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    }

                                    return (
                                        <Box key={request.sendMedicationId} sx={{ mb: 4 }}>
                                            {/* Disease Header */}
                                            <Paper sx={{ p: 2, mb: 2, bgcolor: isDiseaseAlreadyGiven(request) ? "success.50" : "warning.50" }}>
                                                <Typography variant="subtitle1" fontWeight="bold" color={isDiseaseAlreadyGiven(request) ? "success.main" : "warning.main"} sx={{ mb: 1 }}>
                                                    Disease #{diseaseIndex + 1}: {request.diseaseName}
                                                    {isDiseaseAlreadyGiven(request) && (
                                                        <Chip
                                                            label={`GIVEN (SESSION ${selectedSession + 1})`}
                                                            color="success"
                                                            size="small"
                                                            sx={{ ml: 2, fontWeight: "bold" }}
                                                        />
                                                    )}
                                                </Typography>

                                                {/* Show current session time window */}
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Time for session {selectedSession + 1}:</strong>
                                                    {!isCurrentTimeInSession(selectedSession) && (
                                                        <Chip
                                                            label={getSessionTimeWindow(selectedSession)}
                                                            color="warning"
                                                            size="small"
                                                            sx={{ ml: 1 }}
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
                                                        <strong>Given Time (Session {selectedSession + 1}):</strong> {request.medicationLogs.find(log => log.status === "GIVEN")?.givenTime}
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
                                                    This note will be notified to the pupil's parents.
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
                                                            sx={{ minWidth: 180 }}
                                                        >
                                                            Given (Session {selectedSession + 1})
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            color={isCurrentTimeInSession(selectedSession) ? "success" : "warning"}
                                                            size="medium"
                                                            startIcon={<CheckCircle />}
                                                            disabled={!hasCheckedMedications(request)}
                                                            onClick={() => handleGivenButtonClick(request)}
                                                            sx={{ minWidth: 180 }}
                                                        >
                                                            {!isCurrentTimeInSession(selectedSession)
                                                                ? `Available ${getSessionTimeWindow(selectedSession)}`
                                                                : `Give (Session ${selectedSession + 1})`
                                                            }
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                })}

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
        </>
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

const renderTableLoadingSkeleton = ({ length }) => (
    <>
        {Array.from({ length }, (_, i) => (
            <TableRow key={i}>
                <TableCell colSpan={6}>
                    <Skeleton variant="rectangular" width="100%" height={40} />
                </TableCell>
            </TableRow>
        ))}
    </>
);

export default TakeMedicationBySession
