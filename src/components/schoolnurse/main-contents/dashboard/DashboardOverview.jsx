import { Card, CardContent, CardHeader, Typography, Button, Avatar, Chip, Box, Grid } from "@mui/material"
import {
    People as UsersIcon,
    Medication as PillIcon,
    Warning as AlertTriangleIcon,
    Description as FileTextIcon,
    Person as UserIcon,
    Star as StarIcon,
    Schedule as ClockIcon,
    CalendarToday as CalendarIcon,
} from "@mui/icons-material"
import "./DashboardOverview.scss"
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const DashboardOverview = () => {
    // Mock data based on the database schema
    const dashboardStats = {
        totalStudents: 1247,
        totalMedication: 89,
        medicalEvents: 8,
        totalPrescription: 156,
    }

    const recentMedicalEvents = [
        {
            id: 1,
            pupilName: "Emma Johnson",
            grade: "Grade 3",
            injury: "Minor cut on finger",
            severity: "low",
            dateTime: "10:30 AM",
            status: "Completed",
            avatar: "EJ",
            color: "emerald",
        },
        {
            id: 2,
            pupilName: "Michael Chen",
            grade: "Grade 5",
            injury: "Headache and fever",
            severity: "medium",
            dateTime: "09:15 AM",
            status: "Ongoing",
            avatar: "MC",
            color: "amber",
        },
        {
            id: 3,
            pupilName: "Sarah Williams",
            grade: "Grade 2",
            injury: "Allergic reaction",
            severity: "high",
            dateTime: "Yesterday",
            status: "Resolved",
            avatar: "SW",
            color: "rose",
        },
        {
            id: 4,
            pupilName: "Alex Rodriguez",
            grade: "Grade 4",
            injury: "Scraped knee",
            severity: "low",
            dateTime: "08:45 AM",
            status: "Completed",
            avatar: "AR",
            color: "emerald",
        },
    ]

    const medicationSchedule = [
        {
            id: 1,
            pupilName: "Jessica Park",
            medication: "Insulin",
            dosage: "5 units",
            time: "12:00 PM",
            status: "Pending",
            avatar: "JP",
            color: "blue",
            urgent: true,
        },
        {
            id: 2,
            pupilName: "David Thompson",
            medication: "Methylphenidate",
            dosage: "10mg",
            time: "08:00 AM",
            status: "Given",
            avatar: "DT",
            color: "purple",
            urgent: false,
        },
        {
            id: 3,
            pupilName: "Alex Rodriguez",
            medication: "Albuterol Inhaler",
            dosage: "2 puffs",
            time: "PRN",
            status: "Active",
            avatar: "AR",
            color: "teal",
            urgent: false,
        },
    ]

    const requests = [
        {
            id: 1,
            type: "Medication Request",
            studentName: "Kevin Mitchell",
            date: "01/02/2024",
            time: "09:30 - 10:30",
            avatar: "KM",
        },
        {
            id: 2,
            type: "Health Check Request",
            studentName: "Adeline Hughes",
            date: "07/02/2024",
            time: "14:00 - 15:00",
            avatar: "AH",
        },
    ]

    const getSeverityChipProps = (severity) => {
        switch (severity) {
            case "high":
                return { color: "error", variant: "outlined" }
            case "medium":
                return { color: "warning", variant: "outlined" }
            case "low":
                return { color: "success", variant: "outlined" }
            default:
                return { color: "default", variant: "outlined" }
        }
    }

    const getStatusChipProps = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
            case "resolved":
            case "given":
                return { color: "success", variant: "filled" }
            case "pending":
            case "ongoing":
                return { color: "info", variant: "filled" }
            case "active":
                return { color: "secondary", variant: "filled" }
            default:
                return { color: "default", variant: "filled" }
        }
    }

    const getButtonProps = (status) => {
        switch (status) {
            case "Given":
                return { color: "inherit", variant: "outlined", disabled: true }
            case "Pending":
                return { color: "primary", variant: "contained" }
            case "Active":
                return { color: "success", variant: "contained" }
            default:
                return { color: "primary", variant: "contained" }
        }
    }

    return (
        <Box className="dashboard-content" sx={{
            padding: { xs: 1, sm: 3 },
            background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)",
            minHeight: "100vh",
            width: "100%",
            boxSizing: "border-box",
        }}>
            {/* Top Stats Cards */}
            <Grid container spacing={3} className="stats-row" sx={{ mb: 3 }}>
                {[{
                    label: "Total Students",
                    value: dashboardStats.totalStudents.toLocaleString(),
                    icon: <UsersIcon />, color: "blue"
                }, {
                    label: "Total Medication",
                    value: dashboardStats.totalMedication,
                    icon: <PillIcon />, color: "emerald"
                }, {
                    label: "Medical Events",
                    value: dashboardStats.medicalEvents,
                    icon: <AlertTriangleIcon />, color: "amber"
                }, {
                    label: "Total Prescription",
                    value: dashboardStats.totalPrescription,
                    icon: <FileTextIcon />, color: "purple"
                }].map((stat, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.label}>
                        <Card className={`stat-card stat-card--${stat.color}`}
                            sx={{
                                borderRadius: 4,
                                boxShadow: 3,
                                background: `var(--stat-card-gradient-${stat.color})`,
                                color: "#fff",
                                transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
                                '&:hover': { transform: 'translateY(-6px) scale(1.03)', boxShadow: 6 },
                            }}
                        >
                            <CardContent className="stat-card__content" sx={{ p: 3 }}>
                                <Box className="stat-card__header" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <Box className={`stat-card__icon stat-card__icon--${stat.color}`}
                                        sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '50%', p: 1.5, boxShadow: 1 }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="caption" className="stat-card__label" sx={{ fontWeight: 500, letterSpacing: 1 }}>{stat.label}</Typography>
                                    <Typography variant="h4" className="stat-card__value" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Main Content Grid */}
            <Grid container spacing={3} className="main-grid" sx={{ width: "100%" }}>
                {/* Left Column - Recent Medical Events & Medication Schedule */}
                <Grid item xs={12} md={8}>
                    <Box className="left-column" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Recent Medical Events */}
                        <Card className="events-card glass-card" sx={{ borderRadius: 4, boxShadow: 2, mb: 2 }}>
                            <CardHeader
                                className="events-card__header"
                                title={
                                    <Box className="card-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box className="card-title__icon card-title__icon--rose" sx={{ bgcolor: 'rgba(244,63,94,0.12)', borderRadius: '50%', p: 1 }}>
                                            <AlertTriangleIcon color="error" />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Medical Events</Typography>
                                    </Box>
                                }
                            />
                            <CardContent className="events-card__content" sx={{ p: 2 }}>
                                {recentMedicalEvents.map((event, index) => (
                                    <Box
                                        key={event.id}
                                        className={`event-item ${index !== recentMedicalEvents.length - 1 ? "event-item--bordered" : ""}`}
                                        sx={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            py: 1.5, px: 1, borderBottom: index !== recentMedicalEvents.length - 1 ? '1px solid #f3f4f6' : 'none',
                                            transition: 'background 0.2s',
                                            '&:hover': { background: 'rgba(244,63,94,0.04)' },
                                        }}
                                    >
                                        <Box className="event-item__left" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar className={`event-avatar event-avatar--${event.color}`}
                                                sx={{ bgcolor: `var(--avatar-${event.color})`, color: '#fff', fontWeight: 600 }}>
                                                {event.avatar}
                                            </Avatar>
                                            <Box className="event-item__info">
                                                <Typography variant="body2" className="event-item__name" sx={{ fontWeight: 500 }}>{event.pupilName}</Typography>
                                                <Typography variant="caption" className="event-item__injury" sx={{ color: '#64748b' }}>{event.injury}</Typography>
                                            </Box>
                                        </Box>
                                        <Box className="event-item__right" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box className="event-item__details" sx={{ textAlign: 'right' }}>
                                                <Typography variant="caption" sx={{ color: '#64748b' }}>{event.grade}</Typography>
                                                <Typography variant="caption" className="event-item__time" sx={{ color: '#64748b' }}>{event.dateTime}</Typography>
                                            </Box>
                                            <Box className="event-item__badges" sx={{ display: 'flex', gap: 1 }}>
                                                <Chip size="small" label={event.status} {...getStatusChipProps(event.status)} />
                                                <Chip size="small" label={event.severity} {...getSeverityChipProps(event.severity)} />
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Today's Medication Schedule */}
                        <Card className="medication-card glass-card" sx={{ borderRadius: 4, boxShadow: 2 }}>
                            <CardHeader
                                className="medication-card__header"
                                title={
                                    <Box className="card-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box className="card-title__icon card-title__icon--emerald" sx={{ bgcolor: 'rgba(16,185,129,0.12)', borderRadius: '50%', p: 1 }}>
                                            <PillIcon color="success" />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Today's Medication Schedule</Typography>
                                    </Box>
                                }
                            />
                            <CardContent className="medication-card__content" sx={{ p: 2 }}>
                                {medicationSchedule.map((med, index) => (
                                    <Box
                                        key={med.id}
                                        className={`medication-item ${index !== medicationSchedule.length - 1 ? "medication-item--bordered" : ""} ${med.urgent ? "medication-item--urgent" : ""}`}
                                        sx={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            py: 1.5, px: 1, borderBottom: index !== medicationSchedule.length - 1 ? '1px solid #f3f4f6' : 'none',
                                            background: med.urgent ? 'linear-gradient(90deg, #fef9c3 0%, #f0fdfa 100%)' : 'none',
                                            transition: 'background 0.2s',
                                            '&:hover': { background: 'rgba(16,185,129,0.04)' },
                                        }}
                                    >
                                        <Box className="medication-item__left" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar className={`medication-avatar medication-avatar--${med.color}`}
                                                sx={{ bgcolor: `var(--avatar-${med.color})`, color: '#fff', fontWeight: 600 }}>
                                                {med.avatar}
                                            </Avatar>
                                            <Box className="medication-item__info">
                                                <Box className="medication-item__name-row" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2" className="medication-item__name" sx={{ fontWeight: 500 }}>{med.pupilName}</Typography>
                                                    {med.urgent && <ClockIcon className="urgent-icon" color="warning" fontSize="small" />}
                                                </Box>
                                                <Typography variant="caption" className="medication-item__details" sx={{ color: '#64748b' }}>
                                                    {med.medication} - {med.dosage}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box className="medication-item__right" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box className="medication-item__time-info" sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" className="medication-item__time" sx={{ color: '#0f172a', fontWeight: 600 }}>{med.time}</Typography>
                                                {med.urgent && (
                                                    <Typography variant="caption" className="medication-item__urgent-text" sx={{ color: '#f59e42', fontWeight: 500 }}>
                                                        Due soon
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Button size="small" className="medication-button" {...getButtonProps(med.status)}
                                                sx={{ borderRadius: 2, fontWeight: 600, px: 2, boxShadow: 1 }}>
                                                {med.status === "Given" ? "Given" : med.status === "Pending" ? "Give" : "Active"}
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={4}>
                    <Box className="right-column" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Requests */}
                        <Card className="requests-card glass-card" sx={{ borderRadius: 4, boxShadow: 2 }}>
                            <CardHeader
                                className="requests-card__header"
                                title={
                                    <Box className="requests-header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Requests</Typography>
                                        <Button size="small" className="view-all-button" sx={{ color: '#6366f1', fontWeight: 500, textTransform: 'none' }}>
                                            view all →
                                        </Button>
                                    </Box>
                                }
                            />
                            <CardContent className="requests-card__content" sx={{ p: 2 }}>
                                {requests.map((request, index) => (
                                    <Box
                                        key={request.id}
                                        className={`request-item ${index !== requests.length - 1 ? "request-item--bordered" : ""}`}
                                        sx={{
                                            display: 'flex', flexDirection: 'column', gap: 1, py: 1.5, px: 1,
                                            borderBottom: index !== requests.length - 1 ? '1px solid #f3f4f6' : 'none',
                                            transition: 'background 0.2s',
                                            '&:hover': { background: 'rgba(99,102,241,0.04)' },
                                        }}
                                    >
                                        <Box className="request-item__header" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar className="request-avatar" sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 600 }}>{request.avatar}</Avatar>
                                            <Box className="request-item__info">
                                                <Typography variant="body2" className="request-item__name" sx={{ fontWeight: 500 }}>{request.studentName}</Typography>
                                                <Typography variant="caption" className="request-item__type" sx={{ color: '#64748b' }}>{request.type}</Typography>
                                            </Box>
                                        </Box>
                                        <Box className="request-item__details" sx={{ display: 'flex', gap: 2, color: '#64748b', fontSize: 13, ml: 7 }}>
                                            <Typography variant="caption">📅 {request.date}</Typography>
                                            <Typography variant="caption">🕐 {request.time}</Typography>
                                        </Box>
                                        <Box className="request-item__actions" sx={{ display: 'flex', gap: 1, ml: 7 }}>
                                            <Button size="small" variant="contained" color="success" className="request-button" sx={{ borderRadius: 2, fontWeight: 600, px: 2, boxShadow: 1 }}>Accept</Button>
                                            <Button size="small" variant="contained" color="error" className="request-button" sx={{ borderRadius: 2, fontWeight: 600, px: 2, boxShadow: 1 }}>Reject</Button>
                                        </Box>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="actions-card glass-card" sx={{ borderRadius: 4, boxShadow: 2 }}>
                            <CardHeader title={<Typography variant="h6" sx={{ fontWeight: 600 }}>Quick Actions</Typography>} />
                            <CardContent className="actions-card__content" sx={{ p: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Button className="action-button action-button--rose" fullWidth sx={{
                                            bgcolor: 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)',
                                            color: '#fff', borderRadius: 3, fontWeight: 600, py: 2, gap: 1, boxShadow: 2,
                                            '&:hover': { bgcolor: '#f43f5e', opacity: 0.9 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        }}>
                                            <AlertTriangleIcon />
                                            <Typography variant="caption">Report</Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button className="action-button action-button--emerald" fullWidth sx={{
                                            bgcolor: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                                            color: '#fff', borderRadius: 3, fontWeight: 600, py: 2, gap: 1, boxShadow: 2,
                                            '&:hover': { bgcolor: '#10b981', opacity: 0.9 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        }}>
                                            <PillIcon />
                                            <Typography variant="caption">Medication</Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button className="action-button action-button--blue" fullWidth sx={{
                                            bgcolor: 'linear-gradient(135deg, #6366f1 0%, #60a5fa 100%)',
                                            color: '#fff', borderRadius: 3, fontWeight: 600, py: 2, gap: 1, boxShadow: 2,
                                            '&:hover': { bgcolor: '#6366f1', opacity: 0.9 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        }}>
                                            <UsersIcon />
                                            <Typography variant="caption">Students</Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button className="action-button action-button--purple" fullWidth sx={{
                                            bgcolor: 'linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)',
                                            color: '#fff', borderRadius: 3, fontWeight: 600, py: 2, gap: 1, boxShadow: 2,
                                            '&:hover': { bgcolor: '#a78bfa', opacity: 0.9 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        }}>
                                            <CalendarIcon />
                                            <Typography variant="caption">Schedule</Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default DashboardOverview
