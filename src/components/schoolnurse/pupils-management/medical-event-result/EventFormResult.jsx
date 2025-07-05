import { useState } from "react"

import { styled } from '@mui/material/styles';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Fade,
} from "@mui/material"
import {
    Print as PrintIcon,
    Close as CloseIcon,
    Favorite as HeartIcon,
    Shield as ShieldIcon,
    CalendarToday as CalendarIcon,
    Phone as PhoneIcon,
    Description as FileIcon,
    CheckCircle as CheckIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Height as HeightIcon,
    Visibility as VisionIcon,
    Email as EmailIcon,
    Home as HomeIcon,
    ContactPhone as ContactIcon,
} from "@mui/icons-material"
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

//custom hooks
import { useGetAllMedicalEventByPupilsId } from "../../../../hooks/schoolnurse/new-event/useGetAllMedicalEventByPupilsId"
import { getVaccinationHistoryByPupilId } from "../../../../hooks/schoolnurse/new-event/useGetVaccinationByPupilId"
import "./MedicalEventForm.scss"

function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[1],
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: '80px',
    transition: 'all 0.3s ease',
    width: '100%',

    '& .label': {
        fontWeight: 600,
        fontSize: '0.85rem',
        color: theme.palette.text.secondary,
    },

    '& .value': {
        fontWeight: 700,
        fontSize: '1rem',
        color: theme.palette.text.primary,
    },
    '&:hover': {
        boxShadow: theme.shadows[3],
        transform: 'translateY(-2px)',
    },
}));

// Add StyledCard definition for consistent card styling
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[1],
    background: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
    transition: "all 0.3s ease",
    '&:hover': {
        boxShadow: theme.shadows[3],
        transform: 'translateY(-2px)',
    },
    '& .MuiCardContent-root': {
        padding: theme.spacing(3),
    },
    '& .MuiTypography-root': {
        color: theme.palette.text.primary,
    },
    alignItems: "center",
    display: "flex",

}));

const InfoBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: "12px",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s ease",
    "&:hover": {
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
}))

const SectionHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    background: "linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(21, 101, 192, 0.05))",
    borderRadius: "12px",
    border: "1px solid rgba(25, 118, 210, 0.1)",
}))

const MedicalEventResultForm = ({ onBack }) => {
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const pupilData = {
        name: "Emma Martinez",
        pupilId: "STU-2024-001",
        grade: "Grade 3",
        gender: "Female",
        teacher: "Mrs. Smith",
    }

    const healthData = {
        height: "4'2\" (127 cm)",
        weight: "65 lbs (29.5 kg)",
        bmi: "18.2 (Normal)",
        leftEye: "20/20",
        rightEye: "20/20",
        bloodPressure: "110/70 mmHg",
        dentalCheck: "Good",
        notes: "Student is in excellent health. No concerns noted during examination.",
    }

    const parentContact = {
        motherName: "Maria Martinez",
        motherPhone: "(555) 123-4567",
        motherEmail: "maria.martinez@email.com",
        fatherName: "Carlos Martinez",
        fatherPhone: "(555) 123-4568",
        fatherEmail: "carlos.martinez@email.com",
        address: "123 Oak Street, Springfield, IL 62701",
    }

    const vaccinations = [
        {
            name: "COVID-19 (Pfizer-BioNTech)",
            dose: "Dose 2 of 2",
            date: "Sep 15, 2024",
            status: "Complete",
            nurse: "Nurse Johnson",
        },
        {
            name: "Flu Vaccine (2024-2025)",
            dose: "Annual dose",
            date: "Oct 10, 2024",
            status: "Complete",
            nurse: "Nurse Smith",
        },
        {
            name: "Tdap (Tetanus, Diphtheria, Pertussis)",
            dose: "Booster dose",
            date: "Aug 20, 2024",
            status: "Complete",
            nurse: "Nurse Johnson",
        },
    ]

    const healthVisits = [
        {
            title: "Routine Health Check",
            description: "Annual physical examination",
            date: "Oct 15, 2024",
            nurse: "Nurse Johnson",
            status: "Complete",
        },
        {
            title: "Vision Screening",
            description: "Annual vision test - passed",
            date: "Sep 28, 2024",
            nurse: "Nurse Johnson",
            status: "Complete",
        },
        {
            title: "Hearing Screening",
            description: "Annual hearing test - normal",
            date: "Sep 20, 2024",
            nurse: "Nurse Johnson",
            status: "Complete",
        },
    ]

    const medicalEvents = [
        {
            id: 1,
            pupil: pupilData,
            grade: pupilData.grade,
            injuryDescription: "Minor cut on finger during art class",
            schoolNurse: "Nurse Johnson",
            dateTime: "Nov 15, 2024 10:30 AM",
            status: "Treated",
        },
        {
            id: 2,
            pupil: pupilData,
            grade: pupilData.grade,
            injuryDescription: "Headache complaint",
            schoolNurse: "Nurse Smith",
            dateTime: "Nov 10, 2024 2:15 PM",
            status: "Resolved",
        },
    ]

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "complete":
            case "treated":
            case "resolved":
                return "success"
            case "pending":
                return "warning"
            case "cancelled":
                return "error"
            default:
                return "default"
        }
    }
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
                    <IconButton className="close-button" sx={{ borderRadius: 2, bgcolor: '#f5f5f5', ml: 1, top: 0, right: 0 }} onClick={onBack}>
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

            <TabPanel value={tabValue} index={0}>
                <Grid container size={12} spacing={2}>
                    <Grid size={8.5}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            {/* basic infor */}
                            <Grid container spacing={2} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }} size={12}>
                                {/* Header */}
                                <Grid item size={12}>
                                    <Item>
                                        <Typography fontWeight={1000} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <HeartIcon sx={{ color: '#e57373' }} /> Pupils Information
                                        </Typography>
                                    </Item>
                                </Grid>

                                {/* Name and ID side by side */}
                                <Grid item size={6}>
                                    <Item>Name</Item>
                                </Grid>
                                <Grid item size={6}>
                                    <Item>Pupil ID</Item>
                                </Grid>

                                {/* Grade and Gender side by side */}
                                <Grid item size={6}>
                                    <Item>Grade</Item>
                                </Grid>
                                <Grid item size={6}>
                                    <Item>Gender</Item>
                                </Grid>
                            </Grid>



                            <Grid container spacing={2} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }} size={12}>

                                <Grid item size={12}>
                                    <Item>
                                        <Typography fontWeight={1000} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <HeartIcon sx={{ color: '#e57373' }} /> Health Records Recently
                                        </Typography>
                                    </Item>
                                </Grid>
                                <Grid size={4}>
                                    <Item>Height</Item>
                                </Grid>
                                <Grid size={4}>
                                    <Item>Weight</Item>
                                </Grid>
                                <Grid size={4}>
                                    <Item>BMI</Item>
                                </Grid>
                                <Grid size={6}>
                                    <Item>Left eye</Item>
                                </Grid>
                                <Grid size={6}>
                                    <Item>Right eye</Item>
                                </Grid>
                                <Grid size={6}>
                                    <Item>Blood Pressure</Item>
                                </Grid>
                                <Grid size={6}>
                                    <Item>Dental Check</Item>
                                </Grid>
                                <Grid size={12}>
                                    <Item>Notes</Item>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid size={3.5}>
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
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Grid container size={12} spacing={2} sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Grid size={12} sx={{ bgcolor: '#fff', px: 10, borderRadius: 2, width: '100%' }}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            {/* basic infor */}
                            <Grid container spacing={2} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }} size={12}>
                                {/* Header */}
                                <Grid item size={12}>
                                    <Item>
                                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                            <ShieldIcon />Vaccination History
                                        </Typography>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item size={12}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            {/* basic infor */}
                            <Grid container spacing={2} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }} size={12}>
                                {/* Header */}
                                <Grid item size={12}>
                                    <Item>
                                        <TableContainer className="table-container">
                                            <Table>
                                                <TableHead>
                                                    <TableRow className="table-header">
                                                        <TableCell>Vaccine Name</TableCell>
                                                        <TableCell>Dose</TableCell>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>Administered By</TableCell>
                                                        <TableCell>Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {vaccinations.map((vaccine, index) => (
                                                        <TableRow key={index} className="table-row">
                                                            <TableCell>
                                                                <Box className="vaccine-info">
                                                                    <Typography variant="body1" className="vaccine-name">
                                                                        {vaccine.name}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>{vaccine.dose}</TableCell>
                                                            <TableCell>{vaccine.date}</TableCell>
                                                            <TableCell>{vaccine.nurse}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={vaccine.status}
                                                                    color={getStatusColor(vaccine.status)}
                                                                    size="small"
                                                                    className="status-chip"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </TabPanel >

            <TabPanel value={tabValue} index={2}>
                <Grid container size={12} spacing={2} sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Grid size={12} sx={{ bgcolor: '#fff', px: 10, borderRadius: 2, width: '100%' }}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            {/* basic infor */}
                            <Grid container spacing={2} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }} size={12}>
                                {/* Header */}
                                <Grid item size={12}>
                                    <Item>
                                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                            <CalendarIcon />  Health Check History
                                        </Typography>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item size={12}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            {/* basic infor */}
                            <Grid container spacing={2} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }} size={12}>
                                {/* Header */}
                                <Grid item size={12}>
                                    <Item>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow className="table-header">
                                                        <TableCell>Visit Type</TableCell>
                                                        <TableCell>Description</TableCell>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>Healthcare Provider</TableCell>
                                                        <TableCell>Status</TableCell>
                                                        <TableCell>Action</TableCell>

                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {healthVisits.map((visit, index) => (
                                                        <TableRow key={index} className="table-row">
                                                            <TableCell>
                                                                <Box className="visit-info">
                                                                    <Typography variant="body1" className="visit-title">
                                                                        {visit.title}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>{visit.description}</TableCell>
                                                            <TableCell>{visit.date}</TableCell>
                                                            <TableCell>{visit.nurse}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={visit.status}
                                                                    color={getStatusColor(visit.status)}
                                                                    size="small"
                                                                    className="status-chip"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button size="small" variant="outlined" className="details-button">
                                                                    Details
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </TabPanel >

            <TabPanel value={tabValue} index={3}>
                <Grid container size={12} spacing={2} sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Grid size={12} sx={{ bgcolor: '#fff', px: 10, borderRadius: 2, width: '100%' }}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            {/* basic infor */}
                            <Grid container spacing={2} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }} size={12}>
                                {/* Header */}
                                <Grid item size={12}>
                                    <Item>

                                        <Typography variant="h6" className="section-title">
                                            <FileIcon /> Medical Events
                                        </Typography>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item size={12}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            {/* basic infor */}
                            <Grid container spacing={2} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }} size={12}>
                                {/* Header */}
                                <Grid item size={12}>
                                    <Item>
                                        <TableContainer className="table-container">
                                            <Table>
                                                <TableHead>
                                                    <TableRow className="table-header">
                                                        <TableCell>Details</TableCell>
                                                        <TableCell>Injury Description</TableCell>
                                                        <TableCell>School Nurse</TableCell>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>Status</TableCell>
                                                        <TableCell>Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {medicalEvents.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={7} align="center" className="no-data">
                                                                <Box className="empty-state">
                                                                    <FileIcon className="empty-icon" />
                                                                    <Typography variant="h6">No Medical Events</Typography>
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        No medical events have been recorded.
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        medicalEvents.map((event) => (
                                                            <TableRow key={event.id} className="table-row">
                                                                <TableCell>
                                                                    <Box className="pupil-info">
                                                                        <Box>
                                                                            <Typography variant="body2" className="pupil-name">
                                                                                detailedInformation
                                                                            </Typography>

                                                                        </Box>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>{event.injuryDescription}</TableCell>
                                                                <TableCell>{event.schoolNurse}</TableCell>
                                                                <TableCell>{event.dateTime}</TableCell>
                                                                <TableCell>
                                                                    <Chip
                                                                        label={event.status}
                                                                        color={getStatusColor(event.status)}
                                                                        size="small"
                                                                        className="status-chip"
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button size="small" variant="outlined" className="details-button">
                                                                        Details
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </TabPanel >









        </Grid >
    )
}
export default MedicalEventResultForm