import { useState } from "react"
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Button,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
    Chip,
    IconButton,
} from "@mui/material"
import {
    Print as PrintIcon,
    Close as CloseIcon,
    Favorite as HeartIcon,
    Shield as ShieldIcon,
    CalendarToday as CalendarIcon,
    Phone as PhoneIcon,
    Warning as WarningIcon,
    LocalPharmacy as PillIcon,
    Description as FileIcon,
    CheckCircle as CheckIcon,
    Person as PersonIcon,
} from "@mui/icons-material"
import "./MedicalEventForm.scss"

function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

const MedicalEventResultForm = () => {
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const vaccinations = [
        {
            name: "COVID-19 (Pfizer-BioNTech)",
            dose: "Dose 2 of 2",
            date: "Sep 15, 2024",
            status: "Complete",
        },
        {
            name: "Flu Vaccine (2024-2025)",
            dose: "Annual dose",
            date: "Oct 10, 2024",
            status: "Complete",
        },
        {
            name: "Tdap (Tetanus, Diphtheria, Pertussis)",
            dose: "Booster dose",
            date: "Aug 20, 2024",
            status: "Complete",
        },
    ]

    const healthVisits = [
        {
            title: "Routine Health Check",
            description: "Annual physical examination",
            date: "Oct 15, 2024",
            nurse: "Nurse Johnson",
        },
        {
            title: "Vision Screening",
            description: "Annual vision test - passed",
            date: "Sep 28, 2024",
            nurse: "Nurse Johnson",
        },
        {
            title: "Hearing Screening",
            description: "Annual hearing test - normal",
            date: "Sep 20, 2024",
            nurse: "Nurse Johnson",
        },
    ]

    const healthInfo = [
        { label: "Blood Type", value: "O+" },
        { label: "Height", value: "4'2\" (127 cm)" },
        { label: "Weight", value: "65 lbs (29.5 kg)" },
        { label: "BMI", value: "18.2 (Normal)", isNormal: true },
        { label: "Vision", value: "20/20 Both Eyes" },
        { label: "Hearing", value: "Normal" },
    ]

    return (
        <div className="dashboard-container">
            <Paper className="dashboard-paper" elevation={0}>
                {/* Header */}
                <Box className="header-section" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, borderBottom: '1px solid #eee', bgcolor: '#f7f9fb', borderRadius: 3, mb: 2 }}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <Avatar className="student-avatar" sx={{ width: 64, height: 64, fontSize: 32, bgcolor: '#1976d2' }}>EM</Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h4" className="student-name" sx={{ fontWeight: 700, color: '#222' }}>
                                Emma Martinez
                            </Typography>
                            <Box className="student-meta" sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                <Chip label="STU-2024-001" className="student-id-chip" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 600 }} />
                                <Typography variant="body2" className="grade-info" sx={{ color: 'text.secondary' }}>
                                    Grade 3 • Mrs. Smith • DOB: March 15, 2016
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" startIcon={<PrintIcon />} className="print-button" sx={{ borderRadius: 2, mr: 1 }}>
                                Print Record
                            </Button>
                            <IconButton className="close-button" sx={{ borderRadius: 2, bgcolor: '#f5f5f5', ml: 1 }}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>

                {/* Tabs */}
                <Box className="tabs-container" sx={{ px: 3, pt: 2, bgcolor: '#fff', borderRadius: 2, mb: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        className="custom-tabs"
                        TabIndicatorProps={{ className: "tab-indicator" }}
                    >
                        <Tab label="Overview" className="tab-item" />
                        <Tab label="Vaccines History" className="tab-item" />
                        <Tab label="Health Check History" className="tab-item" />
                        <Tab label="Medical Event" className="tab-item" />
                    </Tabs>
                </Box>


                {/* Tab Content */}
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={4}>
                        {/* Sidebar */}
                        <Grid item xs={12} lg={4}>
                            <Grid container direction="column" spacing={2}>
                                <Grid item>
                                    <Card className="sidebar-card emergency-card" sx={{ borderRadius: 3, boxShadow: 0, bgcolor: '#fffbe6' }}>
                                        <CardContent>
                                            <Grid container alignItems="center" spacing={1}>
                                                <Grid item><PhoneIcon sx={{ color: '#fbc02d' }} /></Grid>
                                                <Grid item xs><Typography variant="subtitle1" fontWeight={600}>Emergency Contact</Typography></Grid>
                                            </Grid>
                                            <Box className="contact-list" sx={{ mt: 1 }}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body1" fontWeight={600}>Maria Martinez</Typography>
                                                        <Typography variant="body2">Mother</Typography>
                                                        <Typography variant="body2">(555) 123-4567</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body1" fontWeight={600}>Carlos Martinez</Typography>
                                                        <Typography variant="body2">Father</Typography>
                                                        <Typography variant="body2">(555) 123-4568</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* Main Content */}
                        <Grid item xs={12} lg={8}>
                            <Grid container direction="column" spacing={2}>
                                <Grid item>
                                    <Card className="info-card health-info-card" sx={{ borderRadius: 3, boxShadow: 0, bgcolor: '#fff' }}>
                                        <CardContent>
                                            <Grid container alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                <Grid item><HeartIcon sx={{ color: '#e57373' }} /></Grid>
                                                <Grid item xs><Typography variant="subtitle1" fontWeight={600}>Basic Health Information</Typography></Grid>
                                            </Grid>
                                            <Grid container spacing={2} className="health-grid">
                                                {healthInfo.map((info, index) => (
                                                    <Grid item xs={12} sm={6} key={index}>
                                                        <Box className={`health-item ${info.isNormal ? "normal-value" : ""}`}>
                                                            <Typography variant="body2" className="health-label">
                                                                {info.label}
                                                            </Typography>
                                                            <Typography variant="body1" className="health-value">
                                                                {info.value}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item>
                                    <Card className="info-card vaccination-card" sx={{ borderRadius: 3, boxShadow: 0, bgcolor: '#f9fbe7' }}>
                                        <CardContent>
                                            <Grid container alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                <Grid item><ShieldIcon sx={{ color: '#4caf50' }} /></Grid>
                                                <Grid item xs><Typography variant="subtitle1" fontWeight={600}>Recent Vaccinations</Typography></Grid>
                                            </Grid>
                                            <Grid container direction="column" spacing={1} className="vaccination-list">
                                                {vaccinations.map((vaccine, index) => (
                                                    <Grid item key={index} className="vaccination-item">
                                                        <Grid container alignItems="center" justifyContent="space-between">
                                                            <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <CheckIcon className="check-icon" sx={{ color: '#4caf50' }} />
                                                                <Box>
                                                                    <Typography variant="body1" className="vaccination-name">
                                                                        {vaccine.name}
                                                                    </Typography>
                                                                    <Typography variant="body2" className="vaccination-dose">
                                                                        {vaccine.dose}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item sx={{ textAlign: 'right' }}>
                                                                <Typography variant="body2" className="vaccination-date">
                                                                    {vaccine.date}
                                                                </Typography>
                                                                <Chip label={vaccine.status} className="status-chip complete" size="small" sx={{ bgcolor: '#e8f5e9', color: '#388e3c', fontWeight: 600 }} />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item>
                                    <Card className="info-card visits-card" sx={{ borderRadius: 3, boxShadow: 0, bgcolor: '#e3f2fd' }}>
                                        <CardContent>
                                            <Grid container alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                <Grid item><CalendarIcon sx={{ color: '#ffb300' }} /></Grid>
                                                <Grid item xs><Typography variant="subtitle1" fontWeight={600}>Recent Health Visits</Typography></Grid>
                                            </Grid>
                                            <Grid container direction="column" spacing={1} className="visits-list">
                                                {healthVisits.map((visit, index) => (
                                                    <Grid item key={index} className="visit-item">
                                                        <Grid container alignItems="center" justifyContent="space-between">
                                                            <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <PersonIcon className="person-icon" sx={{ color: '#1976d2' }} />
                                                                <Box>
                                                                    <Typography variant="body1" className="visit-title">
                                                                        {visit.title}
                                                                    </Typography>
                                                                    <Typography variant="body2" className="visit-description">
                                                                        {visit.description}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item sx={{ textAlign: 'right' }}>
                                                                <Typography variant="body2" className="visit-date">
                                                                    {visit.date}
                                                                </Typography>
                                                                <Typography variant="body2" className="visit-nurse">
                                                                    {visit.nurse}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>
        </div>
    )
}
export default MedicalEventResultForm