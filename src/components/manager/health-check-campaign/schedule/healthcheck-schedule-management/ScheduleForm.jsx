//health check-schedule-management/ScheduleForm.jsx
import { useState, useMemo, useEffect } from "react"
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
    Grow,
} from "@mui/material"
import {
    Schedule as ScheduleIcon,
    Group as GroupIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material"
import "./StyleScheduleForm.scss"
import ScheduleInjectedList from "../healthcheck-schedule-management-details/ScheduleInjectedList"
import { useNewestCampaignByStatus } from "../../../../../hooks/schoolnurse/healthcheck/schedule/useNewestCampaignByStatus"
import { fetchPupilsByGrade } from "../../../../../api/schoolnurse/schoolnurse-requests-action/healthcheck/pupils-by-grade-request-action"
import { useNavigate } from "react-router-dom"

const GRADES = [1, 2, 3, 4, 5]

const statusConfig = {
    Available: {
        color: "#4caf50",
        bgColor: "#e8f5e9",
        icon: CheckCircleIcon,
        label: "Available",
    },
    NONE: {
        color: "#f44336",
        bgColor: "#ffebee",
        icon: ErrorIcon,
        label: "NONE",
    },
}

// Helper to get saved shift data for a specific campaign and grade, always synced with current pupils
function getShiftSavedData(campaignId, grade, currentPupils) {
    const storageKey = `healthcheck_students_campaign_${campaignId}_grade_${grade}`
    let savedData = null
    try {
        savedData = JSON.parse(localStorage.getItem(storageKey) || "null")
    } catch (error) {
        console.error("Error loading saved data:", error)
    }
    savedData = savedData || []
    // Merge: for each current pupil, use saved if exists, else default
    return (currentPupils || []).map((pupil) => {
        const pupilId = pupil.pupilId || pupil.id
        const saved = savedData.find((s) => s.pupilId === pupilId)
        return saved || {
            pupilId,
            firstName: pupil.firstName,
            lastName: pupil.lastName,
            Grade: pupil.Grade || pupil.grade,
            avatar: pupil.avatar || `/placeholder.svg?height=40&width=40`,
            completed: false,
            time: "",
            notes: "",
        }
    })
}

// Helper to calculate schedule dates based on campaign
function calculateScheduleDates(campaign) {
    if (!campaign?.startExaminationDate) return []
    const startDate = new Date(campaign.startExaminationDate)
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

const HealthCheckScheduleForm = () => {
    const { newestCampaign, loading, error } = useNewestCampaignByStatus()
    const [showInjectionList, setShowInjectionList] = useState(false)
    const [selectedShift, setSelectedShift] = useState(null)
    const [refresh, setRefresh] = useState(0)
    const [pupilsByGrade, setPupilsByGrade] = useState({})
    const [pupilsLoading, setPupilsLoading] = useState(true)
    const [animateCards, setAnimateCards] = useState(false)
    const navigate = useNavigate();

    // Find active campaign (IN_PROGRESS)
    const activeCampaign = useMemo(() => {
        if (!newestCampaign || !Array.isArray(newestCampaign)) return null
        return newestCampaign.find((c) => String(c.statusHealthCampaign).trim().toUpperCase() === "IN_PROGRESS")
    }, [newestCampaign])

    // Fetch all grades' pupils in parallel using API
    useEffect(() => {
        let isMounted = true
        async function fetchAllPupils() {
            setPupilsLoading(true)
            const results = {}
            await Promise.all(
                GRADES.map(async (grade) => {
                    try {
                        const pupils = await fetchPupilsByGrade(grade)
                        results[grade] = Array.isArray(pupils) ? pupils : []
                    } catch {
                        results[grade] = []
                    }
                })
            )
            if (isMounted) setPupilsByGrade(results)
            setPupilsLoading(false)
        }
        if (activeCampaign) fetchAllPupils()
        else setPupilsLoading(false)
        return () => { isMounted = false }
    }, [activeCampaign, refresh])

    const scheduleDates = useMemo(() => {
        return activeCampaign ? calculateScheduleDates(activeCampaign) : []
    }, [activeCampaign])

    // Handle navigation to student list
    const handleViewStudents = (grade) => {
        if (!activeCampaign) return
        const gradePupils = pupilsByGrade[grade] || []
        const savedData = getShiftSavedData(activeCampaign.campaignId, grade, gradePupils)
        const scheduleDate = scheduleDates[grade - 1]
        const shift = {
            id: `${activeCampaign.campaignId}-${grade}-morning`,
            name: `Grade ${grade} - Morning`,
            time: "08:00 - 11:00",
            grade: grade,
            campaignId: activeCampaign.campaignId,
            students: savedData, // merged with saved data
            allPupils: gradePupils, // raw pupils array for consistent count
            totalPupils: gradePupils.length,
            scheduleDate: scheduleDate?.date || `Day ${grade}`,
        }
        setSelectedShift(shift)
        setShowInjectionList(true)
    }

    // Handle back navigation from student list
    const handleBackFromStudentList = () => {
        setShowInjectionList(false)
        setSelectedShift(null)
        setRefresh((r) => r + 1)
    }

    // Calculate progress for each grade
    const getGradeProgress = (grade) => {
        if (!activeCampaign) return { filled: 0, total: 0, progress: 0 }
        const gradePupils = pupilsByGrade[grade] || []
        const savedData = getShiftSavedData(activeCampaign.campaignId, grade, gradePupils)
        let filled = savedData.filter((student) => student.completed).length
        const total = gradePupils.length
        if (total === 0) filled = 0
        const progress = total === 0 ? 0 : (filled / total) * 100
        return { filled, total, progress }
    }

    // Animate cards after data loads
    useEffect(() => {
        if (newestCampaign && !loading) {
            setTimeout(() => setAnimateCards(true), 100)
        }
    }, [newestCampaign, loading])

    if (loading || pupilsLoading) {
        return (
            <div className="vaccine-schedule-root">
                {/* Quick Navigation Bar */}
                {/* <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/schoolnurse/health-check-campaign/schedule")}
                    >
                        Health Check Schedule
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/schoolnurse/vaccination-campaign/schedule")}
                    >
                        Vaccination Schedule
                    </Button>
                </Box> */}
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
                {/* Quick Navigation Bar */}
                {/* <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/schoolnurse/health-check-campaign/schedule")}
                    >
                        Health Check Schedule
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/schoolnurse/vaccination-campaign/schedule")}
                    >
                        Vaccination Schedule
                    </Button>
                </Box> */}
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
                        {error ? "Please try again later." : "There is no health check campaign in progress."}
                    </Typography>
                </Paper>
            </div>
        )
    }

    if (showInjectionList && selectedShift) {
        return (
            <>
                <Fade in={showInjectionList}>
                    <div>
                        <ScheduleInjectedList shift={selectedShift} campaign={activeCampaign} onBack={handleBackFromStudentList} />
                    </div>
                </Fade>
            </>
        )
    }

    return (
        <div>
            {/* Quick Navigation Bar */}

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
                            <ScheduleIcon sx={{ fontSize: 40, mr: 2 }} />
                            <Box>
                                <Typography variant="h4" fontWeight="bold">
                                    {activeCampaign.title}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                    {activeCampaign.description}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <Chip
                                icon={<ScheduleIcon />}
                                label={`${activeCampaign.startExaminationDate} - ${activeCampaign.endExaminationDate}`}
                                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                            />
                            <Chip label={activeCampaign.statusHealthCampaign} color="success" sx={{ fontWeight: "bold" }} />
                        </Box>
                    </Paper>
                    {/* Grade Cards */}
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid container spacing={3} justifyContent="center">
                            {GRADES.map((grade, index) => {
                                const gradePupils = pupilsByGrade[grade] || []
                                const scheduleDate = scheduleDates[index]
                                const { filled, total, progress } = getGradeProgress(grade)
                                let status = "Available"
                                if (total === 0) {
                                    status = "NONE"
                                }
                                const config = statusConfig[status]
                                const StatusIcon = config.icon
                                return (
                                    <Grow in={true} timeout={300 + index * 100} key={grade}>
                                        <Grid
                                            item
                                            xs={12}
                                            md={6}
                                            lg={4}
                                            sx={{ display: 'flex', justifyContent: 'center' }}
                                        >
                                            <Card
                                                sx={{
                                                    minWidth: 300,
                                                    maxWidth: 300,
                                                    minHeight: 220,
                                                    borderRadius: 4,
                                                    mb: 2,
                                                    cursor: 'pointer',
                                                    boxShadow: '0 8px 32px rgba(102,126,234,0.10)',
                                                    background: 'linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%)',
                                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                    border: '2px solid #bdbdbd',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px) scale(1.02)',
                                                        boxShadow: '0 16px 40px rgba(102,126,234,0.18)',
                                                        border: '2px solid #667eea',
                                                    },
                                                }}
                                            >
                                                <CardContent>
                                                    {/* Title and Status */}
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: 700,
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                backgroundClip: 'text',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent',
                                                            }}
                                                        >
                                                            Grade {grade} Health Check
                                                        </Typography>

                                                        <Chip
                                                            icon={
                                                                StatusIcon ? (
                                                                    <StatusIcon sx={{ color: config?.color }} />
                                                                ) : null
                                                            }
                                                            label={config?.label || status}
                                                            sx={{
                                                                fontWeight: 600,
                                                                bgcolor: config?.bgColor,
                                                                color: config?.color,
                                                                px: 1.5,
                                                                fontSize: '1rem',
                                                            }}
                                                        />
                                                    </Box>

                                                    {/* Info Fields */}
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                        <strong>Date:</strong> {scheduleDate?.date || `Day ${grade}`}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                        <strong>Students:</strong> {gradePupils.length}
                                                        {filled > 0 && (
                                                            <span style={{ marginLeft: 8, color: '#4caf50', fontWeight: 600 }}>
                                                                ({filled} checked)
                                                            </span>
                                                        )}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                                        <strong>Time:</strong> 08:00 - 11:00
                                                    </Typography>

                                                    {/* Button */}
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleViewStudents(grade)}
                                                            sx={{
                                                                borderRadius: 2,
                                                                fontWeight: 600,
                                                                textTransform: 'none',
                                                                boxShadow: '0 2px 8px rgba(102,126,234,0.10)',
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                                                },
                                                            }}
                                                            startIcon={<VisibilityIcon sx={{ fontSize: 18 }} />}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grow>
                                );

                            })}

                        </Grid>
                    </Box>
                </Box>
            </Fade>
        </div>
    )
}

export default HealthCheckScheduleForm
