"use client"

import { Grid, TextField } from "@mui/material"
import { useState, useEffect } from "react"
import React from "react"
import {
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
    TableHead,
    TableRow,
    Paper,
    Chip,
    Avatar,
    IconButton,
    Checkbox,
    FormControlLabel,
} from "@mui/material"
import { TabPanel, TabContext } from "@mui/lab"
import { School, Close, Medication, AccessTime, Assignment, CheckCircle, Groups } from "@mui/icons-material"


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

const medicationSessionsByGrade = [
    {
        session: "After Breakfast",
        quantityPupilByGrade: [
            { grade: 1, quantity: 1 },
            { grade: 4, quantity: 1 },
        ],
    },
    {
        session: "Before Lunch",
        quantityPupilByGrade: [
            { grade: 1, quantity: 1 },
            { grade: 4, quantity: 1 },
        ],
    },
    {
        session: "After Lunch",
        quantityPupilByGrade: [
            { grade: 1, quantity: 1 },
            { grade: 4, quantity: 1 },
        ],
    },
]

const pupils = [
    {
        pupilId: "PP0006",
        lastName: "Hoàng",
        firstName: "Em",
        birthDate: "12-01-2018",
        gender: "M",
        gradeId: 1,
        startYear: 2025,
        gradeLevel: "GRADE_1",
        gradeName: "Lớp 1D",
    },
    {
        pupilId: "PP0007",
        lastName: "Võ",
        firstName: "Lan",
        birthDate: "25-11-2015",
        gender: "F",
        gradeId: 4,
        startYear: 2025,
        gradeLevel: "GRADE_4",
        gradeName: "Lớp 4A",
    },
    {
        pupilId: "PP0008",
        lastName: "Nguyễn",
        firstName: "Minh",
        birthDate: "03-03-2016",
        gender: "M",
        gradeId: 3,
        startYear: 2025,
        gradeLevel: "GRADE_3",
        gradeName: "Lớp 3B",
    },
    {
        pupilId: "PP0009",
        lastName: "Lê",
        firstName: "Thảo",
        birthDate: "17-09-2017",
        gender: "F",
        gradeId: 2,
        startYear: 2025,
        gradeLevel: "GRADE_2",
        gradeName: "Lớp 2C",
    },
    {
        pupilId: "PP0010",
        lastName: "Trần",
        firstName: "Quân",
        birthDate: "05-06-2014",
        gender: "M",
        gradeId: 5,
        startYear: 2025,
        gradeLevel: "GRADE_5",
        gradeName: "Lớp 5A",
    },
]

const pupilDetailPrescription = {
    pupilId: "PP0001",
    sessionId: 1,
    medications: [
        {
            medicationId: 101,
            medicationName: "Paracetamol",
            unitAndUsage: "500mg, twice a day after meals",
            medicationSchedule: "2024-07-01 to 2024-07-05",
        },
        {
            medicationId: 102,
            medicationName: "Ibuprofen",
            unitAndUsage: "200mg, once a day",
            medicationSchedule: "2024-07-01 to 2024-07-03",
        },
    ],
}

const TakeMedicationBySession = () => {
    const [value, setValue] = React.useState("1")
    const [pupilListOpen, setPupilListOpen] = useState(false)
    const [prescriptionDetailOpen, setPrescriptionDetailOpen] = useState(false)
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [selectedSession, setSelectedSession] = useState(null)
    const [selectedPupil, setSelectedPupil] = useState(null)
    const [medicationChecks, setMedicationChecks] = useState({})

    const [logMessages, setLogMessages] = useState({ "schoolNurseName": "+ School Nurse's name: " + localStorage.getItem("userFullName") }) 
    // manage log message of each pupil's detail, will be removed if submit for current pupil complete to continue with the next pupil;
    // fill school nurse's name to know which school nurse is taking medication for which pupil

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const getSessionTime = (sessionIndex) => {
        const times = ["09:30 - 10:00", "10:30 - 11:00", "11:30 - 12:00"]
        return times[sessionIndex] || ""
    }

    const getSessionName = (sessionIndex) => {
        return medicationSessionsByGrade[sessionIndex]?.session || ""
    }

    const handleGradeCardClick = (grade, sessionIndex) => {
        setSelectedGrade(grade)
        setSelectedSession(sessionIndex)
        setPupilListOpen(true)
    }

    const handlePupilDetailClick = (pupil) => {
        setSelectedPupil(pupil)
        // Reset medication checks
        const initialChecks = {}
        pupilDetailPrescription.medications.forEach((med) => {
            initialChecks[med.medicationId] = false
        })
        setMedicationChecks(initialChecks)
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

    const handleClickCancelDetail = async () => {

        await showWarningToast("You have not submitted the medication checks yet!");

        if (!window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
            return
        } 
        //else:
        showErrorToast("Cancelled medication checks!");
        setPrescriptionDetailOpen(false)
    }

    const handleSubmitMedication = () => {
        // Logic to be added later
        console.log("Submitted medication checks:", medicationChecks)
        console.log("For pupil:", selectedPupil)

        // temporary:
        showSuccessToast("Medication submitted successfully!");
        // close the dialog:
        setPrescriptionDetailOpen(false)
    }

    const getGradeColor = (grade) => {
        const colors = ["primary", "secondary", "success", "warning", "info"]
        return colors[(grade - 1) % colors.length]
    }

    const getGenderColor = (gender) => {
        return gender === "M" ? "primary" : "secondary"
    }

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split("-")
        return `${day}/${month}/${year}`
    }

    // Filter pupils by grade
    const getPupilsByGrade = (grade) => {
        return pupils.filter((pupil) => pupil.gradeId === grade)
    }

    return (
        <Grid
            container
            sx={{
                width: "100%",
                height: "100%",
                padding: "20px",
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
            <Grid item size={{ xs: 12 }} sx={{ marginTop: "20px" }}>
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
                                    {getSessionName(0)} - {getSessionTime(0)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Pupils scheduled for medication during this session
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {medicationSessionsByGrade[0]?.quantityPupilByGrade.map((gradeData) => (
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
                                    {getSessionName(1)} - {getSessionTime(1)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Pupils scheduled for medication during this session
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {medicationSessionsByGrade[1]?.quantityPupilByGrade.map((gradeData) => (
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
                                    {getSessionName(2)} - {getSessionTime(2)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Pupils scheduled for medication during this session
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {medicationSessionsByGrade[2]?.quantityPupilByGrade.map((gradeData) => (
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
                                Grade {selectedGrade} Pupils - {getSessionName(selectedSession)}
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
                                {getPupilsByGrade(selectedGrade).map((pupil) => (
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
                                ))}
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
                        Take medication
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
                                {pupilDetailPrescription.medications.map((medication, idx) => {

                                    // get school nurse information:
                                    

                                    // each log message contains medication name, unit and usage, schedule, and mark as given status
                                    const logMessage = `+ Medication: ${medication.medicationName}; Unit & Usage: ${medication.unitAndUsage}; Schedule: ${medication.medicationSchedule}; Given: Yes; Given Time: ${new Date().toLocaleTimeString()}`;

                                    return ((
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
                                                            checked={medicationChecks[medication.medicationId] || false}
                                                            onChange={(e) => handleMedicationCheck(medication.medicationId, e.target.checked, logMessage)}
                                                            color="success"
                                                        />
                                                    }
                                                    label="Given"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
                            Note: This note will be sent to pupil's parents through notification.
                        </Typography>
                        <textarea
                            value={
                                Object.values(logMessages)
                                    .filter(val => val?.trim() !== "")  // remove empty or whitespace-only values
                                    .join("\n\n")
                                    .trim() || "No medication given yet."
                            }
                            readOnly
                            style={{
                                width: '100%',
                                height: '170px',
                                marginTop: '12px',
                                border: '1px solid #ccc',
                                borderRadius: '0px',
                                padding: '12px',
                                fontSize: '16px',
                                fontFamily: 'inherit',
                                resize: 'none', // disables resize handle
                                backgroundColor: '#f5f5f5',
                            }}
                        />

                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClickCancelDetail} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmitMedication}
                        variant="contained"
                        startIcon={<CheckCircle />}
                        color="success"
                        sx={{ minWidth: 120 }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

export default TakeMedicationBySession
