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
import { useGetVaccinationHistoryByPupilId } from "../../../../hooks/schoolnurse/new-event/useGetVaccinationByPupilId"
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

const MedicalEventResultForm = ({ pupilId, onBack }) => {
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    // Fetch medical events for the selected pupil
    const {
        medicalEventList,
        loading: isMedicalEventsLoading,
        error: medicalEventsError
    } = useGetAllMedicalEventByPupilsId(pupilId);
    // Fix: support both array and object with data property
    const medicalEvents = Array.isArray(medicalEventList)
        ? medicalEventList
        : Array.isArray(medicalEventList?.data)
            ? medicalEventList.data
            : [];

    // Fetch vaccination history for the selected pupil
    const {
        vaccinationHistory,
        loading: isVaccinationLoading,
        error: vaccinationError
    } = useGetVaccinationHistoryByPupilId(pupilId);
    console.log("Vaccination History2:", vaccinationHistory);

    const event = medicalEvents[0]; // or any event in the array

    // Defensive checks to avoid TypeError if event or event.pupil is undefined
    const pupilName = event && event.pupil ? `${event.pupil.firstName} ${event.pupil.lastName}` : "";
    const grade = event && event.pupil ? (event.pupil.gradeName || event.pupil.gradeLevel || "") : "";
    const gender = event && event.pupil ? event.pupil.gender : "";

    const parent = event && event.pupil && Array.isArray(event.pupil.parents) && event.pupil.parents.length > 0 ? event.pupil.parents[0] : null;
    const parentName = parent ? `${parent.firstName} ${parent.lastName}` : "";
    const parentPhone = parent ? parent.phoneNumber : "";

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

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
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

    if (isMedicalEventsLoading) {
        return <Box p={4}><Typography>Loading medical events...</Typography></Box>;
    }
    if (medicalEventsError) {
        return <Box p={4}><Typography color="error">Error loading medical events: {medicalEventsError?.message || "Unknown error"}</Typography></Box>;
    }

    return (
        <Grid container spacing={2}>
            {/* Header */}
            <Grid container alignItems="center" spacing={2} size={12} sx={{ mb: 2, bgcolor: `rgb(255, 255, 255)`, p: 2, borderRadius: 2 }}>
                <Grid item size={1} >
                    <Avatar className="student-avatar" sx={{ width: 64, height: 64, fontSize: 32, bgcolor: '#1976d2' }}></Avatar>
                </Grid>
                <Grid item size={8}>
                    <Typography variant="h4" className="student-name" sx={{ fontWeight: 700, color: '#222' }}>
                        {pupilName}
                    </Typography>
                    <Box className="student-meta" sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                        <Typography variant="body2" className="grade-info" sx={{ color: 'text.secondary' }}>
                            {grade}
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
                                    <Item>
                                        <Typography variant="h6" sx={{ alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                            Name
                                        </Typography>
                                        <span>{pupilName}</span>
                                    </Item>
                                </Grid>
                                <Grid item size={6}>
                                    <Item>
                                        <Typography variant="h6" sx={{ alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                            Pupil ID
                                        </Typography>
                                        <span>{pupilId}</span>
                                    </Item>
                                </Grid>

                                {/* Grade and Gender side by side */}
                                <Grid item size={6}>
                                    <Item>
                                        <Typography variant="h6" sx={{ alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                            Grade
                                        </Typography>
                                        <span>{grade}</span>
                                    </Item>
                                </Grid>
                                <Grid item size={6}>
                                    <Item>
                                        <Typography variant="h6" sx={{ alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                            Gender
                                        </Typography>
                                        <span>{gender}</span>
                                    </Item>
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
                                            <Typography variant="body1" fontWeight={600}>Parent'Name : {parentName}</Typography>
                                            <Typography variant="body1" fontWeight={600}>Phone Number : 0{parentPhone}</Typography>
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
                                        {isVaccinationLoading ? (
                                            <Box p={4}><Typography>Loading vaccination history...</Typography></Box>
                                        ) : vaccinationError ? (
                                            <Box p={4}><Typography color="error">Error loading vaccination history: {vaccinationError?.message || "Unknown error"}</Typography></Box>
                                        ) : (
                                            <TableContainer className="table-container">
                                                <Table>
                                                    <TableHead>
                                                        <TableRow className="table-header">
                                                            <TableCell>Vaccine Name</TableCell>
                                                            <TableCell>Disease</TableCell>
                                                            <TableCell>Date</TableCell>
                                                            <TableCell>Source</TableCell>
                                                            <TableCell>Status</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {(Array.isArray(vaccinationHistory) ? vaccinationHistory : []).length === 0 ? (
                                                            <TableRow>
                                                                <TableCell colSpan={5} align="center">No vaccination records found.</TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            (vaccinationHistory || []).map((vaccine, index) => (
                                                                <TableRow key={vaccine.historyId || index} className="table-row">
                                                                    <TableCell>
                                                                        <Box className="vaccine-info">
                                                                            <Typography variant="body1" className="vaccine-name">
                                                                                {vaccine.vaccineName}
                                                                            </Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell>{vaccine.diseaseName}</TableCell>
                                                                    <TableCell>{vaccine.vaccinatedAt ? new Date(vaccine.vaccinatedAt).toLocaleDateString() : "-"}</TableCell>
                                                                    <TableCell>{vaccine.source}</TableCell>
                                                                    <TableCell>
                                                                        <Chip
                                                                            label={vaccine.active ? "Active" : "Inactive"}
                                                                            color={vaccine.active ? "success" : "default"}
                                                                            size="small"
                                                                            className="status-chip"
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
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
                                        {medicalEvents.length === 0 ? (
                                            <Box className="empty-state" sx={{ textAlign: 'center', py: 6 }}>
                                                <FileIcon className="empty-icon" sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                                                <Typography variant="h6">No Medical Events</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    No medical events have been recorded for this pupil.
                                                </Typography>
                                            </Box>
                                        ) : (
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
                                                        {medicalEvents.map((event) => (
                                                            <TableRow key={event.id} className="table-row">
                                                                <TableCell>
                                                                    <Box className="pupil-info">
                                                                        <Box>
                                                                            <Typography variant="body2" className="pupil-name">
                                                                                {event.detailedInformation}
                                                                            </Typography>

                                                                        </Box>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>{event.injuryDescription}</TableCell>
                                                                <TableCell>{event.schoolNurse ? `${event.schoolNurse.firstName} ${event.schoolNurse.lastName}` : ''}</TableCell>
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
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
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