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
import { useGetAllHealthCheckByPupilID } from "../../../../hooks/schoolnurse/new-event/useGetAllHealthCheckByPupilID"
import useSearchPupilInforByPupilId from "../../../../hooks/schoolnurse/useSearchPupilInforByPupilId";
import { useGetAllHealthRecordByPupilId } from "@hooks/parent/new-event/useGetAllHealthrecordByPupilId";

import MedicalEventDetails from "./medical-event-details/EventFormResult.jsx";
import ScheduleResult from "./healthcheck-schedule-management-result/ScheduleResult.jsx";
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

const MedicalEventResultForm = ({ pupilId, onBack }) => {
    const [tabValue, setTabValue] = useState(0)
    // Add state for selected event
    const [selectedEventId, setSelectedEventId] = useState(null);
    // Add state for selected health check consent form
    const [selectedConsentFormId, setSelectedConsentFormId] = useState(null);
    const [selectedPupilData, setSelectedPupilData] = useState(null);

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

    // Fetch health check history for the selected pupil
    const {
        healthCheckList: rawHealthCheckList = [],
        loading: isHealthCheckLoading,
        error: healthCheckError
    } = useGetAllHealthCheckByPupilID(pupilId) || {};
    // Defensive: ensure array
    const healthCheckList = Array.isArray(rawHealthCheckList) ? rawHealthCheckList : (Array.isArray(rawHealthCheckList?.data) ? rawHealthCheckList.data : []);

    // Fetch full pupil info by pupilId
    const { pupilInfo, isLoading: isPupilLoading, error: pupilError } = useSearchPupilInforByPupilId(pupilId);

    const event = medicalEvents[0]; // or any event in the array

    // Defensive checks to avoid TypeError if event or event.pupil is undefined
    // Use pupilInfo for details if available, fallback to event.pupil
    const pupil = pupilInfo || (event && event.pupil) || {};
    const pupilName = pupil.firstName && pupil.lastName ? `${pupil.firstName} ${pupil.lastName}` : "";
    const grade = pupil.gradeName || pupil.gradeLevel || "";
    const gender = pupil.gender || "";
    const parent = Array.isArray(pupil.parents) && pupil.parents.length > 0 ? pupil.parents[0] : null;
    const parentName = parent ? `${parent.firstName} ${parent.lastName}` : "";
    const parentPhone = parent ? parent.phoneNumber : "";


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

    // Get the most recent health check result (by createdAt)
    let latestHealthCheck = null;
    if (healthCheckList.length > 0) {
        // Defensive: consentForms may be array or object
        const getHistory = (campaign) => {
            const consentForm = Array.isArray(campaign.consentForms) ? campaign.consentForms[0] : campaign.consentForms;
            return consentForm?.healthCheckHistoryRes || null;
        };
        latestHealthCheck = healthCheckList
            .map(getHistory)
            .filter(Boolean)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
    }
    const Height = latestHealthCheck?.height || '-';
    const Weight = latestHealthCheck?.weight || '-';
    const BMI = latestHealthCheck && latestHealthCheck.height && latestHealthCheck.weight ? (latestHealthCheck.weight / ((latestHealthCheck.height / 100) ** 2)).toFixed(2) : '-';
    const Lefteye = latestHealthCheck?.leftEyeVision || '-';
    const Righteye = latestHealthCheck?.rightEyeVision || '-';
    const Notes = latestHealthCheck?.additionalNotes || '-';

    // Fetch health declaration records for the selected pupil
    const { healthRecords = [], loading, error } = useGetAllHealthRecordByPupilId(pupilId);

    console.log("health records - pupilInfo:", healthRecords);
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
                                    <Item>
                                        <Typography variant="h6" sx={{ alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                            Height
                                        </Typography>
                                        <span>{Height}</span>
                                    </Item>
                                </Grid>
                                <Grid size={4}>
                                    <Item>
                                        <Typography variant="h6" sx={{ alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                            Weight
                                        </Typography>
                                        <span>{Weight}</span>
                                    </Item>
                                </Grid>
                                <Grid size={4}>
                                    <Item>
                                        <Typography variant="h6" sx={{ alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                            BMI
                                        </Typography>
                                        <span>{BMI}</span>
                                    </Item>
                                </Grid>
                                <Grid size={6}>
                                    <Item>
                                        <Typography variant="h6" sx={{ alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                            Left eye
                                        </Typography>
                                        <span>{Lefteye}</span>
                                    </Item>
                                </Grid>
                                <Grid size={6}>
                                    <Item>
                                        <Typography variant="h6" sx={{ alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                            Right eye
                                        </Typography>
                                        <span>{Righteye}</span>
                                    </Item>
                                </Grid>
                                <Grid size={12}>
                                    <Item>
                                        <Typography variant="h6" sx={{ alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                            Notes
                                        </Typography>
                                        <span>{Notes}</span>
                                    </Item>
                                </Grid>
                            </Grid>
                            {/* Health Declaration */}
                            <Grid container spacing={2} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }} size={12}>
                                <Grid size={12}>
                                    {/* ALLERGY Section */}
                                    <Paper elevation={1} sx={{ flex: 1, minWidth: 320, padding: 3, margin: 1, bgcolor: 'primary.50', borderRadius: 3, boxShadow: 4 }}>
                                        <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: 1 }}>ALLERGY</Typography>
                                        {loading ? (
                                            <Typography variant="body2" color="text.secondary">Loading...</Typography>
                                        ) : (
                                            (healthRecords.filter(r => r.typeHistory === 'ALLERGY').length === 0) ? (
                                                <Typography variant="body2" color="text.secondary">No allergy records.</Typography>
                                            ) : (
                                                <Box component="table" sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                                                    <Box component="thead">
                                                        <Box component="tr" sx={{ bgcolor: 'primary.light' }}>
                                                            <Box component="th" sx={{ textAlign: 'left', p: 1, fontWeight: 700, color: 'primary.main', borderRadius: '8px 0 0 0', color: "#fff" }}>Name</Box>
                                                            <Box component="th" sx={{ textAlign: 'left', p: 1, fontWeight: 700, color: 'primary.main', color: "#fff" }}>Reaction/Note</Box>
                                                            <Box component="th" sx={{ textAlign: 'center', p: 1, fontWeight: 700, color: 'primary.main', borderRadius: '0 8px 0 0', color: "#fff" }}>Image</Box>
                                                        </Box>
                                                    </Box>
                                                    <Box component="tbody">
                                                        {healthRecords.filter(r => r.typeHistory === 'ALLERGY').map((record, idx, arr) => (
                                                            <Box component="tr" key={record.conditionId} sx={{ bgcolor: idx % 2 === 0 ? 'white' : 'primary.100', borderRadius: 2 }}>
                                                                <Box component="td" sx={{ p: 1, borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #e0e0e0' }}>{record.name}</Box>
                                                                <Box component="td" sx={{ p: 1, borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #e0e0e0' }}>{record.reactionOrNote}</Box>
                                                                <Box component="td" sx={{ p: 1, textAlign: 'center', borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #e0e0e0' }}>
                                                                    {record.imageUrl ? (
                                                                        <Button size="small" variant="outlined" color="primary" startIcon={<PersonIcon />} onClick={() => window.open(record.imageUrl, '_blank')}>See</Button>
                                                                    ) : (
                                                                        <Typography variant="caption" color="text.secondary">No image</Typography>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )
                                        )}
                                    </Paper>
                                </Grid>
                                {/* MEDICAL_HISTORY Section */}
                                <Grid size={12}>
                                    <Paper elevation={1} sx={{ flex: 1, minWidth: 320, padding: 3, margin: 1, bgcolor: 'secondary.50', borderRadius: 3, boxShadow: 4 }}>
                                        <Typography variant="h6" color="secondary" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: 1 }}>MEDICAL HISTORY</Typography>
                                        {loading ? (
                                            <Typography variant="body2" color="text.secondary">Loading...</Typography>
                                        ) : (
                                            (healthRecords.filter(r => r.typeHistory === 'MEDICAL_HISTORY').length === 0) ? (
                                                <Typography variant="body2" color="text.secondary">No medical history records.</Typography>
                                            ) : (
                                                <Box component="table" sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                                                    <Box component="thead">
                                                        <Box component="tr" sx={{ bgcolor: 'secondary.light' }}>
                                                            <Box component="th" sx={{ textAlign: 'left', p: 1, fontWeight: 700, color: 'secondary.main', borderRadius: '8px 0 0 0', color: "#fff" }}>Name</Box>
                                                            <Box component="th" sx={{ textAlign: 'left', p: 1, fontWeight: 700, color: 'secondary.main', color: "#fff" }}>Reaction/Note</Box>
                                                            <Box component="th" sx={{ textAlign: 'center', p: 1, fontWeight: 700, color: 'secondary.main', borderRadius: '0 8px 0 0', color: "#fff" }}>Image</Box>
                                                        </Box>
                                                    </Box>
                                                    <Box component="tbody">
                                                        {healthRecords.filter(r => r.typeHistory === 'MEDICAL_HISTORY').map((record, idx, arr) => (
                                                            <Box component="tr" key={record.conditionId} sx={{ bgcolor: idx % 2 === 0 ? 'white' : 'secondary.100', borderRadius: 2 }}>
                                                                <Box component="td" sx={{ p: 1, borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #e0e0e0' }}>{record.name}</Box>
                                                                <Box component="td" sx={{ p: 1, borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #e0e0e0' }}>{record.reactionOrNote}</Box>
                                                                <Box component="td" sx={{ p: 1, textAlign: 'center', borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #e0e0e0' }}>
                                                                    {record.imageUrl ? (
                                                                        <Button size="small" variant="outlined" color="secondary" startIcon={<PersonIcon />} onClick={() => window.open(record.imageUrl, '_blank')}>See</Button>
                                                                    ) : (
                                                                        <Typography variant="caption" color="text.secondary">No image</Typography>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )
                                        )}
                                    </Paper>
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
                                            <Typography variant="body1" fontWeight={600}>Name : {parentName}</Typography>
                                            <Typography variant="body1" fontWeight={600}>Phone Number : {parentPhone}</Typography>
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
                                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2', marginX: 30 }}>
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
                {selectedConsentFormId ? (
                    <ScheduleResult
                        consentFormId={selectedConsentFormId}
                        pupilData={selectedPupilData}
                        onBack={() => {
                            setSelectedConsentFormId(null);
                            setSelectedPupilData(null);
                        }}
                    />
                ) : (
                    <Grid container size={12} spacing={2} sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Grid size={12} sx={{ bgcolor: '#fff', px: 10, borderRadius: 2, width: '100%' }}>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                {/* basic infor */}
                                <Grid container spacing={2} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }} size={12}>
                                    {/* Header */}
                                    <Grid item size={12}>
                                        <Item>
                                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2', marginX: 30 }}>
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
                                            {isHealthCheckLoading ? (
                                                <Box p={4}><Typography>Loading health check history...</Typography></Box>
                                            ) : healthCheckError ? (
                                                <Box p={4}><Typography color="error">Error loading health check history: {healthCheckError?.message || "Unknown error"}</Typography></Box>
                                            ) : healthCheckList.length === 0 ? (
                                                <Box className="empty-state" sx={{ textAlign: 'center', py: 6 }}>
                                                    <CalendarIcon className="empty-icon" sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                                                    <Typography variant="h6">No Health Check History</Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        No health check campaigns or results found for this pupil.
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow className="table-header">
                                                                <TableCell>Title</TableCell>
                                                                <TableCell>Description</TableCell>
                                                                <TableCell>Date</TableCell>
                                                                <TableCell>Status</TableCell>
                                                                <TableCell>Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {healthCheckList.map((campaign, idx) => {
                                                                // Defensive: consentForms may be an array or object
                                                                const consentForm = Array.isArray(campaign.consentForms)
                                                                    ? campaign.consentForms[0]
                                                                    : campaign.consentForms;
                                                                const history = consentForm?.healthCheckHistoryRes;
                                                                const consentFormId = consentForm?.consentFormId;
                                                                // Use campaign.statusHealthCampaign for status
                                                                // Use history?.createdAt for date
                                                                return (
                                                                    <TableRow key={campaign.campaignId || idx} className="table-row">
                                                                        <TableCell>{campaign.title}</TableCell>
                                                                        <TableCell>{campaign.description}</TableCell>
                                                                        <TableCell>{history?.createdAt ? new Date(history.createdAt).toLocaleDateString() : '-'}</TableCell>
                                                                        <TableCell>
                                                                            <Chip
                                                                                label={campaign.statusHealthCampaign || (history ? 'Complete' : 'Pending')}
                                                                                color={campaign.statusHealthCampaign === 'COMPLETED' ? 'success' : campaign.statusHealthCampaign === 'IN_PROGRESS' ? 'info' : 'warning'}
                                                                                size="small"
                                                                                className="status-chip"
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Button size="small" variant="outlined" className="details-button"
                                                                                onClick={() => {
                                                                                    setSelectedConsentFormId(consentFormId);
                                                                                    setSelectedPupilData(campaign);
                                                                                }}
                                                                                disabled={!consentFormId}
                                                                            >
                                                                                Details
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
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
                )}
            </TabPanel >

            <TabPanel value={tabValue} index={3}>
                {selectedEventId ? (
                    <MedicalEventDetails
                        eventId={selectedEventId}
                        onCancel={() => setSelectedEventId(null)}
                    />
                ) : (
                    <Grid container size={12} spacing={2} sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Grid size={12} sx={{ bgcolor: '#fff', px: 10, borderRadius: 2, width: '100%' }}>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                {/* basic infor */}
                                <Grid container spacing={2} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2, }} size={12}>
                                    {/* Header */}
                                    <Grid item size={12} >
                                        <Item >
                                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2', marginX: 30 }}>
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
                                                                        <Button size="small" variant="outlined" className="details-button" onClick={() => setSelectedEventId(event.medicalEventId)}>
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
                )
                }
            </TabPanel >









        </Grid >
    )
}
export default MedicalEventResultForm