import { useState } from "react"
import "./StyleScheduleDetails.scss"
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    LinearProgress,
    Fade,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material"
import {
    ArrowBack,
    ExpandMore,
    CheckCircle,
    Warning,
    Height,
    RemoveRedEye,
    Hearing,
    MedicalServices,
    Favorite,
    Psychology,
    Person,
    Assignment,
    MonitorWeight,
    Visibility,
    LocalHospital,
    SelfImprovement,
} from "@mui/icons-material"
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
import { styled } from '@mui/material/styles';
import { useGetDetailsOfCampaignByID } from "../../../../../hooks/manager/healthcheck/campaign/useGetDetaisOfCampaignByID"
import { useNavigate } from "react-router-dom"

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


const ScheduleResult = ({ consentFormId, pupilData, onBack }) => {
    const navigate = useNavigate();
    const campaignId = pupilData?.campaignId || pupilData?.campaignID || pupilData?.campaign_id;
    const { campaignDetails, isLoading } = useGetDetailsOfCampaignByID(campaignId);
    // Find the consentForm by consentFormId (not pupilId)
    const consentForm = (campaignDetails?.data?.consentForms || campaignDetails?.consentForms || []).find(
        (form) => String(form.consentFormId) === String(consentFormId)
    ) || {};
    const healthCheckHistory = consentForm.healthCheckHistoryRes || {};
    // Formalized entity extraction
    const fieldText = {
        height: healthCheckHistory?.height,
        weight: healthCheckHistory?.weight,
        rightEyeVision: healthCheckHistory?.rightEyeVision,
        leftEyeVision: healthCheckHistory?.leftEyeVision,
        bloodPressure: healthCheckHistory?.bloodPressure,
        heartRate: healthCheckHistory?.heartRate,
        hearAnuscultaion: healthCheckHistory?.hearAnuscultaion,
        lungs: healthCheckHistory?.lungs,
        dentalCheck: healthCheckHistory?.dentalCheck,
        earCondition: healthCheckHistory?.earCondition,
        noseCondition: healthCheckHistory?.noseCondition,
        throatCondition: healthCheckHistory?.throatCondition,
        skinAndMucosa: healthCheckHistory?.skinAndMucosa,
        digestiveSystem: healthCheckHistory?.digestiveSystem,
        urinarySystem: healthCheckHistory?.urinarySystem,
        musculoskeletalSystem: healthCheckHistory?.musculoskeletalSystem,
        neurologyAndPsychiatry: healthCheckHistory?.neurologyAndPsychiatry,
        genitalExamination: healthCheckHistory?.genitalExamination,
        additionalNotes: healthCheckHistory?.additionalNotes,
        unusualSigns: healthCheckHistory?.unusualSigns,
        healthId: healthCheckHistory?.healthId,
    };
    // Disease notes (for genital health check, etc.)

    if (isLoading) {
        return (
            <div className="schedule-details-root loading-container">
                <LinearProgress />
                <Typography variant="h6" sx={{ mt: 2, color: "#666" }}>
                    Loading student health check details...
                </Typography>
            </div>
        )
    }

    // Show health check result for the current student (consentFormId)
    if (consentForm && consentForm.healthCheckHistoryRes) {

        return (
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
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Height
                        </Typography>

                        <span>{fieldText.height} cm</span></Item>
                </Grid>
                <Grid size={4}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Weight
                        </Typography>
                        <span>{fieldText.weight} kg</span></Item>
                </Grid>
                <Grid size={4}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Heart rate
                        </Typography>
                        <span>{fieldText.heartRate} bpm</span></Item>
                </Grid>
                <Grid size={6}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Left eye
                        </Typography>
                        <span>{fieldText.leftEyeVision} /10</span></Item>
                </Grid>
                <Grid size={6}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Right eye
                        </Typography>
                        <span>{fieldText.rightEyeVision} /10</span></Item>
                </Grid>
                <Grid size={4}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Ear Condition
                        </Typography>
                        <span>{fieldText.earCondition}</span></Item>
                </Grid>
                <Grid size={4}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Nose Condition
                        </Typography>
                        <span>{fieldText.noseCondition}</span></Item>
                </Grid>
                <Grid size={4}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Throat Condition
                        </Typography>
                        <span>{fieldText.throatCondition}</span></Item>
                </Grid>
                <Grid size={6}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Skin and Mucosa
                        </Typography>
                        <span>{fieldText.skinAndMucosa}</span></Item>
                </Grid>
                <Grid size={6}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Dental Check
                        </Typography>
                        <span>{fieldText.dentalCheck}</span></Item>
                </Grid>

                <Grid size={4}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Blood Pressure
                        </Typography>
                        <span>{fieldText.bloodPressure}</span></Item>
                </Grid>
                <Grid size={4}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Lung Auscultation
                        </Typography>
                        <span>{fieldText.hearAnuscultaion}</span></Item>
                </Grid>
                <Grid size={4}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            Lungs
                        </Typography>
                        <span>{fieldText.lungs}</span></Item>
                </Grid>

                <Grid size={12}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            GENITAL EXAMINATION
                        </Typography>

                        <Grid item xs={12} sm={6}>
                            {Array.isArray(consentForm.disease) && consentForm.disease.length > 0 ? (
                                <Box sx={{ width: '100%' }}>
                                    {consentForm.disease.map((d, idx) => (
                                        <Paper key={d.diseaseId || idx} elevation={0} sx={{
                                            p: 1,
                                            mb: 0.5,
                                            borderRadius: 1.5,
                                            background: '#f3f7fb',
                                            border: '1px solid #e0eafc',
                                        }}>
                                            <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 700, fontSize: 14 }}>
                                                {d.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#333', fontSize: 13 }}>
                                                {d.note || '-'}
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" sx={{ color: '#bdbdbd', fontWeight: 400 }}>No disease notes</Typography>
                            )}
                        </Grid>
                    </Item>
                </Grid>




                <Grid size={12}>
                    <Item>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                            NOTES
                        </Typography>
                        <span>{fieldText.additionalNotes || 'No additional notes'}</span></Item>
                </Grid>
                <Grid size={12}>
                    <Box display="flex" justifyContent="flex-start" mt={3} mb={1} sx={{ pl: { xs: 0, md: 3 } }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={onBack}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                color: '#1976d2',
                                borderColor: '#b3d1fa',
                                boxShadow: '0 1px 4px 0 #1976d233',
                                textTransform: 'none',
                                background: 'rgba(255,255,255,0.85)',
                                '&:hover': {
                                    background: '#e3f0ff',
                                    borderColor: '#1976d2',
                                },
                                minWidth: 180,
                                fontSize: 16,
                            }}
                        >
                            Back to List
                        </Button>
                    </Box>
                </Grid>
            </Grid>

        );
    }

    // Empty state if no health check data
    return (
        <div className="schedule-details-root empty-container">
            <Warning sx={{ fontSize: 60, color: "#ff9800", mb: 2 }} />
            <Typography variant="h5">No Health Check Data</Typography>
            <Typography variant="body1" color="text.secondary">
                No health check data found for student {consentForm.pupilRes?.pupilId}
            </Typography>
            <Button variant="contained" startIcon={<ArrowBack />} onClick={onBack} sx={{ mt: 2 }}>
                Back to Student List
            </Button>
        </div>
    )
}

export default ScheduleResult
