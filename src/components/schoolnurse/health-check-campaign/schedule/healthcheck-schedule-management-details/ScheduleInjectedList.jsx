import { useEffect, useState, useRef } from "react"
import "./StyleScheduleInjectedList.scss"
import { usePupilsByGrade } from "../../../../../hooks/schoolnurse/healthcheck/schedule/usePupilsByGrade"
import ScheduleDetails from "../healthcheck-schedule-management-form/ScheduleDetails"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    TextField,
    Button,
    LinearProgress,
    Chip,
    Avatar,
    IconButton,
    Fade,
    Grow,
    Snackbar,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Typography,
    Box,
    Divider,
} from "@mui/material"
import {
    ArrowBack,
    CheckCircle,
    Schedule,
    Group,
    Save,
    Visibility,
    CheckCircleOutline,
    PendingActions,
    LocationOn,
    Download,
    SelectAll,
} from "@mui/icons-material"

const ScheduleInjectedList = ({ shift, onBack }) => {
    const grade = Number(shift?.grade ?? shift?.Grade ?? 1)
    const { pupils: rawPupils = [], isLoading } = usePupilsByGrade(grade)
    const [students, setStudents] = useState([])
    const [selectedPupilId, setSelectedPupilId] = useState(null)
    const [autoSaving, setAutoSaving] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [animateRows, setAnimateRows] = useState(false)
    const initializedRef = useRef(false)

    // Reset initializedRef when grade changes
    useEffect(() => {
        initializedRef.current = false
    }, [grade])

    // Auto-save delay
    const [saveTimeout, setSaveTimeout] = useState(null)

    // Transform pupils data to match expected format
    const transformPupilsData = (pupilsData) => {
        if (!Array.isArray(pupilsData)) return []

        // Group by pupilId to avoid duplicates
        const uniquePupils = {}
        pupilsData.forEach((item) => {
            const pupilId = item.pupilRes?.pupilId
            if (pupilId && !uniquePupils[pupilId]) {
                uniquePupils[pupilId] = {
                    pupilId: pupilId,
                    firstName: item.pupilRes.firstName,
                    lastName: item.pupilRes.lastName,
                    birthDate: item.pupilRes.birthDate,
                    gender: item.pupilRes.gender,
                    Grade: item.pupilRes.gradeName,
                    gradeName: item.pupilRes.gradeName,
                    healthCheckConsentId: item.healthCheckConsentId,
                    schoolYear: item.schoolYear,
                    diseases: [],
                    // Add avatar placeholder
                    avatar: `https://ui-avatars.com/api/?name=${item.pupilRes.firstName}+${item.pupilRes.lastName}&background=1976d2&color=fff`,
                }
            }
            // Collect all diseases for this pupil
            if (pupilId && item.disease) {
                uniquePupils[pupilId].diseases.push(...item.disease)
            }
        })

        return Object.values(uniquePupils)
    }

    const pupils = transformPupilsData(rawPupils)

    useEffect(() => {
        const sharedKey = `healthcheck_students_grade_${grade}`
        const saved = localStorage.getItem(sharedKey)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setStudents(parsed)
                    initializedRef.current = true
                    return
                }
            } catch (e) { }
        }
        // Only initialize if not already initialized for this pupils set and students do not match pupils
        const pupilsIds = (pupils || []).map(p => p.pupilId).join(',')
        const studentsIds = (students || []).map(s => s.pupilId).join(',')
        if (!initializedRef.current && pupils && pupils.length > 0 && pupilsIds !== studentsIds) {
            setStudents(
                pupils.map((pupil) => ({
                    ...pupil,
                    completed: false,
                    time: "",
                    notes: "",
                })),
            )
            initializedRef.current = true
        } else if (pupils && pupils.length === 0 && students.length !== 0) {
            setStudents([])
            initializedRef.current = true
        }
        // Reset flag if pupils changes (by length)
        return () => {
            // Do not reset here, only reset on grade change
        }
    }, [pupils, grade])

    // Animate rows after data loads
    useEffect(() => {
        if (students.length > 0) {
            setTimeout(() => setAnimateRows(true), 200)
        }
    }, [students])

    // Auto-save functionality
    const autoSave = (updatedStudents) => {
        if (saveTimeout) {
            clearTimeout(saveTimeout)
        }

        const newTimeout = setTimeout(() => {
            setAutoSaving(true)
            const sharedKey = `healthcheck_students_grade_${grade}`
            localStorage.setItem(sharedKey, JSON.stringify(updatedStudents))
            setTimeout(() => {
                setAutoSaving(false)
                setSnackbar({
                    open: true,
                    message: "Changes saved automatically",
                    severity: "success",
                })
            }, 500)
        }, 1000) // Auto-save after 1 second of inactivity

        setSaveTimeout(newTimeout)
    }

    const handleCheck = (index) => {
        const updated = [...students]
        updated[index].completed = !updated[index].completed
        if (updated[index].completed) {
            const now = new Date()
            const hours = String(now.getHours()).padStart(2, "0")
            const minutes = String(now.getMinutes()).padStart(2, "0")
            updated[index].time = `${hours}:${minutes}`
        } else {
            updated[index].time = ""
        }
        setStudents(updated)
        autoSave(updated)
    }

    const handleNoteChange = (index, newValue) => {
        const updated = [...students]
        updated[index].notes = newValue
        setStudents(updated)
        autoSave(updated)
    }

    const handleMarkAll = () => {
        const allCompleted = students.every((s) => s.completed)
        const now = new Date()
        const hours = String(now.getHours()).padStart(2, "0")
        const minutes = String(now.getMinutes()).padStart(2, "0")
        const timeString = `${hours}:${minutes}`

        const updated = students.map((student) => ({
            ...student,
            completed: !allCompleted,
            time: !allCompleted ? timeString : "",
        }))

        setStudents(updated)
        autoSave(updated)
        setSnackbar({
            open: true,
            message: allCompleted ? "All students unmarked" : "All students marked as completed",
            severity: "success",
        })
    }

    const handleManualSave = () => {
        const sharedKey = `healthcheck_students_grade_${grade}`
        localStorage.setItem(sharedKey, JSON.stringify(students))
        setSnackbar({
            open: true,
            message: "Data saved successfully!",
            severity: "success",
        })
    }

    const handleExport = () => {
        setSnackbar({
            open: true,
            message: "Export functionality coming soon!",
            severity: "info",
        })
    }

    if (isLoading) {
        return (
            <div className="schedule-list-root loading-container">
                <CircularProgress size={60} sx={{ color: "#1976d2" }} />
                <Typography variant="h6" sx={{ mt: 2, color: "#666" }}>
                    Loading Grade {grade} students...
                </Typography>
            </div>
        )
    }

    const completedCount = students.filter((s) => s.completed).length
    const total = students.length
    const remaining = total - completedCount
    const progressPercentage = total > 0 ? (completedCount / total) * 100 : 0

    // Show ScheduleDetails if a pupil is selected
    if (selectedPupilId) {
        return (
            <Fade in={true} timeout={300}>
                <div>
                    <ScheduleDetails
                        pupilId={selectedPupilId}
                        pupilData={students.find((s) => s.pupilId === selectedPupilId)}
                        onBack={() => setSelectedPupilId(null)}
                    />
                </div>
            </Fade>
        )
    }

    return (
        <div className="schedule-list-root">
            <Fade in={true} timeout={500}>
                <Card className="schedule-list-header" elevation={0}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <IconButton
                                    onClick={onBack}
                                    className="back-button"
                                    sx={{
                                        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                                        color: "white",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #1565c0, #1976d2)",
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >
                                    <ArrowBack />
                                </IconButton>
                                <Box>
                                    <Typography variant="h4" className="header-title">
                                        Grade {grade} Health Check
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={2} mt={1}>
                                        <Chip
                                            icon={<Schedule />}
                                            label={shift?.time || "08:00 - 11:00"}
                                            variant="outlined"
                                            color="primary"
                                        />
                                        <Chip icon={<Group />} label={`${total} Students`} variant="outlined" />
                                        <Chip icon={<LocationOn />} label="School Health Office" variant="outlined" />
                                    </Box>
                                </Box>
                            </Box>
                            <Box display="flex" gap={1}>
                                <Button variant="outlined" startIcon={<SelectAll />} onClick={handleMarkAll} className="action-button">
                                    {students.every((s) => s.completed) ? "Unmark All" : "Mark All"}
                                </Button>
                                <Button variant="outlined" startIcon={<Download />} onClick={handleExport} className="action-button">
                                    Export
                                </Button>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Progress Section */}
                        <Box className="progress-section">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h6" className="progress-title">
                                    Completion Progress
                                </Typography>
                                <Box display="flex" gap={2}>
                                    {autoSaving && (
                                        <Chip
                                            icon={<CircularProgress size={16} />}
                                            label="Auto-saving..."
                                            size="small"
                                            color="info"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={progressPercentage}
                                className="progress-bar"
                                sx={{
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: "#e3f2fd",
                                    "& .MuiLinearProgress-bar": {
                                        borderRadius: 6,
                                        background: "linear-gradient(90deg, #43a047, #66bb6a)",
                                    },
                                }}
                            />
                            <Box display="flex" justifyContent="space-between" mt={1}>
                                <Chip
                                    icon={<CheckCircle />}
                                    label={`${completedCount} Completed`}
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                />
                                <Chip
                                    icon={<PendingActions />}
                                    label={`${remaining} Remaining`}
                                    color="warning"
                                    variant="outlined"
                                    size="small"
                                />
                                <Typography variant="body2" color="primary" fontWeight={600}>
                                    {progressPercentage.toFixed(1)}% Complete
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Fade>

            <Fade in={true} timeout={700}>
                <Card className="students-table-container" elevation={0}>
                    <TableContainer component={Paper} elevation={0}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="table-header" align="center">
                                        Status
                                    </TableCell>
                                    <TableCell className="table-header">Student Information</TableCell>
                                    <TableCell className="table-header" align="center">
                                        Grade
                                    </TableCell>
                                    <TableCell className="table-header" align="center">
                                        Time Completed
                                    </TableCell>
                                    <TableCell className="table-header">Notes</TableCell>
                                    <TableCell className="table-header" align="center">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student, idx) => (
                                    <Grow in={animateRows} timeout={300 + idx * 50} key={student.pupilId}>
                                        <TableRow
                                            className={`student-row ${student.completed ? "completed-row" : ""}`}
                                            hover
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor: student.completed ? "#e8f5e9" : "#f5f5f5",
                                                },
                                            }}
                                        >
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={student.completed}
                                                    onChange={() => handleCheck(idx)}
                                                    color="success"
                                                    icon={<CheckCircleOutline />}
                                                    checkedIcon={<CheckCircle />}
                                                    sx={{
                                                        transform: "scale(1.2)",
                                                        "&.Mui-checked": {
                                                            color: "#43a047",
                                                        },
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Avatar
                                                        src={student.avatar}
                                                        alt={`${student.firstName} ${student.lastName}`}
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            border: "2px solid #e3f2fd",
                                                        }}
                                                    >
                                                        {student.firstName?.[0]}
                                                        {student.lastName?.[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight={600} className="student-name">
                                                            {student.lastName} {student.firstName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" className="student-id">
                                                            ID: {student.pupilId}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {student.gradeName} • {student.gender === "M" ? "Male" : "Female"}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={student.gradeName || `Grade ${grade}`}
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {student.completed ? (
                                                    <Chip
                                                        icon={<CheckCircle />}
                                                        label={student.time}
                                                        color="success"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        —
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    value={student.notes}
                                                    onChange={(e) => handleNoteChange(idx, e.target.value)}
                                                    placeholder="Add notes..."
                                                    className="notes-field"
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 2,
                                                            "&:hover fieldset": {
                                                                borderColor: "#1976d2",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<Visibility />}
                                                    onClick={() => setSelectedPupilId(student.pupilId)}
                                                    className="details-button"
                                                    sx={{
                                                        background: "linear-gradient(135deg, #43a047, #66bb6a)",
                                                        "&:hover": {
                                                            background: "linear-gradient(135deg, #388e3c, #43a047)",
                                                            transform: "translateY(-1px)",
                                                        },
                                                    }}
                                                >
                                                    Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </Grow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Fade>

            <Fade in={true} timeout={900}>
                <Box className="action-footer">
                    <Button variant="outlined" size="large" startIcon={<ArrowBack />} onClick={onBack} className="footer-button">
                        Back to Schedule
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Save />}
                        onClick={handleManualSave}
                        className="footer-button save-button"
                        sx={{
                            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #1565c0, #1976d2)",
                            },
                        }}
                    >
                        Save Progress
                    </Button>
                </Box>
            </Fade>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default ScheduleInjectedList
