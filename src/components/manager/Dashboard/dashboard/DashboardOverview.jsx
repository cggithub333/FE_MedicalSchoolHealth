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
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Link } from "react-router-dom"
import { useGetPupilsInformation } from "@hooks/schoolnurse/new-event/useGetPupilsInformation.js";
import { useGetAllMedicalEvent } from "../../../../hooks/schoolnurse/new-event/useGetAllMedicalEvent.js"
import { useGetAllPrescription } from "../../../../hooks/schoolnurse/main-contents/useGetAllPrescription.js";
import useAllPendingPrescriptions from "@hooks/schoolnurse/useAllPendingPrescriptions"



const DashboardOverview = () => {
    const { pupilsList = [], loading, error } = useGetPupilsInformation();
    const { medicalEventList = [] } = useGetAllMedicalEvent();
    const { pendingMedicationRequests, loading: loadingPendingPrescriptions, error: errorPendingPrescriptions } = useAllPendingPrescriptions();
    // Fix prescriptions: extract array from response if needed
    const { prescriptions: prescriptionsRaw = [], loading: loadingPrescriptions, error: errorPrescriptions } = useGetAllPrescription();
    const prescriptions = Array.isArray(prescriptionsRaw) ? prescriptionsRaw : (Array.isArray(prescriptionsRaw.data) ? prescriptionsRaw.data : []);

    // Remove debug log or update if needed
    // console.log("Prescriptions:", prescriptions.length);

    // Mock data based on the database schema
    const dashboardStats = {
        totalStudents: pupilsList.length,
        totalMedication: medicalEventList.length,
        medicalEvents: medicalEventList.length,
        totalPrescription: prescriptions.length,
    }

    // Map medicalEventList to recentMedicalEvents (show only first 4)
    const recentMedicalEvents = (medicalEventList || []).slice(0, 4).map((event, idx) => ({
        id: event.medicalEventId,
        pupilName: `${event.pupil.lastName} ${event.pupil.firstName}`,
        grade: event.pupil.gradeName,
        injury: event.injuryDescription,
        severity: event.status,
        dateTime: event.createdAt || event.dateTime,
        avatar: event.pupil.firstName ? event.pupil.firstName.charAt(0) : '',
        color: ["emerald", "amber", "rose", "blue"][idx % 4], // cycle colors for demo
    }));

    // Map prescriptions to medicationSchedule (show only 4 newest by requestedDate)
    const medicationSchedule = (prescriptions || [])
        .slice() // copy array
        .sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate))
        .slice(0, 4)
        .map((item, idx) => ({
            id: item.sendMedicationId,
            pupilName: `${item.pupilLastName} ${item.pupilFirstName}`,
            medication: item.medicationItems?.[0]?.medicationName || '',
            dosage: item.medicationItems?.[0]?.unitAndUsage || '',
            time: item.medicationItems?.[0]?.medicationSchedule || '',
            avatar: item.pupilFirstName ? item.pupilFirstName.charAt(0) : '',
            color: ["blue", "purple", "teal", "emerald"][idx % 4],
        }))

    // Map pendingMedicationRequests to requests (show only 2)
    const requests = (pendingMedicationRequests || [])
        .slice() // copy array
        .sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate))
        .slice(0, 2)
        .map((item) => ({
            id: item.sendMedicationId,
            type: "Medication Request",
            studentName: `${item.pupilLastName} ${item.pupilFirstName}`,
            date: item.startDate,
            time: item.medicationItems?.[0]?.medicationSchedule || '',
            avatar: item.pupilFirstName ? item.pupilFirstName.charAt(0) : '',
            prescriptionImage: item.prescriptionImage,
            status: item.status,
        }));

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

    return (
        <Box className="dashboard-content" sx={{
            padding: { xs: 1, sm: 3 },
            background: "linear-gradient(135deg, #E6F8F9)",
            width: "100%",
            minHeight: "100%",
            height: "auto",
            boxSizing: "border-box",
        }}>
            {/* Top Stats Cards */}
            <Grid container spacing={3} className="stats-row" sx={{ mb: 3 }}>
                {[{
                    label: "Total Pupils",
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
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
                        <Card className={`stat-card stat-card--${stat.color}`}
                            sx={{
                                borderRadius: 4,
                                boxShadow: 3,
                                background: `var(--stat-card-gradient-${stat.color})`,
                                color: "#1e293b",
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
                <Grid size={{ xs: 12, md: 8 }}>
                    <Grid size={{ xs: 12 }}>
                        <Box className="left-column" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Recent Medical Events */}
                            <Grid size={{ xs: 12 }}>
                                <Card className="events-card glass-card" sx={{ borderRadius: 4, boxShadow: 2 }}>
                                    <CardHeader
                                        className="events-card__header"
                                        title={
                                            <Box className="card-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box className="card-title__icon card-title__icon--rose" sx={{ bgcolor: 'rgba(244,63,94,0.12)', borderRadius: '50%', p: 1 }}>
                                                    <AlertTriangleIcon color="error" />
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Medical Events</Typography>

                                                <Link to="/manager/medical-events" style={{ textDecoration: "none" }}>
                                                    <Button size="small" className="view-all-button" sx={{ color: '#6366f1', fontWeight: 500, textTransform: 'none', display: 'flex', position: 'absolute', right: 16, top: 16 }}>
                                                        view all →
                                                    </Button>
                                                </Link>
                                            </Box>
                                        }
                                    />
                                    <Grid size={{ xs: 12 }}>
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
                                                    <Grid size={{ xs: 5 }}>
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
                                                    </Grid>
                                                    <Grid size={{ xs: 5 }}>
                                                        <Box className="event-item__left" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Box className="event-item__details" >
                                                                <Typography variant="caption" sx={{ color: '#64748b' }}>{event.grade}</Typography>
                                                                <Typography variant="caption" className="event-item__time" sx={{ color: '#64748b' }}>{event.dateTime}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid size={{ xs: 2 }} >
                                                        <Box className="event-item__right" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                                                            <Box className="event-item__badges" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                                <Chip size="small" label={event.severity} {...getSeverityChipProps(event.severity)} />
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </CardContent>
                                    </Grid>
                                </Card>
                            </Grid>

                            {/* Today's Medication Schedule */}
                            <Card className="medication-card glass-card" sx={{ borderRadius: 4, boxShadow: 2 }}>
                                <CardHeader
                                    className="medication-card__header"
                                    title={
                                        <Box className="card-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box className="card-title__icon card-title__icon--emerald" sx={{ bgcolor: 'rgba(16,185,129,0.12)', borderRadius: '50%', p: 1 }}>
                                                <PillIcon color="success" />
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Today's Prescription Schedule</Typography>
                                            <Link to="/manager/prescriptions" style={{ textDecoration: "none" }}>
                                                <Button size="small" className="view-all-button" sx={{ color: '#6366f1', fontWeight: 500, textTransform: 'none', display: 'flex', position: 'absolute', right: 16, top: 16 }}>
                                                    view all →
                                                </Button>
                                            </Link>
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

                                                </Box>

                                            </Box>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid >
                </Grid >

                {/* Right Column */}
                < Grid size={{ xs: 12, md: 4 }}>
                    <Box className="right-column" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Requests */}
                        <Card className="requests-card glass-card" sx={{ borderRadius: 4, boxShadow: 2, p: 1 }}>
                            <CardHeader
                                className="requests-card__header"
                                title={
                                    <Box className="requests-header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Requests</Typography>
                                        <Link to="/manager/prescriptions" style={{ textDecoration: "none" }}>
                                            <Button size="small" className="view-all-button" sx={{ color: '#6366f1', fontWeight: 500, textTransform: 'none', display: 'flex', position: 'absolute', right: 16, top: 16 }}>
                                                view all →
                                            </Button>
                                        </Link>
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

                                        <Box className="request-item__details" sx={{ display: 'flex', gap: 0, color: '#64748b', fontSize: 13, ml: 0 }}>
                                            <Typography variant="caption">📅 {request.date}</Typography>
                                            <Typography variant="caption">🕐 {request.time}</Typography>
                                        </Box>

                                    </Box>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="actions-card glass-card" sx={{ borderRadius: 4, boxShadow: 2, p: 2 }}>
                            <CardHeader title={<Typography variant="h6" sx={{ fontWeight: 600 }}>Quick Actions</Typography>} />
                            <CardContent className="actions-card__content" sx={{ p: 2 }}>
                                <Grid container spacing={1}>
                                    <Grid size={6}>
                                        <Link to="/manager/vaccination-campaign/campaigns" style={{ textDecoration: "none" }}>
                                            <Button className="action-button action-button--rose" fullWidth sx={{
                                                bgcolor: 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)',
                                                color: '#fff', borderRadius: 3, fontWeight: 600, py: 2, gap: 1, boxShadow: 2,
                                                '&:hover': { bgcolor: '#f43f5e', opacity: 0.9 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            }}>
                                                <VaccinesIcon />
                                                <Typography variant="caption">Vaccination</Typography>
                                            </Button>
                                        </Link>

                                    </Grid>
                                    <Grid size={6}>
                                        <Link to="/manager/health-check-campaign/campaigns" style={{ textDecoration: "none" }}>
                                            <Button className="action-button action-button--emerald" fullWidth sx={{
                                                bgcolor: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                                                color: '#fff', borderRadius: 3, fontWeight: 600, py: 2, gap: 1, boxShadow: 2,
                                                '&:hover': { bgcolor: '#10b981', opacity: 0.9 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            }}>
                                                <PillIcon />
                                                <Typography variant="caption">Health Check</Typography>
                                            </Button>
                                        </Link>

                                    </Grid>
                                    <Grid size={6}>
                                        <Link to="/manager/pupils-management" style={{ textDecoration: "none" }}>
                                            <Button className="action-button action-button--blue" fullWidth sx={{
                                                bgcolor: 'linear-gradient(135deg, #6366f1 0%, #60a5fa 100%)',
                                                color: '#fff', borderRadius: 3, fontWeight: 600, py: 2, gap: 1, boxShadow: 2,
                                                '&:hover': { bgcolor: '#6366f1', opacity: 0.9 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            }}>
                                                <UsersIcon />
                                                <Typography variant="caption">Pupils</Typography>
                                            </Button>
                                        </Link>

                                    </Grid>
                                    <Grid size={6}>
                                        <Link to="/manager/medical-events" style={{ textDecoration: "none" }}>
                                            <Button className="action-button action-button--purple" fullWidth sx={{
                                                bgcolor: 'linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)',
                                                color: '#fff', borderRadius: 3, fontWeight: 600, py: 2, gap: 1, boxShadow: 2,
                                                '&:hover': { bgcolor: '#a78bfa', opacity: 0.9 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            }}>
                                                <AssignmentIndIcon />
                                                <Typography variant="caption">New Medical Event</Typography>
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid >
            </Grid >
        </Box >
    )
}

export default DashboardOverview
