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
import { useNavigate } from "react-router-dom"
import { useGetDetailsOfCampaignByID } from "../../../../../../hooks/manager/healthcheck/campaign/useGetDetaisOfCampaignByID"

const GRADES = [1, 2, 3, 4, 5]

const statusConfig = {
    Available: {
        color: "#4caf50",
        bgColor: "#e8f5e9",
        icon: CheckCircleIcon,
        label: "Success",
    },
    NONE: {
        color: "#4caf50",
        bgColor: "#e8f5e9",
        icon: CheckCircleIcon,
        label: "Success",
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

// Accept campaignId as prop, fetch campaign details using custom hook
const HealthCheckScheduleForm = ({ campaignId, onBack }) => {
    // Use the hook
    const { campaignDetails, isLoading, error, refetch } = useGetDetailsOfCampaignByID(campaignId)
    const [showInjectionList, setShowInjectionList] = useState(false)
    const [selectedShift, setSelectedShift] = useState(null)
    const [refresh, setRefresh] = useState(0)
    const [pupilsByGrade, setPupilsByGrade] = useState({})
    const [animateCards, setAnimateCards] = useState(false)
    const navigate = useNavigate();

    // Use campaignDetails.data if present (API returns {data, status})
    const activeCampaign = campaignDetails?.data || campaignDetails
    console.log("Active Campaign:", activeCampaign)
    // Group pupils by grade number (1-5)
    useEffect(() => {
        if (!activeCampaign || !activeCampaign.consentForms) {
            setPupilsByGrade({})
            return
        }
        const grouped = {}
        for (const form of activeCampaign.consentForms) {
            const gradeName = form.pupilRes?.gradeName || "Unknown"
            const gradeNum = extractGradeNumber(gradeName)
            if (!gradeNum || gradeNum < 1 || gradeNum > 5) continue
            if (!grouped[gradeNum]) grouped[gradeNum] = []
            grouped[gradeNum].push({

                ...form.pupilRes,
                consentFormId: form.consentFormId,
                healthCheckHistoryRes: form.healthCheckHistoryRes,
                disease: form.disease,
                active: form.active,
            })
        }
        setPupilsByGrade(grouped)
    }, [activeCampaign, refresh])

    const scheduleDates = useMemo(() => {
        return activeCampaign ? calculateScheduleDates(activeCampaign) : []
    }, [activeCampaign])



    // Handle navigation to student list
    const handleViewStudents = (gradeNum) => {
        if (!activeCampaign) return
        const gradePupils = pupilsByGrade[gradeNum] || []
        const savedData = getShiftSavedData(activeCampaign.campaignId, gradeNum, gradePupils)
        // Use index for schedule date
        const gradeIndex = GRADES.indexOf(Number(gradeNum))
        const scheduleDate = scheduleDates[gradeIndex]
        const shift = {
            id: `${activeCampaign.campaignId}-Grade${gradeNum}-morning`,
            name: `Grade ${gradeNum} - Morning`,
            time: "08:00 - 11:00",
            grade: gradeNum,
            campaignId: activeCampaign.campaignId,
            students: savedData, // merged with saved data
            allPupils: gradePupils, // raw pupils array for consistent count
            totalPupils: gradePupils.length,
            scheduleDate: scheduleDate?.date || `Day Grade ${gradeNum}`,
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
    const getGradeProgress = (gradeName) => {
        if (!activeCampaign) return { filled: 0, total: 0, progress: 0 }
        const gradePupils = pupilsByGrade[gradeName] || []
        const savedData = getShiftSavedData(activeCampaign.campaignId, gradeName, gradePupils)
        let filled = savedData.filter((student) => student.completed).length
        const total = gradePupils.length
        if (total === 0) filled = 0
        const progress = total === 0 ? 0 : (filled / total) * 100
        return { filled, total, progress }
    }

    // Animate cards after data loads
    useEffect(() => {
        if (activeCampaign && !isLoading) {
            setTimeout(() => setAnimateCards(true), 100)
        }
    }, [activeCampaign, isLoading])

    // Only show grades 1-5
    // Show all grades, even if there are no pupils for that grade
    // Build a list of all grade names from pupilsByGrade and GRADES
    const allGradeNames = GRADES.map((g) => g.toString())

    if (isLoading) {
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

    if (!activeCampaign) {
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
                        No Campaign Data
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        No health check campaign data found.
                    </Typography>
                    {onBack && (
                        <Button variant="contained" sx={{ mt: 2 }} onClick={onBack}>Back</Button>
                    )}
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
                        {onBack && (
                            <Button variant="outlined" sx={{ mt: 2, color: 'white', borderColor: 'white' }} onClick={onBack}>Back</Button>
                        )}
                    </Paper>
                    {/* Grade Cards */}
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid container spacing={3} justifyContent="center">
                            {allGradeNames.map((gradeName, index) => {
                                const gradePupils = pupilsByGrade[gradeName] || [];
                                const scheduleDate = scheduleDates[index];
                                const { filled, total, progress } = getGradeProgress(gradeName);
                                let status = gradePupils.length === 0 ? "NONE" : "Available";
                                const config = statusConfig[status];
                                const StatusIcon = config.icon;
                                return (
                                    <Grow in={true} timeout={300 + index * 100} key={gradeName}>
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
                                                            Grade {gradeName}

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
                                                        <strong>Date:</strong> {scheduleDate?.date || `Day ${gradeName}`}
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
                                                            onClick={() => handleViewStudents(gradeName)}
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

// Helper: extract grade number from gradeName (e.g., "Class 1A" -> 1)
function extractGradeNumber(gradeName) {
    const match = gradeName && gradeName.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

export default HealthCheckScheduleForm
