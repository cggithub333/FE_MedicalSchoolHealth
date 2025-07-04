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
    Grow,
} from "@mui/material"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
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
        <Grid container spacing={2}>
            {/* Header */}
            <Grid container alignItems="center" spacing={2} size={12} sx={{ mb: 2, bgcolor: `rgb(255, 255, 255)`, p: 2, borderRadius: 2 }}>
                <Grid item size={1} >
                    <Avatar className="student-avatar" sx={{ width: 64, height: 64, fontSize: 32, bgcolor: '#1976d2' }}>EM</Avatar>
                </Grid>
                <Grid item size={8}>
                    <Typography variant="h4" className="student-name" sx={{ fontWeight: 700, color: '#222' }}>
                        Emma Martinez
                    </Typography>
                    <Box className="student-meta" sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                        <Typography variant="body2" className="grade-info" sx={{ color: 'text.secondary' }}>
                            Grade 3 • Mrs. Smith
                        </Typography>
                    </Box>
                </Grid>
                <Grid item size={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <IconButton className="close-button" sx={{ borderRadius: 2, bgcolor: '#f5f5f5', ml: 1, top: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>

            <Grid item size={12} >
                <Card>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        TabIndicatorProps={{ className: "tab-indicator" }}
                    >

                        <Tab label="Overview" className="tab-item" />
                        <Tab label="Vaccines History" className="tab-item" />
                        <Tab label="Health Check History" className="tab-item" />
                        <Tab label="Medical Event" className="tab-item" />
                    </Tabs>
                </Card>
            </Grid>

            {/* Tab Content */}
            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={1}>
                    <Grid item size={8}>
                        <Card className="info-card health-info-card" sx={{ borderRadius: 3, boxShadow: 0, bgcolor: '#fff' }}>
                            <CardContent>
                                <Grid container alignItems="center" spacing={1}>
                                    <Grid item><HeartIcon sx={{ color: '#e57373' }} /></Grid>
                                    <Grid item xs>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Basic Health Information
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} className="health-grid" mt={1}>
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

                    <Grid item size={4}>
                        <div className="sidebar-card emergency-card" >
                            <CardContent>
                                <Grid container alignItems="center" spacing={1}>
                                    <Grid item><PhoneIcon sx={{ color: '#fbc02d' }} /></Grid>
                                    <Grid item xs><Typography variant="subtitle1" fontWeight={600}>Emergency Contact</Typography></Grid>
                                </Grid>
                                <Box className="contact-list" sx={{ mt: 1 }}>
                                    <Grid container spacing={5}>
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
                        </div>
                    </Grid>

                    {/* vaccanation */}
                    <Grid item size={8}>
                        <Card className="info-card vaccination-card" sx={{ borderRadius: 3, boxShadow: 0, bgcolor: '#e3f2fd' }}>
                            <CardContent>
                                <Grid container alignItems="center" spacing={1} size={8}>
                                    <Grid item><ShieldIcon sx={{ color: '#4caf50' }} /></Grid>
                                    <Grid item sx={{ p: 2 }}><Typography variant="subtitle1" fontWeight={600}>Recent Vaccinations</Typography></Grid>
                                </Grid>
                                <Grid container direction="column" spacing={1} className="vaccination-list">
                                    {vaccinations.map((vaccine, index) => (
                                        <Grid item key={index}>
                                            <Grid container sx={6} alignItems="center" justifyContent="space-between">
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
                                                <Grid item size={6} sx={{ textAlign: 'center' }}>
                                                    <Typography variant="body2" className="vaccination-date">
                                                        {vaccine.date}
                                                    </Typography>
                                                    <Chip label={vaccine.status} className="status-chip complete" size="small" sx={{ bgcolor: '#e8f5e9', color: '#388e3c', fontWeight: 600 }} />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid>
                                    <Button color="secondary">View All <KeyboardArrowRightIcon /> </Button>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item size={8}>
                        <Card className="info-card vaccination-card" sx={{ borderRadius: 3, boxShadow: 0, bgcolor: '#e3f2fd' }}>
                            <CardContent>
                                <Grid container alignItems="center" spacing={1} size={8}>
                                    <Grid item><CalendarIcon sx={{ color: '#ffb300' }} /></Grid>
                                    <Grid item xs><Typography variant="subtitle1" fontWeight={600}>Recent Health Visits</Typography></Grid>
                                    <Grid item sx={{ textAlign: 'right' }}>
                                        <Button color="secondary">View All <KeyboardArrowRightIcon /> </Button>
                                    </Grid>
                                </Grid>
                                <Grid container direction="column" spacing={1} className="vaccination-list">
                                    {healthVisits.map((visit, index) => (
                                        <Grid item key={index}>
                                            <Grid container sx={6} alignItems="center" justifyContent="space-between">
                                                <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CheckIcon className="check-icon" sx={{ color: '#4caf50' }} />
                                                    <Box>
                                                        <Typography variant="body1" className="visit-title">
                                                            {visit.title}
                                                        </Typography>
                                                        <Typography variant="body2" className="visit-description">
                                                            {visit.description}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item size={6} sx={{ textAlign: 'center' }}>
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

            </TabPanel >
        </Grid >
    )
}
export default MedicalEventResultForm