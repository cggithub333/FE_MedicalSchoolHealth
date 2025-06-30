import { useState, useEffect } from "react"
import "./StyleScheduleDetails.scss"
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Box,
    Chip,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    InputAdornment,
    Snackbar,
    Alert,
    LinearProgress,
    Fade,
    Grow,
    Paper,
} from "@mui/material"
import {
    ArrowBack,
    ExpandMore,
    Save,
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
} from "@mui/icons-material"
import { useSaveResultOfHealthCheckCampaign } from "../../../../../hooks/schoolnurse/healthcheck/schedule/useSaveResultOfHealthCheckCampaign"
import { useNavigate } from "react-router-dom"

// Frontend disease categories - this is the comprehensive list for health checks
const HEALTH_CHECK_DISEASES = [
    { disease_id: 1, name: "Chiều cao", category: "physical" },
    { disease_id: 2, name: "Cân nặng", category: "physical" },
    { disease_id: 3, name: "BMI", category: "physical" },
    { disease_id: 4, name: "Thị lực mắt phải", category: "vision" },
    { disease_id: 5, name: "Thị lực mắt trái", category: "vision" },
    { disease_id: 6, name: "Nghe", category: "hearing" },
    { disease_id: 7, name: "Tai mũi họng", category: "hearing" },
    { disease_id: 8, name: "Răng sâu", category: "dental" },
    { disease_id: 9, name: "Viêm lợi", category: "dental" },
    { disease_id: 10, name: "Vệ sinh răng miệng", category: "dental" },
    { disease_id: 11, name: "Bệnh ngoài da", category: "skin" },
    { disease_id: 12, name: "Nhiễm trùng", category: "skin" },
    { disease_id: 13, name: "Ghẻ chàm", category: "skin" },
    { disease_id: 14, name: "Nhịp tim", category: "cardiovascular" },
    { disease_id: 15, name: "Nhịp thở", category: "cardiovascular" },
    { disease_id: 16, name: "Âm phổi", category: "cardiovascular" },
    { disease_id: 17, name: "Bệnh tim bẩm sinh", category: "cardiovascular" },
    { disease_id: 18, name: "Tiền sử bệnh lý", category: "medical" },
    { disease_id: 19, name: "Quan sát cơ quan sinh dục ngoài", category: "reproductive" },
    { disease_id: 20, name: "Vệ sinh cơ quan sinh dục", category: "reproductive" },
    { disease_id: 21, name: "Dị tật bẩm sinh cơ quan sinh dục", category: "reproductive" },
]

const ScheduleDetails = ({ pupilId, pupilData, onBack }) => {
    const navigate = useNavigate();
    const [healthData, setHealthData] = useState({})
    const [notes, setNotes] = useState({})
    const [measurements, setMeasurements] = useState({})
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [autoSaving, setAutoSaving] = useState(false)
    const [expandedSections, setExpandedSections] = useState({
        physical: true,
        vision: false,
        hearing: false,
        dental: false,
        skin: false,
        cardiovascular: false,
        reproductive: false,
        medical: false,
    })
    const { saveResultOfHealthCheckCampaign, isSaving } = useSaveResultOfHealthCheckCampaign();
    const [status, setStatus] = useState(null); // "COMPLETED" or "ABSENT"

    // Use frontend disease list instead of API data
    const sensitive_disease = HEALTH_CHECK_DISEASES

    const diseaseCategories = {
        physical: { title: "Physical Measurements", icon: <Height />, diseases: [] },
        vision: { title: "Vision & Eye Health", icon: <RemoveRedEye />, diseases: [] },
        hearing: { title: "Hearing & ENT", icon: <Hearing />, diseases: [] },
        dental: { title: "Dental Health", icon: <MedicalServices />, diseases: [] },
        skin: { title: "Skin Conditions", icon: <Person />, diseases: [] },
        cardiovascular: { title: "Cardiovascular", icon: <Favorite />, diseases: [] },
        reproductive: { title: "Reproductive Health", icon: <Psychology />, diseases: [] },
        medical: { title: "Medical History", icon: <Assignment />, diseases: [] },
    }

    // Group diseases by category
    sensitive_disease.forEach((disease) => {
        const category = disease.category
        if (diseaseCategories[category]) {
            diseaseCategories[category].diseases.push(disease)
        }
    })

    // Handle checkbox changes
    const handleHealthCheck = (diseaseId, checked) => {
        setHealthData((prev) => ({ ...prev, [diseaseId]: checked }))
    }

    // Handle note changes
    const handleNoteChange = (diseaseId, value) => {
        setNotes((prev) => ({ ...prev, [diseaseId]: value }))
    }

    // Handle measurement changes
    const handleMeasurementChange = (diseaseId, value) => {
        setMeasurements((prev) => ({ ...prev, [diseaseId]: value }))
    }

    // Handle section expansion
    const handleSectionToggle = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
    }

    // Map the current form state to the required DB format
    const getDetailsForDB = () => ({
        healthId: 0,
        height: measurements[1] || '',
        weight: measurements[2] || '',
        rightEyeVision: measurements[4] || '',
        leftEyeVision: measurements[5] || '',
        bloodPressure: notes[18] || '',
        heartRate: measurements[14] || '',
        dentalCheck: notes[8] || '',
        earCondition: notes[6] || '',
        noseCondition: notes[7] || '',
        throatCondition: notes[7] || '',
        skinAndMucosa: notes[11] || '',
        hearAnuscultaion: notes[16] || '',
        chestShape: notes[16] || '',
        lungs: notes[16] || '',
        digestiveSystem: notes[18] || '',
        urinarySystem: notes[18] || '',
        musculoskeletalSystem: notes[18] || '',
        neurologyAndPsychiatry: notes[18] || '',
        genitalExamination: notes[19] || '',
        additionalNotes: notes[20] || '',
        unusualSigns: notes[21] || '',
    });

    // Save result to DB using custom hook
    const handleSave = async (newStatus) => {
        setStatus(newStatus);
        const details = getDetailsForDB();
        const consentId = pupilData?.healthCheckConsentId || pupilData?.consentFormId;
        if (!consentId) {
            console.error("Consent ID not found! pupilData:", pupilData);
            setSnackbar({ open: true, message: "Consent ID not found in pupilData. Please check your data source.", severity: "error" });
            return;
        }
        const payload = { ...details, status: newStatus };
        const success = await saveResultOfHealthCheckCampaign(consentId, payload);
        if (success) {
            setSnackbar({ open: true, message: `Saved as ${newStatus}.`, severity: "success" });
        } else {
            setSnackbar({ open: true, message: "Failed to save result.", severity: "error" });
        }
    };

    // Calculate completion percentage
    const totalChecks = sensitive_disease.length
    const completedChecks = Object.values(healthData).filter(Boolean).length
    const completionPercentage = totalChecks > 0 ? (completedChecks / totalChecks) * 100 : 0

    // Handle form submission
    const handleSubmit = () => {
        setSnackbar({
            open: true,
            message: `Health check completed for student ${pupilData?.firstName} ${pupilData?.lastName}!`,
            severity: "success",
        })
        console.log("Health check details (for DB):", {
            pupil_id: pupilId,
            pupilData,
            details: getDetailsForDB(),
        })
    }

    if (!sensitive_disease.length) {
        return (
            <div className="schedule-details-root empty-container">
                <Warning sx={{ fontSize: 60, color: "#ff9800", mb: 2 }} />
                <Typography variant="h5">No Health Check Data</Typography>
                <Typography variant="body1" color="text.secondary">
                    No health check data found for student {pupilId}
                </Typography>
                <Button variant="contained" startIcon={<ArrowBack />} onClick={onBack} sx={{ mt: 2 }}>
                    Back to Student List
                </Button>
            </div>
        )
    }

    return (
        <div className="schedule-details-root enhanced-ui">
            {/* Quick Navigation Bar */}


            <Fade in={true} timeout={500}>
                <Card className="details-header modern-card" elevation={2}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <IconButton
                                    onClick={onBack}
                                    className="back-button"
                                    sx={{
                                        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                                        color: "white",
                                        boxShadow: 2,
                                        borderRadius: 2,
                                        p: 1.2,
                                        transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
                                        '&:hover': {
                                            background: "linear-gradient(135deg, #1565c0, #1976d2)",
                                            transform: "translateY(-2px) scale(1.08)",
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    <ArrowBack />
                                </IconButton>
                                <Box>
                                    <Typography variant="h4" className="header-title" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                                        Health Check Assessment
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={2} mt={1}>
                                        <Chip
                                            icon={<Person />}
                                            label={`${pupilData?.firstName} ${pupilData?.lastName}`}
                                            color="primary"
                                            variant="filled"
                                            sx={{ fontWeight: 500, fontSize: 16, px: 1.5, py: 0.5, borderRadius: 2 }}
                                        />
                                        <Chip icon={<Assignment />} label={`ID: ${pupilId}`} color="secondary" variant="filled" sx={{ fontWeight: 500, px: 1.2, borderRadius: 2 }} />
                                        <Chip label={pupilData?.gradeName || "Grade"} color="info" variant="filled" sx={{ fontWeight: 500, px: 1.2, borderRadius: 2 }} />
                                    </Box>
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2}>
                                {autoSaving && (
                                    <Chip
                                        icon={<LinearProgress size={16} />}
                                        label="Auto-saving..."
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                        sx={{ fontWeight: 500, px: 1.2, borderRadius: 2 }}
                                    />
                                )}
                            </Box>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={completionPercentage}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "#e3f2fd",
                                boxShadow: 1,
                                my: 1,
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 5,
                                    background: "linear-gradient(90deg, #43a047, #66bb6a)",
                                },
                            }}
                        />
                    </CardContent>
                </Card>
            </Fade>

            <div className="health-check-sections modern-section-list">
                {Object.entries(diseaseCategories).map(([categoryKey, category], index) => {
                    if (category.diseases.length === 0) return null

                    return (
                        <Grow in={true} timeout={300 + index * 100} key={categoryKey}>
                            <Accordion
                                expanded={expandedSections[categoryKey]}
                                onChange={() => handleSectionToggle(categoryKey)}
                                className="health-section modern-accordion"
                                sx={{
                                    mb: 2.5,
                                    borderRadius: 3,
                                    boxShadow: expandedSections[categoryKey] ? 4 : 1,
                                    background: expandedSections[categoryKey] ? "linear-gradient(120deg, #f5fafd 60%, #e3f2fd 100%)" : "#f8fafc",
                                    transition: "all 0.25s cubic-bezier(.4,2,.6,1)",
                                    border: expandedSections[categoryKey] ? "2px solid #90caf9" : "1px solid #e3e3e3",
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMore />} className="section-header modern-accordion-header" sx={{
                                    minHeight: 64,
                                    background: expandedSections[categoryKey] ? "#e3f2fd" : "#f5fafd",
                                    borderRadius: 3,
                                    boxShadow: expandedSections[categoryKey] ? 2 : 0,
                                    px: 3,
                                    py: 1.5,
                                    '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2 },
                                }}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Box sx={{ fontSize: 30, color: '#1976d2', mr: 1 }}>{category.icon}</Box>
                                        <Typography variant="h6" className="section-title" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                                            {category.title}
                                        </Typography>
                                        <Chip
                                            label={`${category.diseases.filter((d) => healthData[d.disease_id]).length}/${category.diseases.length}`}
                                            size="small"
                                            color={category.diseases.filter((d) => healthData[d.disease_id]).length === category.diseases.length ? "success" : "default"}
                                            variant="filled"
                                            sx={{ fontWeight: 600, px: 1.2, borderRadius: 2, ml: 1 }}
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails className="section-content modern-accordion-details" sx={{ px: 3, py: 2, background: '#fafdff', borderRadius: 2 }}>
                                    <Grid container spacing={2}>
                                        {category.diseases.map((disease) => (
                                            <Grid item xs={12} key={disease.disease_id}>
                                                <Paper className="disease-item modern-disease-item" elevation={0} sx={{
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    background: '#fff',
                                                    boxShadow: 1,
                                                    mb: 1,
                                                    transition: 'box-shadow 0.2s',
                                                    '&:hover': { boxShadow: 3, background: '#f5fafd' },
                                                }}>
                                                    <Box display="flex" alignItems="flex-start" gap={1.5}>
                                                        <Box flex={1}>
                                                            <Typography variant="subtitle2" className="disease-name" sx={{ fontWeight: 600, fontSize: 15, mb: 0.25 }}>
                                                                {disease.name}
                                                            </Typography>
                                                            <Box display="flex" gap={1.5} mt={0.5}>
                                                                {/* Only show measurement for physical category, no notes for physical */}
                                                                {categoryKey === 'physical' ? (
                                                                    <TextField
                                                                        size="small"
                                                                        label={disease.name}
                                                                        value={measurements[disease.disease_id] || ""}
                                                                        onChange={(e) => handleMeasurementChange(disease.disease_id, e.target.value)}
                                                                        InputProps={{
                                                                            endAdornment: (
                                                                                <InputAdornment position="end">
                                                                                    {disease.name.includes("Chiều cao")
                                                                                        ? "cm"
                                                                                        : disease.name.includes("Cân nặng")
                                                                                            ? "kg"
                                                                                            : disease.name.includes("BMI")
                                                                                                ? "kg/m²"
                                                                                                : disease.name.includes("Nhịp tim")
                                                                                                    ? "bpm"
                                                                                                    : disease.name.includes("Nhịp thở")
                                                                                                        ? "/min"
                                                                                                        : ""}
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        sx={{ minWidth: 90, maxWidth: 120, background: '#f5fafd', borderRadius: 1, boxShadow: 0, fontWeight: 500, fontSize: 13 }}
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        {/* For non-physical: no measurement, only notes */}
                                                                        <TextField
                                                                            size="small"
                                                                            label="Notes & Observations"
                                                                            multiline
                                                                            rows={1}
                                                                            value={notes[disease.disease_id] || ""}
                                                                            onChange={(e) => handleNoteChange(disease.disease_id, e.target.value)}
                                                                            placeholder="Add notes..."
                                                                            sx={{ flex: 1, background: '#fafdff', borderRadius: 1, fontWeight: 500, fontSize: 13 }}
                                                                        />
                                                                    </>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grow>
                    )
                })}
            </div>

            <Fade in={true} timeout={800}>
                <Box className="action-footer modern-footer" sx={{
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 10,
                    background: 'linear-gradient(90deg, #fafdff 80%, #e3f2fd 100%)',
                    boxShadow: 3,
                    borderRadius: 3,
                    py: 2.5,
                    px: 4,
                    mt: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 3,
                    transition: 'box-shadow 0.2s',
                }}>
                    <Button variant="outlined" size="large" startIcon={<ArrowBack />} onClick={onBack} className="footer-button" sx={{ fontWeight: 600, borderRadius: 2, px: 3, py: 1 }}>
                        Back to Students
                    </Button>

                </Box>
            </Fade>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default ScheduleDetails
