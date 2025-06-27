import { useState, useEffect } from "react"
import "./StyleScheduleForm.scss"
import ScheduleInjectedList from "../healthcheck-schedule-management-details/ScheduleInjectedList"
import { usePupilsByGrade } from "../../../../../hooks/schoolnurse/healthcheck/schedule/usePupilsByGrade"
import { CircularProgress, Fade, Grow, Chip, Paper, Card, CardContent, Grid, Box, Typography, Button, Skeleton } from "@mui/material"
import { Schedule, Group, CheckCircle, Warning, Error, LocationOn, CalendarToday } from "@mui/icons-material"
import { useNewestCampaignByStatus } from "../../../../../hooks/schoolnurse/healthcheck/schedule/useNewestCampaignByStatus"


const statusColors = {
    Available: "available",
    Full: "full",
    "Almost Full": "almostfull",
}

const statusBarColors = {
    Available: "#43a047",
    Full: "#e53935",
    "Almost Full": "#fbc02d",
}

const GRADES = [1, 2, 3, 4, 5]

// Status configuration with enhanced styling and icons
const statusConfig = {
    Available: {
        color: "#4caf50",
        bgColor: "#e8f5e9",
        icon: CheckCircle,
        label: "Available",
    },
    "Almost Full": {
        color: "#ff9800",
        bgColor: "#fff3e0",
        icon: Warning,
        label: "Almost Full",
    },
    Full: {
        color: "#f44336",
        bgColor: "#ffebee",
        icon: Error,
        label: "Full",
    },
}

const HealthCheckScheduleForm = () => {
    const { newestCampaign, loading, error } = useNewestCampaignByStatus()
    const [showInjectionList, setShowInjectionList] = useState(false)
    const [selectedShift, setSelectedShift] = useState(null)
    const [animateCards, setAnimateCards] = useState(false)
    const [pupilsByGradeData, setPupilsByGradeData] = useState(GRADES.map(() => null))

    // Support both array and object for newestCampaign
    let activeCampaign = null
    if (Array.isArray(newestCampaign)) {
        activeCampaign = newestCampaign.find(c => c.statusHealthCampaign === "IN_PROGRESS") || null
    } else if (newestCampaign && newestCampaign.statusHealthCampaign === "IN_PROGRESS") {
        activeCampaign = newestCampaign
    }
    const isActiveCampaign = !!activeCampaign

    // Animate cards after data loads
    useEffect(() => {
        if (newestCampaign && !loading) {
            setTimeout(() => setAnimateCards(true), 100)
        }
    }, [newestCampaign, loading])

    // Fetch pupils for each grade and update pupilsByGradeData
    useEffect(() => {
        let isMounted = true;
        setPupilsByGradeData(GRADES.map(() => ({ pupils: [], isLoading: true })));
        if (!isActiveCampaign) return;
        Promise.all(
            GRADES.map(async (grade) => {
                try {
                    const { pupils, isLoading } = await usePupilsByGrade(grade);
                    return { pupils, isLoading };
                } catch (e) {
                    return { pupils: [], isLoading: false };
                }
            })
        ).then((results) => {
            if (isMounted) setPupilsByGradeData(results);
        });
        return () => { isMounted = false; };
    }, [isActiveCampaign]);

    // Generate schedule dates based on campaign dates (5 days for 5 grades)
    const generateScheduleDates = (campaign) => {
        if (!campaign || !campaign.startExaminationDate) return []

        const startDate = new Date(campaign.startExaminationDate)
        const scheduleDates = []

        for (let i = 0; i < 5; i++) {
            const scheduleDate = new Date(startDate)
            scheduleDate.setDate(startDate.getDate() + i)
            scheduleDates.push({
                grade: i + 1,
                date: scheduleDate,
                dateString: scheduleDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            })
        }

        return scheduleDates
    }

    const scheduleDates = generateScheduleDates(activeCampaign)

    // Helper to get and set saved shift data
    function getShiftSavedData(grade, pupils) {
        const sharedKey = `healthcheck_students_grade_${grade}`
        let students = null
        try {
            students = JSON.parse(localStorage.getItem(sharedKey) || "null")
        } catch { }

        const capacity = pupils.length
        const filled = students ? students.filter((s) => s.completed).length : 0

        return {
            morning: students || [],
            afternoon: students || [],
            capacity,
            filled,
        }
    }

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
                }
            }
            // Collect all diseases for this pupil
            if (pupilId && item.disease) {
                uniquePupils[pupilId].diseases.push(...item.disease)
            }
        })

        return Object.values(uniquePupils)
    }

    // Loading state
    if (loading) {
        return (
            <div className="vaccine-schedule-root loading-container">
                <CircularProgress size={60} sx={{ color: "#1976d2" }} />
                <p className="loading-text">Loading health check campaign...</p>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="vaccine-schedule-root error-container">
                <Error sx={{ fontSize: 60, color: "#e53935", mb: 2 }} />
                <p className="error-text">Failed to load campaign. Please try again.</p>
                <button className="retry-btn" onClick={fetchNewestCampaignByStatus}>
                    Retry
                </button>
            </div>
        )
    }

    // No active campaign state
    if (!isActiveCampaign) {
        return (
            <div className="vaccine-schedule-root empty-container">
                <Schedule sx={{ fontSize: 80, color: "#bdbdbd", mb: 2 }} />
                <h3 className="empty-title">No Active Campaign</h3>
                <p className="empty-text">
                    {Array.isArray(newestCampaign) && newestCampaign.length > 0
                        ? `Current campaign statuses: ${newestCampaign.map(c => c.statusHealthCampaign).join(", ")}`
                        : "There are currently no health check campaigns in progress."}
                </p>

            </div>
        )
    }

    // Show injection list if selected
    if (showInjectionList && selectedShift) {
        return (
            <Fade in={true} timeout={300}>
                <div>
                    <ScheduleInjectedList
                        shift={selectedShift}
                        onBack={() => {
                            setShowInjectionList(false)
                            setSelectedShift(null)
                        }}
                    />
                </div>
            </Fade>
        )
    }

    return (
        <div className="vaccine-schedule-root">
            <Fade in={true} timeout={500}>
                <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
                    {/* Campaign Header */}
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 4,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            boxShadow: "0 8px 32px rgba(102,126,234,0.18)",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Schedule sx={{ fontSize: 44, mr: 2 }} />
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
                                icon={<CalendarToday />}
                                label={`${new Date(activeCampaign.startExaminationDate).toLocaleDateString()} - ${new Date(activeCampaign.endExaminationDate).toLocaleDateString()}`}
                                sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white", fontWeight: 600 }}
                            />
                            <Chip label={activeCampaign.statusHealthCampaign} color="success" sx={{ fontWeight: "bold" }} />
                            <Chip label={`Campaign ID: ${activeCampaign.campaignId}`} color="primary" sx={{ fontWeight: "bold" }} />
                        </Box>
                    </Paper>

                    {/* Grade Cards */}
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid container spacing={3} justifyContent="center">
                            {GRADES.map((grade, index) => {
                                const gradeData = pupilsByGradeData[index]
                                const rawPupils = gradeData?.pupils || []
                                const isGradeLoading = gradeData?.isLoading || false
                                const scheduleDate = scheduleDates.find((d) => d.grade === grade)
                                if (isGradeLoading) {
                                    return (
                                        <Grid item xs={12} md={6} lg={4} key={grade}>
                                            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, minHeight: 220 }}>
                                                <CircularProgress size={40} />
                                                <Typography mt={2}>Loading Grade {grade} data...</Typography>
                                            </Paper>
                                        </Grid>
                                    )
                                }
                                const pupils = transformPupilsData(rawPupils)
                                const saved = getShiftSavedData(grade, pupils)
                                const shift = {
                                    id: `${grade}-session`,
                                    name: `Grade ${grade} Health Check`,
                                    time: "08:00 - 11:00",
                                    grade,
                                    students: saved.morning,
                                    capacity: saved.capacity,
                                    filled: saved.filled,
                                    campaignId: activeCampaign.campaignId,
                                    scheduleDate: scheduleDate?.date || new Date(),
                                    pupils: pupils,
                                }
                                if (shift.capacity === 0) {
                                    shift.status = "Available"
                                } else if (shift.filled >= shift.capacity) {
                                    shift.status = "Full"
                                } else if (shift.capacity - shift.filled <= 2) {
                                    shift.status = "Almost Full"
                                } else {
                                    shift.status = "Available"
                                }
                                const config = statusConfig[shift.status]
                                return (
                                    <Grow in={animateCards} timeout={300 + index * 100} key={grade}>
                                        <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Card sx={{ minWidth: 300, maxWidth: 300, minHeight: 220, borderRadius: 4, boxShadow: "0 8px 32px rgba(102,126,234,0.10)", background: "linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%)", transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", cursor: "pointer", mb: 2, border: '2px solid #bdbdbd', '&:hover': { boxShadow: "0 16px 40px rgba(102,126,234,0.18)", transform: "translateY(-4px) scale(1.02)", border: '2px solid #667eea' } }}>
                                                <CardContent>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                                            Grade {grade} Health Check
                                                        </Typography>
                                                        <Chip
                                                            icon={config && config.icon ? <config.icon sx={{ color: config.color }} /> : null}
                                                            label={config ? config.label : shift.status}
                                                            sx={{ fontWeight: 600, bgcolor: config ? config.bgColor : undefined, color: config ? config.color : undefined, px: 1.5, fontSize: "1rem" }}
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Date:</strong> {scheduleDate?.dateString || "Date TBD"}</Typography>
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Students:</strong> {pupils.length}</Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        <Typography variant="body2"><strong>Time:</strong> {shift.time}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => {
                                                                setShowInjectionList(true)
                                                                setSelectedShift(shift)
                                                            }}
                                                            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, boxShadow: "0 2px 8px rgba(102,126,234,0.10)", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", '&:hover': { background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)" } }}
                                                        >
                                                            <Group sx={{ fontSize: 18, mr: 1 }} />
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

                    {/* Action Button */}
                    <Fade in={animateCards} timeout={800}>
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<CheckCircle />}
                                onClick={() => alert(`Campaign "${activeCampaign.title}" marked as completed!`)}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                    boxShadow: "0 4px 16px rgba(76,175,80,0.12)",
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
                    </Fade>
                </div>
            </Fade >
        </div >
    )
}

export default HealthCheckScheduleForm
