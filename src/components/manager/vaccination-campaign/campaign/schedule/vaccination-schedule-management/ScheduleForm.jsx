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
import { useGetVaccinationCampaignByCampaignId } from "../../../../../../hooks/manager/vaccination/campaign/useGetVaccinationCampaignByCampaignId"
import { useGetAllConsentFormByStatus } from "../../../../../../hooks/schoolnurse/vaccination/vaccination/useGetAllConsentFormByStatus"

const GRADES = [1, 2, 3, 4, 5]

// Status configuration: all statuses use success color and icon
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

// Helper to normalize grade value to a number (matches logic in ScheduleInjectedList)
function extractGradeNumber(gradeValue) {
    if (!gradeValue) return 0;
    if (typeof gradeValue === 'number') return gradeValue;
    if (typeof gradeValue === 'string') {
        if (gradeValue.startsWith('GRADE_')) {
            return Number(gradeValue.replace('GRADE_', ''));
        }
        const num = Number(gradeValue);
        return isNaN(num) ? 0 : num;
    }
    return 0;
}

const VaccinationScheduleForm = ({ campaignId, onBack }) => {
    const { campaign: activeCampaign, loading: isLoading, error } = useGetVaccinationCampaignByCampaignId(campaignId)
    const [showInjectionList, setShowInjectionList] = useState(false)
    const [selectedShift, setSelectedShift] = useState(null)
    const [refresh, setRefresh] = useState(0)

    // Get consent forms by campaign ID for capacity calculation
    const { consentForms: injectedForms = [], isLoading: injectedLoading } = useGetAllConsentFormByStatus(
        activeCampaign?.campaignId || 0,
        "INJECTED"
    )
    const { consentForms: noShowForms = [], isLoading: noShowLoading } = useGetAllConsentFormByStatus(
        activeCampaign?.campaignId || 0,
        "NO_SHOW"
    )

    // Use .data if present (from fetchResponse), else fallback to direct object (for dev/testing)
    const campaignData = activeCampaign?.data || activeCampaign

    const scheduleDates = useMemo(() => {
        return campaignData ? calculateScheduleDates(campaignData) : []
    }, [campaignData])

    // Group pupils by grade for capacity calculation (normalize grade key)
    const pupilsByGrade = useMemo(() => {
        const allForms = [...(injectedForms || []), ...(noShowForms || [])]
        return allForms.reduce((acc, form) => {
            const gradeNum = extractGradeNumber(form.Grade || form.grade || form.gradeLevel)
            if (!acc[gradeNum]) acc[gradeNum] = []
            acc[gradeNum].push(form)
            return acc
        }, {})
    }, [injectedForms, noShowForms])

    // Handle navigation to student list
    const handleViewStudents = (grade) => {
        if (!campaignData) return

        const gradePupils = pupilsByGrade[grade] || []
        const savedData = getShiftSavedData(campaignData.campaignId, grade, gradePupils)
        const scheduleDate = scheduleDates[grade - 1]

        const shift = {
            id: `${campaignData.campaignId}-${grade}-morning`,
            name: `Grade ${grade} - Morning`,
            time: "08:00 - 11:00",
            grade: grade,
            campaignId: campaignData.campaignId,
            students: savedData,
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
        setRefresh((r) => r + 1) // Force refresh to update progress
    }

    // Calculate progress for each grade
    const getGradeProgress = (grade) => {
        if (!campaignData) return { filled: 0, total: 0, progress: 0 }

        const gradePupils = pupilsByGrade[grade] || []
        const savedData = getShiftSavedData(campaignData.campaignId, grade, gradePupils)
        let filled = savedData.filter((student) => student.completed).length
        const total = gradePupils.length
        if (total === 0) filled = 0 // Force filled to 0 if no students in grade
        const progress = total === 0 ? 0 : (filled / total) * 100

        return { filled, total, progress }
    }

    if (isLoading || injectedLoading || noShowLoading) {
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

    const handleBackClick = () => {
        console.log('Back button clicked, onBack function:', typeof onBack); // Debug log
        if (onBack && typeof onBack === 'function') {
            onBack();
        } else {
            console.error('onBack is not a valid function:', onBack);
        }
    }

    if (error || !activeCampaign) {
        return (
            <div className="vaccine-schedule-root">
                <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3, maxWidth: 600, mx: "auto" }}>
                    <ErrorIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        {error ? "Error Loading Campaign" : "No Active Campaign"}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {error ? "Please try again later." : "There is no vaccination campaign in progress."}
                    </Typography>
                    {onBack && (
                        <Button variant="contained" sx={{ mt: 2 }} onClick={handleBackClick}>
                            Back
                        </Button>
                    )}
                </Paper>
            </div>
        )
    }


    if (showInjectionList && selectedShift) {
        return (
            <Fade in={showInjectionList}>
                <div>
                    <ScheduleInjectedList shift={selectedShift} campaign={campaignData} onBack={handleBackFromStudentList} />
                </div>
            </Fade>
        )
    }

    return (
        <div className="vaccine-schedule-root">
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
                            <VaccinesIcon sx={{ fontSize: 40, mr: 2 }} />
                            <Box>
                                <Typography variant="h4" fontWeight="bold">
                                    {campaignData?.titleCampaign}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                    {campaignData?.vaccineName} • {campaignData?.diseaseName}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <Chip
                                icon={<ScheduleIcon />}
                                label={`${campaignData?.startDate} - ${campaignData?.endDate}`}
                                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                            />
                            <Chip label={campaignData?.status} color="success" sx={{ fontWeight: "bold" }} />
                        </Box>
                        {onBack && (
                            <Button variant="outlined" sx={{ mt: 2, color: 'white', borderColor: 'white' }} onClick={onBack}>Back</Button>
                        )}
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
                                    status = "NONE"
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

