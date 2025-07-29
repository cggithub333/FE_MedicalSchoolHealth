import { useEffect, useState, useRef } from "react"
import "./StyleScheduleInjectedList.scss"
import { useGetDetailsOfCampaignByID } from "../../../../../../hooks/manager/healthcheck/campaign/useGetDetaisOfCampaignByID"
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
    Tabs,
    Tab,
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
import { useNavigate } from "react-router-dom"

const ScheduleInjectedList = ({ shift, onBack }) => {
    const navigate = useNavigate()
    // Use campaignId and gradeName from shift
    const campaignId = shift?.campaignId
    const gradeName = shift?.grade
    // Fetch campaign details
    const { campaignDetails, isLoading } = useGetDetailsOfCampaignByID(campaignId)
    // Helper: extract grade number from gradeName (e.g., "Class 1A" -> 1)
    function extractGradeNumber(gradeName) {
        const match = gradeName && gradeName.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : null;
    }
    // Extract pupils for this grade from consentForms (by grade number)
    const pupils = (campaignDetails?.data?.consentForms || campaignDetails?.consentForms || [])
        .filter(form => {
            const pupilGrade = form.pupilRes?.gradeName || form.pupilRes?.Grade || "";
            return extractGradeNumber(pupilGrade) === Number(gradeName);
        })
        .map(form => ({
            consentFormId: form.consentFormId, // <-- add consentFormId for ScheduleDetails
            pupilId: form.pupilRes.pupilId,
            firstName: form.pupilRes.firstName,
            lastName: form.pupilRes.lastName,
            birthDate: form.pupilRes.birthDate,
            gender: form.pupilRes.gender,
            Grade: form.pupilRes.gradeName,
            gradeName: form.pupilRes.gradeName,
            // healthCheckConsentId: form.healthCheckConsentId,
            schoolYear: form.schoolYear,
            diseases: form.disease || [],
            avatar: `https://ui-avatars.com/api/?name=${form.pupilRes.firstName}+${form.pupilRes.lastName}&background=1976d2&color=fff`,
            active: form.active, // <-- add active property from API
            additionalNotes: form.healthCheckHistoryRes?.additionalNotes || form.additionalNotes || "", // <-- get notes from API
            campaignId: campaignId, // Ensure campaignId is included for ScheduleDetails
        }))
    // Remove all local state for completion, only use API data
    const students = pupils
    const [selectedConsentFormId, setSelectedConsentFormId] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [animateRows, setAnimateRows] = useState(false)
    const initializedRef = useRef(false)
    // Add statusTabs and tab state for status management
    const statusTabs = [
        { key: "ALL", label: "All" },
        { key: "COMPLETED", label: "Completed" },
        { key: "NOT_COMPLETED", label: "Absent" },
    ]
    const [selectedTab, setSelectedTab] = useState(0)

    // Reset initializedRef when grade changes
    useEffect(() => {
        initializedRef.current = false
    }, [gradeName])

    // Animate rows after data loads
    useEffect(() => {
        if (students.length > 0) {
            setTimeout(() => setAnimateRows(true), 200)
        }
    }, [students])

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
                {/* Quick Navigation Bar */}

                <CircularProgress size={60} sx={{ color: "#1976d2" }} />
                <Typography variant="h6" sx={{ mt: 2, color: "#666" }}>
                    Loading Grade {gradeName} students...
                </Typography>
            </div>
        )
    }

    // Progress calculation based on active property
    const completedCount = students.filter((s) => s.active).length
    const total = students.length
    const remaining = total - completedCount
    const progressPercentage = total > 0 ? (completedCount / total) * 100 : 0

    // Filter students by tab
    let filteredStudents = students
    if (selectedTab === 1) {
        filteredStudents = students.filter(s => s.active)
    } else if (selectedTab === 2) {
        filteredStudents = students.filter(s => !s.active)
    }

    // Show ScheduleDetails if a consent form is selected
    if (selectedConsentFormId) {
        const selectedStudent = students.find((s) => s.consentFormId === selectedConsentFormId)
        return (
            <Fade in={true} timeout={300}>
                <div>
                    <ScheduleDetails
                        consentFormId={selectedConsentFormId}
                        pupilData={selectedStudent}
                        onBack={() => setSelectedConsentFormId(null)}
                    />
                </div>
            </Fade>
        )
    }

    return (
        <div className="schedule-list-root">
            {/* Quick Navigation Bar */}

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
                                        Grade {gradeName} Health Check
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
                <Card elevation={0}>
                    {/* Status Tabs UI */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <Tabs
                            value={selectedTab}
                            onChange={(_, newValue) => setSelectedTab(newValue)}
                            aria-label="Status Tabs"
                            textColor="primary"
                            indicatorColor="primary"
                            variant="fullWidth"
                        >
                            {statusTabs.map((tab, idx) => (
                                <Tab key={tab.key} label={tab.label} />
                            ))}
                        </Tabs>
                    </Box>
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
                                    <TableCell className="table-header">Notes</TableCell>
                                    <TableCell className="table-header" align="center">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredStudents.map((student, idx) => (
                                    <Grow in={animateRows} timeout={300 + idx * 50} key={student.pupilId}>
                                        <TableRow
                                            className={`student-row ${student.active ? "completed-row" : ""}`}
                                            hover
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor: student.active ? "#e8f5e9" : "#f5f5f5",
                                                },
                                            }}
                                        >
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={student.active}
                                                    disabled
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
                                                            {student.firstName} {student.lastName}
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
                                                    label={student.gradeName || `Grade ${gradeName}`}
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {/* Notes field can be left as is, or made read-only if required */}
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    value={student.additionalNotes || ""}
                                                    disabled
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
                                                    onClick={() => setSelectedConsentFormId(student.consentFormId)}
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
        </div >
    )
}

export default ScheduleInjectedList
