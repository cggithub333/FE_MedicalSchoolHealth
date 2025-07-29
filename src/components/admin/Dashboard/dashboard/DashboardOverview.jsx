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
import { useGetPupilsInformation } from "../../../../hooks/schoolnurse/new-event/useGetPupilsInformation.js";
import { useGetAllMedicalEvent } from "../../../../hooks/schoolnurse/new-event/useGetAllMedicalEvent.js"
import { useGetAllPrescription } from "../../../../hooks/schoolnurse/main-contents/useGetAllPrescription.js";
import useAllPendingPrescriptions from "@hooks/schoolnurse/useAllPendingPrescriptions"
import { rgba } from "framer-motion";


// Mock data
const userAccounts = [
    {
        user_id: "PR0001",
        first_name: "Hùng",
        last_name: "Nguyễn",
        email: "hung.nguyen@truonghoc.edu.vn",
        phone_number: "0281234678",
        role: "PARENT",
        is_active: true,
        avatar: null,
    },
    {
        user_id: "SN0001",
        first_name: "Lan",
        last_name: "Trần",
        email: "lan.tran@truonghoc.edu.vn",
        phone_number: "0282345789",
        role: "SCHOOL_NURSE",
        is_active: true,
        avatar: null,
    },
    {
        user_id: "AD0001",
        first_name: "Minh",
        last_name: "Phạm",
        email: "minh.pham@truonghoc.edu.vn",
        phone_number: "0284567890",
        role: "ADMIN",
        is_active: false,
        avatar: null,
    },
    {
        user_id: "MN0001",
        first_name: "Thảo",
        last_name: "Lê",
        email: "thao.le@truonghoc.edu.vn",
        phone_number: "0284562890",
        role: "MANAGER",
        is_active: true,
        avatar: null,
    },
    {
        user_id: "PR0002",
        first_name: "Tuấn",
        last_name: "Hoàng",
        email: "tuan.hoang@truonghoc.edu.vn",
        phone_number: "0284567811",
        role: "PARENT",
        is_active: true,
        avatar: null,
    },
    {
        user_id: "PR0003",
        first_name: "Quỳnh",
        last_name: "Đỗ",
        email: "quynh.do@truonghoc.edu.vn",
        phone_number: "0286789012",
        role: "PARENT",
        is_active: true,
        avatar: null,
    },
    {
        user_id: "SN0002",
        first_name: "An",
        last_name: "Vũ",
        email: "an.vu@truonghoc.edu.vn",
        phone_number: "0287890123",
        role: "SCHOOL_NURSE",
        is_active: true,
        avatar: null,
    },
    {
        user_id: "AD0002",
        first_name: "Tuệ",
        last_name: "Ngô",
        email: "tue.ngo@truonghoc.edu.vn",
        phone_number: "0288901234",
        role: "ADMIN",
        is_active: false,
        avatar: null,
    },
    {
        user_id: "PR0004",
        first_name: "Việt",
        last_name: "Lâm",
        email: "viet.lam@truonghoc.edu.vn",
        phone_number: "0289012345",
        role: "PARENT",
        is_active: true,
        avatar: null,
    },
    {
        user_id: "MN0002",
        first_name: "Như",
        last_name: "Đinh",
        email: "nhu.dinh@truonghoc.edu.vn",
        phone_number: "0280123456",
        role: "MANAGER",
        is_active: true,
        avatar: null,
    },
    {
        user_id: "PR0005",
        first_name: "Long",
        last_name: "Trịnh",
        email: "long.trinh@truonghoc.edu.vn",
        phone_number: "0282345678",
        role: "PARENT",
        is_active: true,
        avatar: null,
    },
    {
        user_id: "SN0003",
        first_name: "Hà",
        last_name: "Bùi",
        email: "ha.bui@truonghoc.edu.vn",
        phone_number: "0283456789",
        role: "SCHOOL_NURSE",
        is_active: false,
        avatar: null,
    },
    {
        user_id: "AD0003",
        first_name: "Sơn",
        last_name: "Mai",
        email: "son.mai@truonghoc.edu.vn",
        phone_number: "0284567890",
        role: "ADMIN",
        is_active: true,
        avatar: null,
    },
    {
        user_id: "PR0006",
        first_name: "Thư",
        last_name: "Phan",
        email: "thu.phan@truonghoc.edu.vn",
        phone_number: "0285678901",
        role: "PARENT",
        is_active: true,
        avatar: null,
    },
    {
        user_id: "MN0003",
        first_name: "Dũng",
        last_name: "Hoàng",
        email: "dung.hoang@truonghoc.edu.vn",
        phone_number: "0286789012",
        role: "MANAGER",
        is_active: false,
        avatar: null,
    },
]


const DashboardOverview = () => {
    const { pupilsList = [], loading, error } = useGetPupilsInformation();
    const { medicalEventList = [] } = useGetAllMedicalEvent();
    const { pendingMedicationRequests, loading: loadingPendingPrescriptions, error: errorPendingPrescriptions } = useAllPendingPrescriptions();
    // Fix prescriptions: extract array from response if needed
    const { prescriptions: prescriptionsRaw = [], loading: loadingPrescriptions, error: errorPrescriptions } = useGetAllPrescription();
    const prescriptions = Array.isArray(prescriptionsRaw) ? prescriptionsRaw : (Array.isArray(prescriptionsRaw.data) ? prescriptionsRaw.data : []);

    const activeAccounts = userAccounts.filter(account => account.is_active);
    const dashboardStats = {
        totalStudents: pupilsList.length,
        medicalEvents: medicalEventList.length,
        TotalAcount: userAccounts.length,
        ActiveAccount: activeAccounts.length,
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

    const account = (userAccounts || []).slice(0, 4).map((account, idx) => ({
        id: account.user_id,
        name: `${account.first_name} ${account.last_name}`,
        email: account.email,
        phone: account.phone_number,
        role: account.role,
        avatar: account.avatar || `${account.first_name.charAt(0)}${account.last_name.charAt(0)}`.toUpperCase(),
        color: ["blue", "purple", "teal", "emerald"][idx % 4], // cycle colors for demo
    }));

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
            minHeight: "100vh",
            height: "auto",
            boxSizing: "border-box",
            paddingBottom: "60px"
        }}>
            {/* Top Stats Cards */}
            <Grid container spacing={3} className="stats-row" sx={{ mb: 3 }}>
                {[{
                    label: "Total Pupils",
                    value: dashboardStats.totalStudents.toLocaleString(),
                    icon: <UsersIcon />, color: "blue"
                }, {
                    label: "Mediacal Events",
                    value: dashboardStats.medicalEvents,
                    icon: <PillIcon />, color: "emerald"
                }, {
                    label: "Total Accounts",
                    value: dashboardStats.TotalAcount,
                    icon: <AlertTriangleIcon />, color: "amber"
                }, {
                    label: "Active Accounts",
                    value: dashboardStats.ActiveAccount,
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

                                                <Link to="/admin/medical-events" style={{ textDecoration: "none" }}>
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

                            {/* Today's Active Account */}
                            <Card className="medication-card glass-card" sx={{ borderRadius: 4, boxShadow: 2 }}>
                                <CardHeader
                                    className="medication-card__header"
                                    title={
                                        <Box className="card-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box className="card-title__icon card-title__icon--emerald" sx={{ bgcolor: 'rgba(16,185,129,0.12)', borderRadius: '50%', p: 1 }}>
                                                <PillIcon color="success" />
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Today's Active Account</Typography>
                                            <Link to="/admin/accounts" style={{ textDecoration: "none" }}>
                                                <Button size="small" className="view-all-button" sx={{ color: '#6366f1', fontWeight: 500, textTransform: 'none', display: 'flex', position: 'absolute', right: 16, top: 16 }}>
                                                    view all →
                                                </Button>
                                            </Link>
                                        </Box>

                                    }
                                />

                                <CardContent className="medication-card__content" sx={{ p: 2 }}>
                                    {account.map((acc, index) => (
                                        <Box
                                            key={acc.id}
                                            className={`medication-item ${index !== account.length - 1 ? "medication-item--bordered" : ""} ${acc.urgent ? "medication-item--urgent" : ""}`}
                                            sx={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                py: 1.5, px: 1, borderBottom: index !== account.length - 1 ? '1px solid #f3f4f6' : 'none',
                                                transition: 'background 0.2s',
                                                '&:hover': { background: 'rgba(16,185,129,0.04)' },
                                            }}
                                        >
                                            <Box className="medication-item__left" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar className={`medication-avatar medication-avatar--${acc.color}`}
                                                    sx={{ bgcolor: `var(--avatar-${acc.color})`, color: "rgb(45, 42, 42)", fontWeight: 600 }}>
                                                    {acc.avatar}
                                                </Avatar>
                                                <Box className="medication-item__info">
                                                    <Box className="medication-item__name-row" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2" className="medication-item__name" sx={{ fontWeight: 500 }}>{acc.name}</Typography>
                                                    </Box>
                                                    <Typography variant="caption" className="medication-item__details" sx={{ color: '#64748b' }}>
                                                        {acc.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box className="medication-item__right" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box className="medication-item__time-info" sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body2" className="medication-item__time" sx={{ color: '#0f172a', fontWeight: 600 }}>{acc.role}</Typography>
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


                        {/* Quick Actions */}
                        <Card className="actions-card glass-card" sx={{ borderRadius: 4, boxShadow: 2, p: 2 }}>
                            <CardHeader title={<Typography variant="h6" sx={{ fontWeight: 600 }}>Quick Actions</Typography>} />
                            <CardContent className="actions-card__content" sx={{ p: 2 }}>
                                <Grid container spacing={1}>

                                    <Grid size={6}>
                                        <Link to="/admin/pupils-management" style={{ textDecoration: "none" }}>
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
                                        <Link to="/admin/medical-events" style={{ textDecoration: "none" }}>
                                            <Button className="action-button action-button--purple" fullWidth sx={{
                                                bgcolor: 'linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)',
                                                color: '#fff', borderRadius: 3, fontWeight: 600, py: 2, gap: 1, boxShadow: 2,
                                                '&:hover': { bgcolor: '#a78bfa', opacity: 0.9 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            }}>
                                                <AssignmentIndIcon />
                                                <Typography variant="caption">Medical Event</Typography>
                                            </Button>
                                        </Link>
                                    </Grid>
                                    <Grid size={6}>
                                        <Link to="/admin/accounts" style={{ textDecoration: "none" }}>
                                            <Button className="action-button action-button--rose" fullWidth sx={{
                                                bgcolor: 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)',
                                                color: '#fff', borderRadius: 3, fontWeight: 600, py: 2, gap: 1, boxShadow: 2,
                                                '&:hover': { bgcolor: '#f43f5e', opacity: 0.9 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            }}>
                                                <VaccinesIcon />
                                                <Typography variant="caption">Account</Typography>
                                            </Button>
                                        </Link>

                                    </Grid>
                                    <Grid size={6}>
                                        <Link to="/admin/reports" style={{ textDecoration: "none" }}>
                                            <Button className="action-button action-button--emerald" fullWidth sx={{
                                                bgcolor: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                                                color: '#fff', borderRadius: 3, fontWeight: 600, py: 2, gap: 1, boxShadow: 2,
                                                '&:hover': { bgcolor: '#10b981', opacity: 0.9 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            }}>
                                                <PillIcon />
                                                <Typography variant="caption">Report</Typography>
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
