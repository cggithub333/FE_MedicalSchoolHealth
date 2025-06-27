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

    // Load saved data
    useEffect(() => {
        if (!pupilId) return
        const savedData = localStorage.getItem(`healthcheck_details_${pupilId}`)
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData)
                setHealthData(parsed.healthData || {})
                setNotes(parsed.notes || {})
                setMeasurements(parsed.measurements || {})
            } catch (e) {
                console.error("Error loading saved data:", e)
            }
        }
    }, [pupilId])

    // Auto-save functionality
    const autoSave = () => {
        if (!pupilId) return
        setAutoSaving(true)
        const dataToSave = {
            healthData,
            notes,
            measurements,
            lastUpdated: new Date().toISOString(),
        }
        localStorage.setItem(`healthcheck_details_${pupilId}`, JSON.stringify(dataToSave))
        setTimeout(() => {
            setAutoSaving(false)
            setSnackbar({
                open: true,
                message: "Changes saved automatically",
                severity: "success",
            })
        }, 500)
    }

    // Handle checkbox changes
    const handleHealthCheck = (diseaseId, checked) => {
        setHealthData((prev) => ({ ...prev, [diseaseId]: checked }))
        setTimeout(autoSave, 1000)
    }

    // Handle note changes
    const handleNoteChange = (diseaseId, value) => {
        setNotes((prev) => ({ ...prev, [diseaseId]: value }))
        setTimeout(autoSave, 1000)
    }

    // Handle measurement changes
    const handleMeasurementChange = (diseaseId, value) => {
        setMeasurements((prev) => ({ ...prev, [diseaseId]: value }))
        setTimeout(autoSave, 1000)
    }

    // Handle section expansion
    const handleSectionToggle = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
    }

    // Calculate completion percentage
    const totalChecks = sensitive_disease.length
    const completedChecks = Object.values(healthData).filter(Boolean).length
    const completionPercentage = totalChecks > 0 ? (completedChecks / totalChecks) * 100 : 0

    // Handle form submission
    const handleSubmit = () => {
        const results = sensitive_disease.map((disease) => ({
            disease_id: disease.disease_id,
            name: disease.name,
            checked: !!healthData[disease.disease_id],
            notes: notes[disease.disease_id] || "",
            measurement: measurements[disease.disease_id] || "",
        }))

        setSnackbar({
            open: true,
            message: `Health check completed for student ${pupilData?.firstName} ${pupilData?.lastName}!`,
            severity: "success",
        })

        console.log("Health check results:", {
            pupil_id: pupilId,
            pupilData,
            results,
            completionPercentage: completionPercentage.toFixed(1),
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
        <div className="schedule-details-root">
            <Fade in={true} timeout={500}>
                <Card className="details-header" elevation={0}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <IconButton
                                    onClick={onBack}
                                    className="back-button"
                                    sx={{
                                        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                                        color: "white",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #1565c0, #1976d2)",
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >
                                    <ArrowBack />
                                </IconButton>
                                <Box>
                                    <Typography variant="h4" className="header-title">
                                        Health Check Assessment
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={2} mt={1}>
                                        <Chip
                                            icon={<Person />}
                                            label={`${pupilData?.firstName} ${pupilData?.lastName}`}
                                            color="primary"
                                            variant="outlined"
                                        />
                                        <Chip icon={<Assignment />} label={`ID: ${pupilId}`} color="secondary" variant="outlined" />
                                        <Chip label={pupilData?.gradeName || "Grade"} color="info" variant="outlined" />
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
                                    />
                                )}
                                <Chip
                                    icon={<CheckCircle />}
                                    label={`${completionPercentage.toFixed(1)}% Complete`}
                                    color={completionPercentage === 100 ? "success" : "warning"}
                                    variant="outlined"
                                />
                            </Box>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={completionPercentage}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "#e3f2fd",
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 4,
                                    background: "linear-gradient(90deg, #43a047, #66bb6a)",
                                },
                            }}
                        />
                    </CardContent>
                </Card>
            </Fade>

            <div className="health-check-sections">
                {Object.entries(diseaseCategories).map(([categoryKey, category], index) => {
                    if (category.diseases.length === 0) return null

                    return (
                        <Grow in={true} timeout={300 + index * 100} key={categoryKey}>
                            <Accordion
                                expanded={expandedSections[categoryKey]}
                                onChange={() => handleSectionToggle(categoryKey)}
                                className="health-section"
                            >
                                <AccordionSummary expandIcon={<ExpandMore />} className="section-header">
                                    <Box display="flex" alignItems="center" gap={2}>
                                        {category.icon}
                                        <Typography variant="h6" className="section-title">
                                            {category.title}
                                        </Typography>
                                        <Chip
                                            label={`${category.diseases.filter((d) => healthData[d.disease_id]).length}/${category.diseases.length}`}
                                            size="small"
                                            color={
                                                category.diseases.filter((d) => healthData[d.disease_id]).length === category.diseases.length
                                                    ? "success"
                                                    : "default"
                                            }
                                            variant="outlined"
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails className="section-content">
                                    <Grid container spacing={3}>
                                        {category.diseases.map((disease) => (
                                            <Grid item xs={12} key={disease.disease_id}>
                                                <Paper className="disease-item" elevation={0}>
                                                    <Box display="flex" alignItems="flex-start" gap={2}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={!!healthData[disease.disease_id]}
                                                                    onChange={(e) => handleHealthCheck(disease.disease_id, e.target.checked)}
                                                                    color="success"
                                                                    sx={{ transform: "scale(1.2)" }}
                                                                />
                                                            }
                                                            label=""
                                                            sx={{ margin: 0 }}
                                                        />
                                                        <Box flex={1}>
                                                            <Typography variant="subtitle1" className="disease-name">
                                                                {disease.name}
                                                            </Typography>
                                                            <Box display="flex" gap={2} mt={1}>
                                                                {/* Measurement field for physical measurements */}
                                                                {(disease.name.includes("Chiều cao") ||
                                                                    disease.name.includes("Cân nặng") ||
                                                                    disease.name.includes("BMI") ||
                                                                    disease.name.includes("Nhịp tim") ||
                                                                    disease.name.includes("Nhịp thở")) && (
                                                                        <TextField
                                                                            size="small"
                                                                            label="Measurement"
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
                                                                            sx={{ minWidth: 120 }}
                                                                        />
                                                                    )}
                                                                <TextField
                                                                    size="small"
                                                                    label="Notes & Observations"
                                                                    multiline
                                                                    rows={2}
                                                                    value={notes[disease.disease_id] || ""}
                                                                    onChange={(e) => handleNoteChange(disease.disease_id, e.target.value)}
                                                                    placeholder="Add detailed observations, abnormalities, or recommendations..."
                                                                    sx={{ flex: 1 }}
                                                                />
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
                <Box className="action-footer">
                    <Button variant="outlined" size="large" startIcon={<ArrowBack />} onClick={onBack} className="footer-button">
                        Back to Students
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Save />}
                        onClick={handleSubmit}
                        className="footer-button save-button"
                        disabled={completionPercentage < 100}
                        sx={{
                            background: completionPercentage === 100 ? "linear-gradient(135deg, #43a047, #66bb6a)" : undefined,
                            "&:hover": {
                                background: completionPercentage === 100 ? "linear-gradient(135deg, #388e3c, #43a047)" : undefined,
                            },
                        }}
                    >
                        {completionPercentage === 100 ? "Complete Assessment" : `${completionPercentage.toFixed(1)}% Complete`}
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
