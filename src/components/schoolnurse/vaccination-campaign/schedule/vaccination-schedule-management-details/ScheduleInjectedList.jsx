import { useEffect, useState, useMemo } from "react"
import {
    Paper,
    Typography,
    Button,
    Checkbox,
    TextField,
    Box,
    LinearProgress,
    Chip,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Fade,
    Card,
    CardContent,
} from "@mui/material"
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    FileDownload as FileDownloadIcon,
    Visibility as VisibilityIcon,
    Schedule as ScheduleIcon,
    Groups as GroupsIcon,
} from "@mui/icons-material"
import "./StyleScheduleInjectedList.scss"
import { useGetAllPupilsApprovedByGrade } from "../../../../../hooks/schoolnurse/vaccination/vaccination/useGetAllPupilsByGrade"

const ScheduleInjectedList = ({ shift, campaign, onBack }) => {
    const { pupils = [], isLoading } = useGetAllPupilsApprovedByGrade(campaign.campaignId)
    const [students, setStudents] = useState([])
    const [saveStatus, setSaveStatus] = useState(null)

    // Filter pupils by the specific grade from the shift
    const gradePupils = useMemo(() => {
        if (!pupils || !Array.isArray(pupils)) return []

        console.log("=== GRADE FILTERING DEBUG ===")
        console.log("All pupils from API:", pupils.length)
        console.log("Target grade:", shift.grade)

        const filtered = pupils.filter((pupil) => {
            const pupilGrade = pupil.Grade || pupil.grade || pupil.gradeLevel
            const isMatch = Number(pupilGrade) === Number(shift.grade)

            if (isMatch) {
                console.log("Matched pupil:", pupil.firstName, pupil.lastName, "Grade:", pupilGrade)
            }

            return isMatch
        })

        console.log("Filtered pupils for grade", shift.grade, ":", filtered.length)
        console.log("=== END FILTERING DEBUG ===")

        return filtered
    }, [pupils, shift.grade])

    // Load or initialize student data
    useEffect(() => {
        const storageKey = `vaccination_students_campaign_${campaign.campaignId}_grade_${shift.grade}`

        console.log("Loading data for storage key:", storageKey)

        try {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                const parsedData = JSON.parse(saved)
                console.log("Loaded saved data:", parsedData.length, "students")
                setStudents(parsedData)
                return
            }
        } catch (e) {
            console.error("Error loading saved data:", e)
        }

        // Initialize with fresh data from API
        if (gradePupils && gradePupils.length > 0) {
            const initialStudents = gradePupils.map((pupil) => ({
                pupilId: pupil.pupilId || pupil.id,
                firstName: pupil.firstName,
                lastName: pupil.lastName,
                Grade: pupil.Grade || pupil.grade,
                avatar: pupil.avatar || `/placeholder.svg?height=40&width=40`,
                completed: false,
                time: "",
                notes: "",
            }))

            console.log("Initialized with fresh data:", initialStudents.length, "students")
            setStudents(initialStudents)
        } else {
            console.log("No pupils found for grade", shift.grade)
            setStudents([])
        }
    }, [gradePupils, campaign.campaignId, shift.grade])

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
        console.log("Updated student completion:", updated[index].firstName, updated[index].completed)
    }

    const handleNoteChange = (index, newValue) => {
        const updated = [...students]
        updated[index].notes = newValue
        setStudents(updated)
    }

    const handleSave = () => {
        const storageKey = `vaccination_students_campaign_${campaign.campaignId}_grade_${shift.grade}`

        try {
            localStorage.setItem(storageKey, JSON.stringify(students))
            setSaveStatus("success")
            console.log("Saved data for key:", storageKey)
            console.log("Saved students:", students.length)

            setTimeout(() => setSaveStatus(null), 3000)
        } catch (error) {
            console.error("Error saving data:", error)
            setSaveStatus("error")
            setTimeout(() => setSaveStatus(null), 3000)
        }
    }

    const handleExport = () => {
        alert("Export functionality will be implemented")
    }

    if (isLoading) {
        return (
            <div className="vaccine-injection-root">
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                    <Typography>Loading students for Grade {shift.grade}...</Typography>
                </Box>
            </div>
        )
    }

    const completedCount = students.filter((s) => s.completed).length
    const total = students.length
    const remaining = total - completedCount
    const progress = total === 0 ? 0 : (completedCount / total) * 100

    return (
        <Fade in>
            <div className="vaccine-injection-root">
                <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
                    {/* Save Status Alert */}
                    {saveStatus && (
                        <Alert
                            severity={saveStatus === "success" ? "success" : "error"}
                            sx={{ mb: 2 }}
                            onClose={() => setSaveStatus(null)}
                        >
                            {saveStatus === "success" ? "Data saved successfully!" : "Error saving data!"}
                        </Alert>
                    )}

                    {/* Header Card */}
                    <Card sx={{ mb: 3, borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                                        {campaign.titleCampaign}
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                                        <Chip icon={<ScheduleIcon />} label={shift.time} color="primary" variant="outlined" />
                                        <Chip
                                            icon={<GroupsIcon />}
                                            label={`Grade ${shift.grade} Only`}
                                            color="secondary"
                                            variant="filled"
                                            sx={{ fontWeight: "bold" }}
                                        />
                                        <Chip label={campaign.vaccineName} color="success" variant="outlined" />
                                    </Box>
                                    <Typography variant="body1" color="text.secondary">
                                        {campaign.diseaseName} • {shift.scheduleDate} • School Health Office
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport}>
                                        Export
                                    </Button>
                                    <IconButton
                                        onClick={onBack}
                                        sx={{
                                            bgcolor: "primary.main",
                                            color: "white",
                                            "&:hover": { bgcolor: "primary.dark" },
                                        }}
                                    >
                                        <ArrowBackIcon />
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* Info Alert */}
                            <Alert icon={<InfoIcon />} severity="info" sx={{ mb: 2 }}>
                                Showing students from Grade {shift.grade} only. Total available: {gradePupils.length} students
                            </Alert>

                            {/* Progress Section */}
                            <Box sx={{ mt: 3 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" fontWeight="medium">
                                        Vaccination Progress - Grade {shift.grade}
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {completedCount}/{total} ({Math.round(progress)}%)
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        mb: 2,
                                        "& .MuiLinearProgress-bar": {
                                            bgcolor: progress === 100 ? "#4caf50" : "#2196f3",
                                        },
                                    }}
                                />
                                <Box sx={{ display: "flex", gap: 3 }}>
                                    <Chip label={`${completedCount} Completed`} color="success" size="small" />
                                    <Chip label={`${remaining} Remaining`} color="warning" size="small" />
                                    <Chip label={`${total} Total`} color="info" size="small" />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Students Table */}
                    {students.length > 0 ? (
                        <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                            Status
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Student Information</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                            Grade
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                            Time Completed
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Notes</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {students.map((student, idx) => (
                                        <TableRow
                                            key={student.pupilId}
                                            sx={{
                                                bgcolor: student.completed ? "#e8f5e9" : "inherit",
                                                "&:hover": {
                                                    bgcolor: student.completed ? "#c8e6c9" : "#f5f5f5",
                                                },
                                            }}
                                        >
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={student.completed}
                                                    onChange={() => handleCheck(idx)}
                                                    color="success"
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                    <Avatar
                                                        src={student.avatar}
                                                        alt={`${student.firstName} ${student.lastName}`}
                                                        sx={{ width: 40, height: 40 }}
                                                    />
                                                    <Box>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {student.lastName} {student.firstName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            ID: {student.pupilId}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={student.Grade} color="primary" size="small" variant="outlined" />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography
                                                    variant="body2"
                                                    color={student.completed ? "success.main" : "text.secondary"}
                                                    fontWeight={student.completed ? "bold" : "normal"}
                                                >
                                                    {student.completed ? student.time : "—"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    value={student.notes}
                                                    onChange={(e) => handleNoteChange(idx, e.target.value)}
                                                    placeholder="Add notes..."
                                                    fullWidth
                                                    sx={{ maxWidth: 200 }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => alert(`Show details for ${student.lastName} ${student.firstName}`)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, mb: 3 }}>
                            <Typography variant="h6" color="text.secondary">
                                No students found for Grade {shift.grade}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Please check if there are approved students for this grade in the campaign.
                            </Typography>
                        </Paper>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack} size="large">
                            Back to Schedule
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            size="large"
                            disabled={students.length === 0}
                            sx={{
                                background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)",
                                },
                            }}
                        >
                            Save Progress
                        </Button>
                    </Box>
                </Box>
            </div>
        </Fade>
    )
}

export default ScheduleInjectedList
