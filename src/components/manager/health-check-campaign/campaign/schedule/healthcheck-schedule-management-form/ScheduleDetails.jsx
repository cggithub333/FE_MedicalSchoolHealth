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
import { useGetDetailsOfCampaignByID } from "../../../../../../hooks/manager/healthcheck/campaign/useGetDetaisOfCampaignByID"
import { useNavigate } from "react-router-dom"

// Health check fields matching healthCheckHistoryRes keys
const HEALTH_CHECK_FIELDS = [
    { key: "height", name: "Height", category: "physical", type: "measurement", unit: "cm", icon: Height },
    { key: "weight", name: "Weight", category: "physical", type: "measurement", unit: "kg", icon: MonitorWeight },
    { key: "rightEyeVision", name: "Right Eye Vision", category: "vision", type: "measurement", icon: Visibility },
    { key: "leftEyeVision", name: "Left Eye Vision", category: "vision", type: "measurement", icon: RemoveRedEye },
    { key: "bloodPressure", name: "Blood Pressure", category: "cardiovascular", type: "note", icon: Favorite },
    { key: "heartRate", name: "Heart Rate", category: "cardiovascular", type: "measurement", unit: "bpm", icon: Favorite },
    { key: "dentalCheck", name: "Dental Check", category: "dental", type: "note", icon: MedicalServices },
    { key: "earCondition", name: "Ear", category: "hearing", type: "note", icon: Hearing },
    { key: "noseCondition", name: "Nose", category: "hearing", type: "note", icon: Hearing },
    { key: "throatCondition", name: "Throat", category: "hearing", type: "note", icon: Hearing },
    { key: "skinAndMucosa", name: "Skin & Mucosa", category: "skin", type: "note", icon: LocalHospital },
    { key: "hearAnuscultaion", name: "Lung Auscultation", category: "cardiovascular", type: "note", icon: Favorite },
    { key: "chestShape", name: "Chest Shape", category: "cardiovascular", type: "note", icon: Favorite },
    { key: "lungs", name: "Lungs", category: "cardiovascular", type: "note", icon: Favorite },
    { key: "digestiveSystem", name: "Digestive System", category: "medical", type: "note", icon: MedicalServices },
    { key: "urinarySystem", name: "Urinary System", category: "medical", type: "note", icon: MedicalServices },
    { key: "musculoskeletalSystem", name: "Musculoskeletal System", category: "medical", type: "note", icon: SelfImprovement },
    { key: "neurologyAndPsychiatry", name: "Neurology & Psychiatry", category: "medical", type: "note", icon: Psychology },
    { key: "genitalExamination", name: "Genital Examination", category: "reproductive", type: "note", icon: Person },
]

const categoryConfig = {
    physical: { name: "Physical", icon: Height, color: "#2196F3" },
    vision: { name: "Vision", icon: Visibility, color: "#4CAF50" },
    hearing: { name: "ENT (Ear, Nose, Throat)", icon: Hearing, color: "#FF9800" },
    dental: { name: "Dental", icon: MedicalServices, color: "#9C27B0" },
    skin: { name: "Skin & Mucosa", icon: LocalHospital, color: "#E91E63" },
    cardiovascular: { name: "Cardiovascular & Respiratory", icon: Favorite, color: "#F44336" },
    reproductive: { name: "Genital Examination", icon: Person, color: "#3F51B5" },
    medical: { name: "General Examination", icon: MedicalServices, color: "#009688" },
}

const ScheduleDetails = ({ consentFormId, pupilData, onBack }) => {
    const navigate = useNavigate();
    const campaignId = pupilData?.campaignId || pupilData?.campaignID || pupilData?.campaign_id;
    const { campaignDetails, isLoading } = useGetDetailsOfCampaignByID(campaignId);
    // Find the consentForm by consentFormId (not pupilId)
    const consentForm = (campaignDetails?.data?.consentForms || campaignDetails?.consentForms || []).find(
        (form) => String(form.consentFormId) === String(consentFormId)
    ) || {};
    const healthCheckHistory = consentForm.healthCheckHistoryRes || {};
    // Disease notes (for genital health check, etc.)
    const diseaseNotesArr = Array.isArray(consentForm.disease)
        ? consentForm.disease.map(d => `${d.name}: ${d.note}`)
        : [];

    // Show loading spinner if fetching
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
        const history = consentForm.healthCheckHistoryRes;
        const groupedFields = HEALTH_CHECK_FIELDS.reduce((acc, field) => {
            if (!acc[field.category]) acc[field.category] = [];
            acc[field.category].push(field);
            return acc;
        }, {});
        return (
            <div className="schedule-details-root enhanced-ui" style={{
                background: 'linear-gradient(135deg, #fafdff 0%, #e3f0ff 100%)',
                minHeight: '100vh',
                padding: '24px 0',
            }}>
                <Fade in={true} timeout={400}>
                    <Card elevation={0} sx={{
                        maxWidth: 1000,
                        mx: 'auto',
                        borderRadius: 4,
                        boxShadow: '0 2px 16px 0 rgba(33, 150, 243, 0.08)',
                        border: 'none',
                        background: 'rgba(255,255,255,0.55)',
                        backdropFilter: 'blur(6px)',
                        p: { xs: 1.5, md: 3 },
                        position: 'relative',
                        overflow: 'visible',
                    }}>
                        {/* Back to List button at the top left */}
                        <CardContent sx={{ p: 0 }}>
                            {/* header */}
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                {/* avatar */}
                                <Box sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #1976d2 60%, #64b5f6 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 1px 6px 0 #1976d233',
                                }}>
                                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800, fontFamily: 'inherit', fontSize: 20 }}>
                                        {consentForm.pupilRes?.lastName?.[0] || ''}{consentForm.pupilRes?.firstName?.[0] || ''}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 0.5, mb: 0.5, color: '#1976d2', fontFamily: 'inherit', fontSize: 22 }}>
                                        Health Check Result
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#333', fontWeight: 500, fontSize: 15 }}>
                                        <span style={{ fontWeight: 700 }}>{consentForm.pupilRes?.lastName} {consentForm.pupilRes?.firstName}</span> <span style={{ color: '#1976d2', fontWeight: 700 }}>(ID: {consentForm.pupilRes?.pupilId})</span>
                                    </Typography>
                                </Box>
                            </Box>
                            {/* status chips */}
                            <Box mt={1} mb={1}>
                                {Object.entries(groupedFields).map(([cat, fields]) => {
                                    const catInfo = categoryConfig[cat] || {};
                                    const CatIcon = catInfo.icon || Assignment;
                                    return (
                                        <Box key={cat} mb={2} alignItems="center" gap={1}>
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                <CatIcon sx={{ color: catInfo.color, fontSize: 18, opacity: 0.7 }} />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: catInfo.color, fontFamily: 'inherit', fontSize: 16, letterSpacing: 0.2 }}>
                                                    {catInfo.name || cat}
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={1.5}>
                                                {fields.map((field) => {
                                                    // Special handling for Genital Examination: show disease notes array
                                                    if (field.key === "genitalExamination") {
                                                        return (
                                                            <Grid item xs={12} sm={6} md={4} key={field.key}>
                                                                <Paper elevation={0} sx={{
                                                                    p: 1.2,
                                                                    borderRadius: 2,
                                                                    mb: 0.5,
                                                                    background: 'rgba(244,248,253,0.7)',
                                                                    boxShadow: '0 1px 4px 0 rgba(33, 150,243, 0.04)',
                                                                    minHeight: 56,
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'flex-start',
                                                                    justifyContent: 'center',
                                                                    border: '1px solid #e3eafc',
                                                                }}>
                                                                    <Box display="flex" alignItems="center" gap={0.5} mb={0.2}>
                                                                        {field.icon && <field.icon sx={{ color: catInfo.color, fontSize: 15, opacity: 0.6 }} />}
                                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#222', fontSize: 13 }}>Disease</Typography>
                                                                    </Box>
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
                                                                </Paper>
                                                            </Grid>
                                                        );
                                                    }
                                                    // Default rendering for other fields
                                                    return (
                                                        <Grid item xs={12} sm={6} md={4} key={field.key}>
                                                            <Paper elevation={0} sx={{
                                                                p: 1.2,
                                                                borderRadius: 2,
                                                                mb: 0.5,
                                                                background: 'rgba(244,248,253,0.7)',
                                                                boxShadow: '0 1px 4px 0 rgba(33, 150, 243, 0.04)',
                                                                minHeight: 56,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'flex-start',
                                                                justifyContent: 'center',
                                                                border: '1px solid #e3eafc',
                                                            }}>
                                                                <Box display="flex" alignItems="center" gap={0.5} mb={0.2}>
                                                                    {field.icon && <field.icon sx={{ color: catInfo.color, fontSize: 15, opacity: 0.6 }} />}
                                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#222', fontSize: 13 }}>{field.name}</Typography>
                                                                </Box>
                                                                <Typography variant="subtitle1" sx={{ color: '#1976d2', fontWeight: 700, fontSize: 16, lineHeight: 1.1, wordBreak: 'break-word' }}>
                                                                    {history[field.key] !== undefined && history[field.key] !== null && history[field.key] !== "" ? `${history[field.key]}${field.unit ? ' ' + field.unit : ''}` : <span style={{ color: '#bdbdbd', fontWeight: 400 }}>-</span>}
                                                                </Typography>
                                                            </Paper>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Box>
                                    )
                                })}
                            </Box>

                        </CardContent>
                        {/* Back to List button at the bottom */}
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
                    </Card>
                </Fade>
            </div>
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

export default ScheduleDetails
