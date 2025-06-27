// vaccination schedule management form component
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
    Grow,
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

// Helper to get saved shift data for a specific campaign and grade, always synced with current pupils
function getShiftSavedData(campaignId, grade, currentPupils) {
    const storageKey = `vaccination_students_campaign_${campaignId}_grade_${grade}`
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
        const savedData = getShiftSavedData(activeCampaign.campaignId, grade, gradePupils)
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

        const gradePupils = pupilsByGrade[grade] || []
        const savedData = getShiftSavedData(activeCampaign.campaignId, grade, gradePupils)
        let filled = savedData.filter((student) => student.completed).length
        const total = gradePupils.length
        if (total === 0) filled = 0 // Force filled to 0 if no students in grade
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
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid container spacing={3} justifyContent="center">
                            {GRADES.map((grade, index) => {
                                // Adapted from health check design
                                const gradePupils = pupilsByGrade[grade] || []
                                const scheduleDate = scheduleDates[index]
                                const { filled, total, progress } = getGradeProgress(grade)

                                // Determine status based on progress
                                let status = "Available"
                                if (total === 0) {
                                    status = "Full"
                                } else if (total - filled <= 2) {
                                    status = "Almost Full"
                                }
                                const config = statusConfig[status]
                                const StatusIcon = config.icon

                                return (
                                    <Grow in timeout={300 + index * 100} key={grade}>
                                        <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Card sx={{ minWidth: 300, maxWidth: 300, minHeight: 220, borderRadius: 4, boxShadow: "0 8px 32px rgba(102,126,234,0.10)", background: "linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%)", transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", cursor: "pointer", mb: 2, border: '2px solid #bdbdbd', '&:hover': { boxShadow: "0 16px 40px rgba(102,126,234,0.18)", transform: "translateY(-4px) scale(1.02)", border: '2px solid #667eea' } }}>

                                                <CardContent>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: 700,
                                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                                backgroundClip: "text",
                                                                WebkitBackgroundClip: "text",
                                                                WebkitTextFillColor: "transparent",
                                                            }}
                                                        >
                                                            Grade {grade} Vaccination
                                                        </Typography>
                                                        <Chip
                                                            icon={StatusIcon ? <StatusIcon sx={{ color: config.color }} /> : null}
                                                            label={config ? config.label : status}
                                                            sx={{
                                                                fontWeight: 600,
                                                                bgcolor: config ? config.bgColor : undefined,
                                                                color: config ? config.color : undefined,
                                                                px: 1.5,
                                                                fontSize: "1rem",
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                        <strong>Date:</strong> {scheduleDate?.date || `Day ${grade}`}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                        <strong>Students:</strong> {gradePupils.length}
                                                    </Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        <Typography variant="body2">
                                                            <strong>Time:</strong> 08:00 - 11:00
                                                        </Typography>

                                                    </Box>
                                                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                                        <Button

                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleViewStudents(grade)}
                                                            sx={{
                                                                borderRadius: 2,
                                                                textTransform: "none",
                                                                fontWeight: 600,
                                                                boxShadow: "0 2px 8px rgba(102,126,234,0.10)",
                                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                                '&:hover': {
                                                                    background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                                                },
                                                            }}
                                                            startIcon={<VisibilityIcon sx={{ fontSize: 18 }} />}
                                                        >
                                                            View Students
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grow>
                                )
                            })}
                        </Grid>
                    </Box>



                </Box>
            </Fade>
        </div>
    )
}

export default VaccinationScheduleForm

