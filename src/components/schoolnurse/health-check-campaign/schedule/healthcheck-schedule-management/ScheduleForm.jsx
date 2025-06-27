import { useState, useEffect } from "react"
import "./StyleScheduleForm.scss"
import ScheduleInjectedList from "../healthcheck-schedule-management-details/ScheduleInjectedList"
import { usePupilsByGrade } from "../../../../../hooks/schoolnurse/healthcheck/schedule/usePupilsByGrade"
import { CircularProgress, Fade, Grow, Chip } from "@mui/material"
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

const HealthCheckScheduleForm = () => {
    const { newestCampaign, loading, error, fetchNewestCampaignByStatus } = useNewestCampaignByStatus()
    const [showInjectionList, setShowInjectionList] = useState(false)
    const [selectedShift, setSelectedShift] = useState(null)
    const [animateCards, setAnimateCards] = useState(false)

    const [pupilsByGradeData, setPupilsByGradeData] = useState(GRADES.map(() => null))

    // Fetch campaign data on component mount
    useEffect(() => {
        fetchNewestCampaignByStatus()
    }, [])

    // Fetch pupils data for each grade
    useEffect(() => {
        if (newestCampaign) {
            const fetchPupilsData = async () => {
                const dataPromises = GRADES.map((grade) => usePupilsByGrade(grade))
                const dataResults = await Promise.all(dataPromises)
                setPupilsByGradeData(dataResults)
            }
            fetchPupilsData()
        }
    }, [newestCampaign])

    // Animate cards after data loads
    useEffect(() => {
        if (newestCampaign && !loading) {
            setTimeout(() => setAnimateCards(true), 100)
        }
    }, [newestCampaign, loading])

    // Check if campaign is active (IN_PROGRESS)
    const isActiveCampaign = newestCampaign && newestCampaign.statusHealthCampaign === "IN_PROGRESS"

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

    const scheduleDates = generateScheduleDates(newestCampaign)

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
                    {newestCampaign
                        ? `Current campaign status: ${newestCampaign.statusHealthCampaign}`
                        : "There are currently no health check campaigns in progress."}
                </p>
                <button className="retry-btn" onClick={fetchNewestCampaignByStatus}>
                    Refresh
                </button>
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
                <div className="schedule-header">
                    <div className="header-content">
                        <Schedule sx={{ fontSize: 40, color: "#1976d2", mr: 2 }} />
                        <div>
                            <h1 className="main-title">{newestCampaign.title}</h1>
                            <p className="main-subtitle">{newestCampaign.description}</p>
                            <div className="campaign-details">
                                <div className="campaign-detail-item">
                                    <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                                    <span>{newestCampaign.address}</span>
                                </div>
                                <div className="campaign-detail-item">
                                    <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                                    <span>
                                        {new Date(newestCampaign.startExaminationDate).toLocaleDateString()} -{" "}
                                        {new Date(newestCampaign.endExaminationDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <Chip
                            label={newestCampaign.statusHealthCampaign}
                            color="success"
                            variant="outlined"
                            sx={{ fontSize: "0.9rem", padding: "4px" }}
                        />
                        <Chip
                            label={`Campaign ID: ${newestCampaign.campaignId}`}
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: "0.9rem", padding: "4px" }}
                        />
                    </div>
                </div>
            </Fade>

            <div className="campaign-schedule">
                {GRADES.map((grade, index) => {
                    const gradeData = pupilsByGradeData[index]
                    const rawPupils = gradeData?.pupils || []
                    const isGradeLoading = gradeData?.isLoading || false
                    const scheduleDate = scheduleDates.find((d) => d.grade === grade)

                    if (isGradeLoading) {
                        return (
                            <div className="vaccine-schedule-card loading-card" key={grade}>
                                <CircularProgress size={40} />
                                <p>Loading Grade {grade} data...</p>
                            </div>
                        )
                    }

                    // Transform the pupils data
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
                        campaignId: newestCampaign.campaignId,
                        scheduleDate: scheduleDate?.date || new Date(),
                        pupils: pupils, // Pass the transformed pupils data
                    }

                    // Determine status based on capacity and filled
                    if (shift.capacity === 0) {
                        shift.status = "Available"
                    } else if (shift.filled >= shift.capacity) {
                        shift.status = "Full"
                    } else if (shift.capacity - shift.filled <= 2) {
                        shift.status = "Almost Full"
                    } else {
                        shift.status = "Available"
                    }

                    const progressPercentage = shift.capacity > 0 ? (shift.filled / shift.capacity) * 100 : 0

                    return (
                        <Grow in={animateCards} timeout={300 + index * 100} key={grade}>
                            <div className="vaccine-schedule-card">
                                <div className="vaccine-schedule-header">
                                    <div className="vaccine-schedule-header-icon">
                                        <Group sx={{ fontSize: 28, color: "#1976d2" }} />
                                    </div>
                                    <div className="vaccine-schedule-header-info">
                                        <h2 className="vaccine-campaign-title">Grade {grade} Health Check</h2>
                                        <div className="vaccine-schedule-desc">
                                            Comprehensive health screening for Grade {grade} students
                                        </div>
                                        <div className="schedule-date-info">
                                            <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                                            <span>{scheduleDate?.dateString || "Date TBD"}</span>
                                        </div>
                                        <div className="grade-stats">
                                            <Chip icon={<Group />} label={`${pupils.length} Students`} size="small" variant="outlined" />
                                            <Chip
                                                icon={<CheckCircle />}
                                                label={`${saved.filled} Completed`}
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="shift-details-section">
                                    <div className={`shift-card ${statusColors[shift.status]} hover-effect`}>
                                        <div className="shift-header">
                                            <div className="shift-title">{shift.name}</div>
                                            <div className="shift-status-badge">
                                                {shift.status === "Full" && <Error sx={{ fontSize: 16, mr: 0.5 }} />}
                                                {shift.status === "Almost Full" && <Warning sx={{ fontSize: 16, mr: 0.5 }} />}
                                                {shift.status === "Available" && <CheckCircle sx={{ fontSize: 16, mr: 0.5 }} />}
                                                {shift.status}
                                            </div>
                                        </div>

                                        <div className="shift-time">
                                            <Schedule sx={{ fontSize: 16, mr: 1 }} />
                                            {shift.time}
                                        </div>

                                        <div className="shift-capacity">
                                            <span className="capacity-label">Progress:</span>
                                            <div className="shift-capacity-bar">
                                                <div
                                                    className="shift-capacity-fill"
                                                    style={{
                                                        width: `${progressPercentage}%`,
                                                        background: statusBarColors[shift.status],
                                                    }}
                                                />
                                            </div>
                                            <span className="shift-capacity-count">
                                                {shift.filled}/{shift.capacity}
                                            </span>
                                        </div>

                                        <div className="shift-actions">
                                            <button
                                                className="view-btn modern-btn"
                                                onClick={() => {
                                                    setShowInjectionList(true)
                                                    setSelectedShift(shift)
                                                }}
                                            >
                                                <Group sx={{ fontSize: 18, mr: 1 }} />
                                                View Students
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <button
                                        className="confirm-campaign-btn modern-btn-primary"
                                        onClick={() => alert(`Grade ${grade} health check confirmed for ${scheduleDate?.dateString}!`)}
                                    >
                                        <CheckCircle sx={{ fontSize: 18, mr: 1 }} />
                                        Confirm Grade {grade}
                                    </button>
                                </div>
                            </div>
                        </Grow>
                    )
                })}
            </div>

            <Fade in={animateCards} timeout={800}>
                <div className="final-actions">
                    <button
                        className="complete-all-btn modern-btn-success"
                        onClick={() => alert(`Campaign "${newestCampaign.title}" marked as completed!`)}
                    >
                        <CheckCircle sx={{ fontSize: 20, mr: 1 }} />
                        Complete Campaign
                    </button>
                </div>
            </Fade>
        </div>
    )
}

export default HealthCheckScheduleForm
