import { useEffect, useState } from "react"
import "./StyleScheduleInjectedList.scss"
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
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    FileDownload as FileDownloadIcon,
    Visibility as VisibilityIcon,
    Schedule as ScheduleIcon,
    Groups as GroupsIcon,
    CheckCircle as CheckCircleIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    PendingActions as PendingActionsIcon,
    Download as DownloadIcon,
    SelectAll as SelectAllIcon,
} from "@mui/icons-material"
import AlertMui from '@mui/material/Alert';
import InfoIcon from '@mui/icons-material/Info';
import { useGetAllPupilsApprovedByGrade } from "../../../../../hooks/schoolnurse/vaccination/vaccination/useGetAllPupilsByGrade"

const ScheduleInjectedList = ({ shift, campaign, onBack }) => {
    const { pupils: rawPupils = [], isLoading } = useGetAllPupilsApprovedByGrade(campaign.campaignId)
    const [students, setStudents] = useState([])
    const [selectedPupilId, setSelectedPupilId] = useState(null)
    const [autoSaving, setAutoSaving] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [animateRows, setAnimateRows] = useState(false)
    const [saveTimeout, setSaveTimeout] = useState(null)

    // Filter pupils by the specific grade from the shift
    const gradePupils = (Array.isArray(rawPupils) ? rawPupils : []).filter((pupil) => {
        const pupilGrade = pupil.Grade || pupil.grade || pupil.gradeLevel
        return Number(pupilGrade) === Number(shift.grade)
    })

    useEffect(() => {
        const storageKey = `vaccination_students_campaign_${campaign.campaignId}_grade_${shift.grade}`
        try {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                setStudents(JSON.parse(saved))
                return
            }
        } catch (e) { }
        if (gradePupils && gradePupils.length > 0) {
            setStudents(
                gradePupils.map((pupil) => ({
                    pupilId: pupil.pupilId || pupil.id,
                    firstName: pupil.firstName,
                    lastName: pupil.lastName,
                    Grade: pupil.Grade || pupil.grade,
                    avatar: pupil.avatar || `/placeholder.svg?height=40&width=40`,
                    completed: false,
                    time: "",
                    notes: "",
                }))
            )
        } else {
            setStudents([])
        }
    }, [gradePupils, campaign.campaignId, shift.grade])

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
            const storageKey = `vaccination_students_campaign_${campaign.campaignId}_grade_${shift.grade}`
            localStorage.setItem(storageKey, JSON.stringify(updatedStudents))
            setTimeout(() => {
                setAutoSaving(false)
                setSnackbar({
                    open: true,
                    message: "Changes saved automatically",
                    severity: "success",
                })
            }, 500)
        }, 1000)
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
        const storageKey = `vaccination_students_campaign_${campaign.campaignId}_grade_${shift.grade}`
        localStorage.setItem(storageKey, JSON.stringify(students))
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
                    Loading Grade {shift.grade} students...
                </Typography>
            </div>
        )
    }

    // Progress calculation based on gradePupils (always up-to-date)
    const total = gradePupils.length
    const completedCount = gradePupils.filter((pupil) => {
        const pupilId = pupil.pupilId || pupil.id
        const student = students.find((s) => s.pupilId === pupilId)
        return student && student.completed
    }).length
    const remaining = total - completedCount
    const progressPercentage = total > 0 ? (completedCount / total) * 100 : 0

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
                                    <ArrowBackIcon />
                                </IconButton>
                                <Box>
                                    <Typography variant="h4" className="header-title">
                                        {campaign.titleCampaign}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={2} mt={1}>
                                        <Chip
                                            icon={<ScheduleIcon />}
                                            label={shift.time}
                                            color="primary"
                                            variant="outlined"
                                        />
                                        <Chip icon={<GroupsIcon />} label={`Grade ${shift.grade} Only`} color="secondary" variant="filled" />
                                        <Chip label={campaign.vaccineName} color="success" variant="outlined" />
                                    </Box>
                                </Box>
                            </Box>
                            <Box display="flex" gap={1}>
                                <Button variant="outlined" startIcon={<SelectAllIcon />} onClick={handleMarkAll} className="action-button">
                                    {students.every((s) => s.completed) ? "Unmark All" : "Mark All"}
                                </Button>
                                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport} className="action-button">
                                    Export
                                </Button>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        {/* Progress Section */}
                        <Box className="progress-section">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h6" className="progress-title">
                                    Vaccination Progress - Grade {shift.grade}
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
                                    icon={<CheckCircleIcon />}
                                    label={`${completedCount} Completed`}
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                />
                                <Chip
                                    icon={<PendingActionsIcon />}
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
                                                    icon={<CheckCircleOutlineIcon />}
                                                    checkedIcon={<CheckCircleIcon />}
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
                                                        sx={{ width: 48, height: 48, border: "2px solid #e3f2fd" }}
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
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={student.Grade}
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {student.completed ? (
                                                    <Chip
                                                        icon={<CheckCircleIcon />}
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
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => alert(`Show details for ${student.lastName} ${student.firstName}`)}
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
                    <Button variant="outlined" size="large" startIcon={<ArrowBackIcon />} onClick={onBack} className="footer-button">
                        Back to Schedule
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
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
                <AlertMui onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </AlertMui>
            </Snackbar>
        </div>
    )
}

export default ScheduleInjectedList
