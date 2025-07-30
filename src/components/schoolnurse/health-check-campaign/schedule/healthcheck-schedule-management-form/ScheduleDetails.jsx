import { useState, useEffect } from "react"
import "./StyleScheduleDetails.scss"
import {
    Card, CardContent, Typography, TextField, Button, Checkbox, FormControlLabel, Box, Chip, IconButton, Accordion, AccordionSummary, AccordionDetails, Grid, InputAdornment, Snackbar, Alert, LinearProgress, Fade, Grow, Paper,
} from "@mui/material"
import {
    ArrowBack, ExpandMore, Save, CheckCircle, Warning, Height, RemoveRedEye, Hearing, MedicalServices, Favorite, Psychology, Person, Assignment,
} from "@mui/icons-material"
import { useSaveResultOfHealthCheckCampaign } from "../../../../../hooks/schoolnurse/healthcheck/schedule/useSaveResultOfHealthCheckCampaign"
import { useNavigate } from "react-router-dom"
import { showSuccessToast, showErrorToast } from '../../../../../utils/toast-utils';

const HEALTH_CHECK_DISEASES = [
    { field: "height", name: "Height", quantity: "cm", type: "number", category: "physical" },
    { field: "weight", name: "Weight", quantity: "kg", type: "number", category: "physical" },
    { field: "rightEyeVision", name: "Right Eye Vision", quantity: ".../10", type: "string", category: "vision" },
    { field: "leftEyeVision", name: "Left Eye Vision", quantity: ".../10", type: "string", category: "vision" },
    { field: "bloodPressure", name: "Blood Pressure", type: "string", category: "cardiovascular" },
    { field: "heartRate", name: "Heart Rate", quantity: "bpm", type: "number", category: "physical" },
    { field: "hearAnuscultaion", name: "Lung Auscultation", type: "string", category: "cardiovascular" },
    { field: "lungs", name: "Lungs", type: "string", category: "cardiovascular" },
    { field: "dentalCheck", name: "Dental Check", type: "string", category: "dental" },
    { field: "earCondition", name: "Ear Condition", type: "string", category: "hearing" },
    { field: "noseCondition", name: "Nose Condition", type: "string", category: "hearing" },
    { field: "throatCondition", name: "Throat Condition", type: "string", category: "hearing" },
    { field: "skinAndMucosa", name: "Skin and Mucosa", type: "string", category: "skin" },
    // { field: "digestiveSystem", name: "Digestive System", type: "string", category: "medical" },
    // { field: "urinarySystem", name: "Urinary System", type: "string", category: "medical" },
    // { field: "musculoskeletalSystem", name: "Musculoskeletal System", type: "string", category: "medical" },
    // { field: "neurologyAndPsychiatry", name: "Neurology and Psychiatry", type: "string", category: "medical" },
    // Genital health check category will be rendered dynamically from pupilData.disease
];

const ScheduleDetails = ({ pupilId, pupilData, onBack, onResultSaved, consentFormId }) => {
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
    console.log("[ScheduleDetails] Initial pupilData:", pupilData);
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
        genital: { title: "Genital Examination", icon: <Psychology />, diseases: [] },
    }
    sensitive_disease.forEach((disease) => {
        const category = disease.category
        if (diseaseCategories[category]) {
            diseaseCategories[category].diseases.push(disease)
        }
    })
    const handleHealthCheck = (diseaseId, checked) => {
        setHealthData((prev) => ({ ...prev, [diseaseId]: checked }))
    }
    const handleNoteChange = (diseaseKey, value) => {
        setNotes((prev) => ({ ...prev, [diseaseKey]: value }))
    }
    const handleMeasurementChange = (diseaseKey, value) => {
        setMeasurements((prev) => ({ ...prev, [diseaseKey]: value }))
    }
    const handleSectionToggle = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
    }
    const getDetailsForDB = () => ({
        height: measurements['height'] || '',
        weight: measurements['weight'] || '',
        rightEyeVision: notes['rightEyeVision'] || '',
        leftEyeVision: notes['leftEyeVision'] || '',
        bloodPressure: notes['bloodPressure'] || '',
        heartRate: measurements['heartRate'] || '',
        dentalCheck: notes['dentalCheck'] || '',
        earCondition: notes['earCondition'] || '',
        noseCondition: notes['noseCondition'] || '',
        throatCondition: notes['throatCondition'] || '',
        skinAndMucosa: notes['skinAndMucosa'] || '',
        hearAnuscultaion: notes['hearAnuscultaion'] || '',
        lungs: notes['lungs'] || '',
        // digestiveSystem: notes['digestiveSystem'] || '',
        // urinarySystem: notes['urinarySystem'] || '',
        // musculoskeletalSystem: notes['musculoskeletalSystem'] || '',
        // neurologyAndPsychiatry: notes['neurologyAndPsychiatry'] || '',
        additionalNotes: notes['conclusion'] || '',
        diseases:
            (Array.isArray(diseaseCategories.genital.diseases) && diseaseCategories.genital.diseases.length === 1 && Object.keys(diseaseCategories.genital.diseases[0]).length === 0)
                ? []
                : (diseaseCategories.genital.diseases || []).map(d => ({
                    diseaseId: d.diseaseId,
                    note: notes[d.field] || ''
                })),
    });
    useEffect(() => {
        if (pupilData && Array.isArray(pupilData.diseases)) {
            const genitalNotes = {};
            pupilData.diseases.forEach((d, idx) => {
                const field = `disease_${d.diseaseId || idx + 1000}`;
                genitalNotes[field] = d.note || "";
            });
            setNotes(prev => ({ ...genitalNotes, ...prev }));
        }
    }, [pupilData]);
    // Add error state for each field
    const [fieldErrors, setFieldErrors] = useState({});

    const validateFields = () => {
        const errors = {};
        let valid = true;
        for (const categoryKey of Object.keys(diseaseCategories)) {
            for (const disease of diseaseCategories[categoryKey].diseases) {
                if (categoryKey === "physical") {
                    const value = measurements[disease.field];
                    if (value === undefined || value === "") {
                        errors[disease.field] = `${disease.name} is required.`;
                        valid = false;
                    } else {
                        const num = Number(value);
                        if (isNaN(num) || num <= 0) {
                            errors[disease.field] = `${disease.name} must be greater than 0.`;
                            valid = false;
                        }
                    }
                } else if (categoryKey === "vision") {
                    const value = notes[disease.field];
                    if (value === undefined || value === "") {
                        errors[disease.field] = `${disease.name} is required.`;
                        valid = false;
                    } else {
                        const num = Number(value);
                        if (isNaN(num) || num < 0 || num > 10) {
                            errors[disease.field] = `${disease.name} must be a number between 0 and 10.`;
                            valid = false;
                        }
                    }
                } else {
                    if (notes[disease.field] === undefined || notes[disease.field] === "") {
                        errors[disease.field] = `${disease.name} is required.`;
                        valid = false;
                    }
                }
            }
        }
        if (notes['conclusion'] === undefined || notes['conclusion'] === "") {
            errors['conclusion'] = "Conclusion is required.";
            valid = false;
        }
        setFieldErrors(errors);
        return valid;
    };
    const handleSave = async (newStatus) => {
        if (!validateFields()) {
            showErrorToast("Please fill in all required fields before saving.");
            setSnackbar({ open: true, message: "Please fill in all required fields before saving.", severity: "error" });
            return;

        }
        setStatus(newStatus);
        const details = getDetailsForDB();
        // Use consentFormId prop if provided, otherwise fallback to pupilData?.consentFormId
        const consentId = consentFormId || (pupilData && pupilData.consentFormId);
        // Debug log for consentId
        if (!consentId) {
            showErrorToast("Consent ID not found in pupilData or props. Please check your data source.");
            setSnackbar({ open: true, message: "Consent ID not found in pupilData or props. Please check your data source.", severity: "error" });
            return;
        }
        const payload = { ...details, status: newStatus };
        let success = false;
        let errorMsg = null;
        try {
            success = await saveResultOfHealthCheckCampaign(consentId, payload);
        } catch (err) {
            errorMsg = err?.message || err?.toString() || null;
        }
        if (success) {
            showSuccessToast(`Saved as ${newStatus}`);
            setSnackbar({ open: true, message: `Saved as ${newStatus}`, severity: "success" });
            setTimeout(() => {
                if (typeof onResultSaved === 'function') onResultSaved();
            }, 1200);
        } else {
            showErrorToast(errorMsg || "Failed to save result.");
            setSnackbar({ open: true, message: errorMsg || "Failed to save result.", severity: "error" });
        }
    };
    const handleSubmit = () => {
        setSnackbar({
            open: true,
            message: 'Health check completed for student ' + (pupilData && pupilData.firstName ? pupilData.firstName : '') + ' ' + (pupilData && pupilData.lastName ? pupilData.lastName : '') + '!',
            severity: "success",
        })
        console.log("Health check details (for DB):", {
            pupil_id: pupilId,
            pupilData,
            details: getDetailsForDB(),
        })
    }
    if (pupilData && Array.isArray(pupilData.diseases) && pupilData.diseases.length > 0) {
        // Only add genital diseases if they are valid (not [{}])
        if (!(pupilData.diseases.length === 1 && Object.keys(pupilData.diseases[0]).length === 0)) {
            diseaseCategories.genital.diseases = pupilData.diseases.map((d, idx) => ({
                disease_id: d.diseaseId || idx + 1000,
                field: 'disease_' + (d.diseaseId ? d.diseaseId : (idx + 1000)),
                name: d.name,
                type: "string",
                diseaseId: d.diseaseId,
                description: d.description,
                category: "genital"
            }));
        } else {
            diseaseCategories.genital.diseases = [];
        }
    }
    if (!sensitive_disease.length) {
        return (
            <div className=" empty-container">
                <Warning sx={{ fontSize: 60, color: "#ff9800" }} />
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
        <div className=" enhanced-ui">
            {/* Quick Navigation Bar */}
            <Fade in={true} timeout={500}>
                <Card className="details-header modern-card" elevation={2}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box>
                                    <Typography variant="h4" className="header-title" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                                        Health Check Campaign
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={2} mt={1}>
                                        <Chip
                                            icon={<Person />}
                                            label={(pupilData && pupilData.firstName ? pupilData.firstName : '') + ' ' + (pupilData && pupilData.lastName ? pupilData.lastName : '')}
                                            color="primary"
                                            variant="filled"
                                            sx={{ fontWeight: 500, fontSize: 16, px: 1.5, py: 0.5, borderRadius: 2 }}
                                        />
                                        <Chip icon={<Assignment />} label={"ID: " + (pupilData?.pupilId || pupilId || 'N/A')} color="secondary" variant="filled" sx={{ fontWeight: 500, px: 1.2, borderRadius: 2 }} />
                                        <Chip label={(pupilData && pupilData.gradeName) ? pupilData.gradeName : "Grade"} color="info" variant="filled" sx={{ fontWeight: 500, px: 1.2, borderRadius: 2 }} />
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
                            value={100}
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
                {/* Genital Examination Section */}
                {Object.entries(diseaseCategories).map(([categoryKey, category], index) => {
                    const diseases = category.diseases;
                    if (
                        categoryKey === "medical" ||
                        !Array.isArray(diseases) ||
                        diseases.length === 0 ||
                        (diseases.length === 1 && Object.keys(diseases[0]).length === 0)
                    ) {
                        return null;
                    }

                    return (
                        <Grow in={true} timeout={300 + index * 100} key={categoryKey}>
                            <Accordion
                                expanded={expandedSections[categoryKey]}
                                onChange={() => handleSectionToggle(categoryKey)}
                                className="health-section modern-accordion"
                                sx={{
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
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails className="section-content modern-accordion-details" sx={{ px: 3, py: 2, background: '#fafdff', borderRadius: 2 }}>
                                    <Grid container spacing={2}>
                                        {category.diseases.map((disease) => (
                                            <Grid item xs={12} key={disease.disease_id || disease.field}>
                                                <Paper className="disease-item modern-disease-item" elevation={0} sx={{
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    background: '#fff',
                                                    boxShadow: 1,
                                                    transition: 'box-shadow 0.2s',
                                                    '&:hover': { boxShadow: 3, background: '#f5fafd' },
                                                }}>
                                                    <Box display="flex" alignItems="flex-start" gap={1.5}>
                                                        <Box flex={1}>
                                                            <Typography variant="subtitle2" className="disease-name" sx={{ fontWeight: 600, fontSize: 15, mb: 0.25 }}>
                                                                {disease.name}
                                                            </Typography>
                                                            <Box display="flex" gap={1.5} mt={0.5}>
                                                                {categoryKey === 'physical' ? (
                                                                    <TextField
                                                                        size="small"
                                                                        label={disease.quantity}
                                                                        value={measurements[disease.field] || ""}
                                                                        onChange={(e) => handleMeasurementChange(disease.field, e.target.value)}
                                                                        error={!!fieldErrors[disease.field]}
                                                                        helperText={fieldErrors[disease.field] || ""}
                                                                        sx={{ minWidth: 90, maxWidth: 120, background: '#f5fafd', borderRadius: 1, boxShadow: 0, fontWeight: 500, fontSize: 13 }}
                                                                    />
                                                                ) : categoryKey === 'vision' ? (
                                                                    <TextField
                                                                        size="small"
                                                                        label={disease.quantity}
                                                                        value={notes[disease.field || disease.disease_id] || ""}
                                                                        onChange={(e) => handleNoteChange(disease.field || disease.disease_id, e.target.value)}
                                                                        error={!!fieldErrors[disease.field]}
                                                                        helperText={fieldErrors[disease.field] || ""}
                                                                        sx={{ minWidth: 90, maxWidth: 120, background: '#f5fafd', borderRadius: 1, boxShadow: 0, fontWeight: 500, fontSize: 13 }}
                                                                    />
                                                                ) : (
                                                                    <TextField
                                                                        size="small"
                                                                        label="Notes & Observations"
                                                                        multiline
                                                                        rows={1}
                                                                        value={notes[disease.field || disease.disease_id] || ""}
                                                                        onChange={(e) => handleNoteChange(disease.field || disease.disease_id, e.target.value)}
                                                                        error={!!fieldErrors[disease.field]}
                                                                        helperText={fieldErrors[disease.field] || ""}
                                                                        placeholder="Add notes..."
                                                                        sx={{ flex: 1, background: '#fafdff', borderRadius: 1, fontWeight: 500, fontSize: 13 }}
                                                                    />
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
                    );
                })}
                {/* Conclusion Field */}
                <Box mt={4}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        Conclusion
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={6}
                        label="Conclusion"
                        value={notes['conclusion'] || ''}
                        onChange={e => setNotes(prev => ({ ...prev, conclusion: e.target.value }))}
                        error={!!fieldErrors['conclusion']}
                        helperText={fieldErrors['conclusion'] || ""}
                        placeholder="Enter overall conclusion or summary..."
                        sx={{ background: '#fafdff', borderRadius: 2 }}
                    />
                </Box>
            </div>
            {/* Action Footer only if not hasResult */}
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
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            color="success"
                            startIcon={<Save />}
                            onClick={() => handleSave("COMPLETED")}
                            className="footer-button save-button"
                            disabled={isSaving}
                            sx={{ fontWeight: 700, borderRadius: 2, px: 4, py: 1.2, fontSize: 18 }}
                        >
                            Complete
                        </Button>
                    </Box>
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

