import { useState, useMemo } from "react"
import {
    Card,
    CardContent,
    Typography,
    Button,
    LinearProgress,
    Chip,
    Box,
    Grid,
    Paper,
    Fade,
    Skeleton,
} from "@mui/material"

import {
    Vaccines as VaccinesIcon,
    Schedule as ScheduleIcon,
    Groups as GroupsIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material"
import "./StyleScheduleForm.scss"
import ScheduleInjectedList from "../vaccination-schedule-management-details/ScheduleInjectedList"
import { useNewestVaccinationCampaign } from "../../../../../hooks/schoolnurse/vaccination/vaccination/useNewestCampaignByStatus"
import { useGetAllPupilsApprovedByGrade } from "../../../../../hooks/schoolnurse/vaccination/vaccination/useGetAllPupilsByGrade"

const GRADES = [1, 2, 3, 4, 5]

// Status configuration with enhanced styling
const statusConfig = {
    Available: {
        color: "#4caf50",
        bgColor: "#e8f5e9",
        icon: CheckCircleIcon,
        label: "Available",
    },
    "Almost Full": {
        color: "#ff9800",
        bgColor: "#fff3e0",
        icon: WarningIcon,
        label: "Almost Full",
    },
    Full: {
        color: "#f44336",
        bgColor: "#ffebee",
        icon: ErrorIcon,
        label: "Full",
    },
}

// Helper to get saved shift data for a specific campaign and grade
function getShiftSavedData(campaignId, grade) {
    const storageKey = `vaccination_students_campaign_${campaignId}_grade_${grade}`
    let savedData = null
    try {
        savedData = JSON.parse(localStorage.getItem(storageKey) || "null")
    } catch (error) {
        console.error("Error loading saved data:", error)
    }
    return savedData || []
}

// Helper to calculate schedule dates based on campaign
function calculateScheduleDates(campaign) {
    if (!campaign?.startDate) return []

    const startDate = new Date(campaign.startDate.split("-").reverse().join("-"))
    const dates = []

    for (let i = 0; i < 5; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        dates.push({
            day: i + 1,
            date: date.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
            }),
        })
    }

    return dates
}

const VaccinationScheduleForm = () => {
    const { newestVaccinationCampaign, isLoading, error } = useNewestVaccinationCampaign()
    console.log('newestVaccinationCampaign:', newestVaccinationCampaign)
    const [showInjectionList, setShowInjectionList] = useState(false)
    const [selectedShift, setSelectedShift] = useState(null)
    const [refresh, setRefresh] = useState(0)

    // Filter campaign by IN_PROGRESS status
    const activeCampaign = useMemo(() => {
        if (!newestVaccinationCampaign || !Array.isArray(newestVaccinationCampaign)) return null
        // Make status check case-insensitive and trim spaces
        return newestVaccinationCampaign.find((campaign) => String(campaign.status).trim().toUpperCase() === "IN_PROGRESS")
    }, [newestVaccinationCampaign])

    // Get pupils by campaign ID for capacity calculation
    const { pupils: allPupils, isLoading: pupilsLoading } = useGetAllPupilsApprovedByGrade(
        activeCampaign?.campaignId || 0,
    )

    const scheduleDates = useMemo(() => {
        return activeCampaign ? calculateScheduleDates(activeCampaign) : []
    }, [activeCampaign])

    // Group pupils by grade for capacity calculation
    const pupilsByGrade = useMemo(() => {
        if (!allPupils || !Array.isArray(allPupils)) return {}

        return allPupils.reduce((acc, pupil) => {
            const grade = pupil.Grade || pupil.grade || pupil.gradeLevel
            if (!acc[grade]) acc[grade] = []
            acc[grade].push(pupil)
            return acc
        }, {})
    }, [allPupils])

    // Handle navigation to student list
    const handleViewStudents = (grade) => {
        if (!activeCampaign) return

        const gradePupils = pupilsByGrade[grade] || []
        const savedData = getShiftSavedData(activeCampaign.campaignId, grade)
        const scheduleDate = scheduleDates[grade - 1]

        const shift = {
            id: `${activeCampaign.campaignId}-${grade}-morning`,
            name: `Grade ${grade} - Morning`,
            time: "08:00 - 11:00",
            grade: grade,
            campaignId: activeCampaign.campaignId,
            students: savedData,
            totalPupils: gradePupils.length,
            scheduleDate: scheduleDate?.date || `Day ${grade}`,
        }

        console.log("Navigating to grade:", grade)
        console.log("Shift data:", shift)
        console.log("Available pupils for grade:", gradePupils.length)

        setSelectedShift(shift)
        setShowInjectionList(true)
    }

    // Handle back navigation from student list
    const handleBackFromStudentList = () => {
        console.log("Returning from student list")
        setShowInjectionList(false)
        setSelectedShift(null)
        setRefresh((r) => r + 1) // Force refresh to update progress
    }

    // Calculate progress for each grade
    const getGradeProgress = (grade) => {
        if (!activeCampaign) return { filled: 0, total: 0, progress: 0 }

        const savedData = getShiftSavedData(activeCampaign.campaignId, grade)
        const gradePupils = pupilsByGrade[grade] || []

        const filled = savedData.filter((student) => student.completed).length
        const total = savedData.length || gradePupils.length
        const progress = total === 0 ? 0 : (filled / total) * 100

        return { filled, total, progress }
    }

    if (isLoading || pupilsLoading) {
        return (
            <div className="vaccine-schedule-root">
                <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
                    {GRADES.map((grade) => (
                        <Card key={grade} sx={{ mb: 3, borderRadius: 3 }}>
                            <CardContent>
                                <Skeleton variant="text" width="60%" height={40} />
                                <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
                                <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2 }} />
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </div>
        )
    }

    if (error || !activeCampaign) {
        return (
            <div className="vaccine-schedule-root">
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 3,
                        maxWidth: 600,
                        mx: "auto",
                    }}
                >
                    <ErrorIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        {error ? "Error Loading Campaign" : "No Active Campaign"}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {error ? "Please try again later." : "There is no vaccination campaign in progress."}
                    </Typography>
                </Paper>
            </div>
        )
    }

    if (showInjectionList && selectedShift) {
        return (
            <Fade in={showInjectionList}>
                <div>
                    <ScheduleInjectedList shift={selectedShift} campaign={activeCampaign} onBack={handleBackFromStudentList} />
                </div>
            </Fade>
        )
    }

    console.log("Active campaign:", activeCampaign)
    console.log("All pupils:", allPupils?.length || 0)
    console.log("Pupils by grade:", pupilsByGrade)

    if ((!activeCampaign) && Array.isArray(newestVaccinationCampaign) && newestVaccinationCampaign.length > 0) {
        // Fallback: show all campaigns for debugging
        return (
            <div className="vaccine-schedule-root">
                <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3, maxWidth: 600, mx: "auto" }}>
                    <Typography variant="h5" gutterBottom>
                        No campaign with status IN_PROGRESS found
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Available campaigns:
                    </Typography>
                    <ul style={{ textAlign: 'left' }}>
                        {newestVaccinationCampaign.map((c) => (
                            <li key={c.campaignId}>
                                <b>{c.titleCampaign}</b> (status: {c.status})
                            </li>
                        ))}
                    </ul>
                </Paper>
            </div>
        )
    }

    return (
        <div className="vaccine-schedule-root">
            <Fade in={!showInjectionList}>
                <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
                    {/* Campaign Header */}
                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <VaccinesIcon sx={{ fontSize: 40, mr: 2 }} />
                            <Box>
                                <Typography variant="h4" fontWeight="bold">
                                    {activeCampaign.titleCampaign}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                    {activeCampaign.vaccineName} • {activeCampaign.diseaseName}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <Chip
                                icon={<ScheduleIcon />}
                                label={`${activeCampaign.startDate} - ${activeCampaign.endDate}`}
                                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                            />
                            <Chip label={activeCampaign.status} color="success" sx={{ fontWeight: "bold" }} />
                        </Box>
                    </Paper>

                    {/* Grade Cards */}
                    <Grid container spacing={3}>
                        {GRADES.map((grade, index) => {
                            const gradePupils = pupilsByGrade[grade] || []
                            const scheduleDate = scheduleDates[index]
                            const { filled, total, progress } = getGradeProgress(grade)

                            // Determine status based on progress
                            const status = total === 0 ? "Full" : total - filled <= 2 ? "Almost Full" : "Available"
                            const config = statusConfig[status]
                            const StatusIcon = config.icon

                            return (
                                <Grid item xs={12} md={6} lg={4} key={grade}>
                                    <Fade in timeout={300 + index * 100}>
                                        <Card
                                            className="grade-card"
                                            sx={{
                                                height: "100%",
                                                borderRadius: 3,
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    transform: "translateY(-4px)",
                                                    boxShadow: 6,
                                                },
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                {/* Card Header */}
                                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                    <Box
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: "50%",
                                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            color: "white",
                                                            fontWeight: "bold",
                                                            fontSize: "1.2rem",
                                                            mr: 2,
                                                        }}
                                                    >
                                                        {grade}
                                                    </Box>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="h6" fontWeight="bold">
                                                            Grade {grade}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {scheduleDate?.date || `Day ${grade}`}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Schedule Info */}
                                                <Paper
                                                    sx={{
                                                        p: 2,
                                                        mb: 2,
                                                        bgcolor: config.bgColor,
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                        <ScheduleIcon sx={{ mr: 1, fontSize: 20 }} />
                                                        <Typography variant="body2" fontWeight="medium">
                                                            08:00 - 11:00
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                        <StatusIcon sx={{ mr: 1, fontSize: 20, color: config.color }} />
                                                        <Chip
                                                            label={config.label}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: config.color,
                                                                color: "white",
                                                                fontWeight: "bold",
                                                            }}
                                                        />
                                                    </Box>

                                                    {/* Progress */}
                                                    <Box sx={{ mb: 1 }}>
                                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                                            <Typography variant="body2">Progress</Typography>
                                                            <Typography variant="body2" fontWeight="bold">
                                                                {filled}/{total}
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={progress}
                                                            sx={{
                                                                height: 8,
                                                                borderRadius: 4,
                                                                "& .MuiLinearProgress-bar": {
                                                                    bgcolor: config.color,
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                </Paper>

                                                {/* Students Count */}
                                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                    <GroupsIcon sx={{ mr: 1, color: "text.secondary" }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {gradePupils.length} approved students
                                                    </Typography>
                                                </Box>

                                                {/* Action Button */}
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => handleViewStudents(grade)}
                                                    sx={{
                                                        borderRadius: 2,
                                                        py: 1.5,
                                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                        "&:hover": {
                                                            background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                                                        },
                                                    }}
                                                >
                                                    View Students ({gradePupils.length})
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                </Grid>
                            )
                        })}
                    </Grid>

                    {/* Complete Campaign Button */}
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => alert("Campaign marked as completed!")}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)",
                                    transform: "translateY(-2px)",
                                    boxShadow: 4,
                                },
                                transition: "all 0.3s ease",
                            }}
                        >
                            Complete Campaign
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </div>
    )
}

export default VaccinationScheduleForm

