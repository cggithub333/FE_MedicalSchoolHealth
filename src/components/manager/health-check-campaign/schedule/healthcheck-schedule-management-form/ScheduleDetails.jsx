import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Snackbar,
    Alert,
    Fade,
    Grow,
    Paper,
} from "@mui/material"
import {
    ArrowBack,
    ExpandMore,
    Save,
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

const HEALTH_CHECK_DISEASES = [
    { field: "height", name: "Height", type: "number", category: "physical" },
    { field: "weight", name: "Weight", type: "number", category: "physical" },
    { field: "rightEyeVision", name: "Right Eye Vision", type: "string", category: "vision" },
    { field: "leftEyeVision", name: "Left Eye Vision", type: "string", category: "vision" },
    { field: "bloodPressure", name: "Blood Pressure", type: "string", category: "cardiovascular" },
    { field: "heartRate", name: "Heart Rate", type: "number", category: "cardiovascular" },
    { field: "hearAnuscultaion", name: "Lung Auscultation", type: "string", category: "cardiovascular" },
    { field: "lungs", name: "Lungs", type: "string", category: "cardiovascular" },
    { field: "dentalCheck", name: "Dental Check", type: "string", category: "dental" },
    { field: "earCondition", name: "Ear Condition", type: "string", category: "hearing" },
    { field: "noseCondition", name: "Nose Condition", type: "string", category: "hearing" },
    { field: "throatCondition", name: "Throat Condition", type: "string", category: "hearing" },
    { field: "skinAndMucosa", name: "Skin and Mucosa", type: "string", category: "skin" },
    { field: "digestiveSystem", name: "Digestive System", type: "string", category: "medical" },
    { field: "urinarySystem", name: "Urinary System", type: "string", category: "medical" },
    { field: "musculoskeletalSystem", name: "Musculoskeletal System", type: "string", category: "medical" },
    { field: "neurologyAndPsychiatry", name: "Neurology and Psychiatry", type: "string", category: "medical" },
]

const ScheduleDetails = ({ pupilId, pupilData, onBack, onResultSaved }) => {
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

    const [status, setStatus] = useState(null)

    // Initialize disease categories
    const diseaseCategories = {
        physical: { title: "Physical Measurements", icon: <Height />, diseases: [] },
        vision: { title: "Vision & Eye Health", icon: <RemoveRedEye />, diseases: [] },
        hearing: { title: "Hearing & ENT", icon: <Hearing />, diseases: [] },
        dental: { title: "Dental Health", icon: <MedicalServices />, diseases: [] },
        skin: { title: "Skin Conditions", icon: <Person />, diseases: [] },
        cardiovascular: { title: "Cardiovascular", icon: <Favorite />, diseases: [] },
        medical: { title: "General Examination", icon: <Assignment />, diseases: [] },
        genital: { title: "Genital Examination", icon: <Psychology />, diseases: [] },
    }

    // Group diseases by category
    HEALTH_CHECK_DISEASES.forEach((disease) => {
        const category = disease.category
        if (diseaseCategories[category]) {
            diseaseCategories[category].diseases.push(disease)
        }
    })

    // Add genital diseases from pupilData
    if (pupilData && Array.isArray(pupilData.disease) && pupilData.disease.length > 0) {
        diseaseCategories.genital.diseases = pupilData.disease.map((d, idx) => ({
            disease_id: d.diseaseId || idx + 1000,
            field: `disease_${d.diseaseId || idx + 1000}`,
            name: d.name,
            type: "string",
            diseaseId: d.diseaseId,
            description: d.description,
            category: "genital",
        }))
    }

    // Check if this has existing results
    const hasResult = pupilData?.active && !!pupilData?.healthCheckHistoryRes

    // Initialize form data with existing values
    useEffect(() => {
        if (pupilData) {
            console.log("Initializing form data with pupilData:", pupilData)

            // Initialize measurements for physical category
            const initialMeasurements = {}
            const initialNotes = {}

            if (hasResult && pupilData.healthCheckHistoryRes) {
                // Populate from existing health check results
                const results = pupilData.healthCheckHistoryRes

                // Physical measurements
                initialMeasurements.height = results.height || ""
                initialMeasurements.weight = results.weight || ""
                initialMeasurements.rightEyeVision = results.rightEyeVision || ""
                initialMeasurements.leftEyeVision = results.leftEyeVision || ""
                initialMeasurements.heartRate = results.heartRate || ""

                // Notes for other categories
                initialNotes.bloodPressure = results.bloodPressure || ""
                initialNotes.hearAnuscultaion = results.hearAnuscultaion || ""
                initialNotes.lungs = results.lungs || ""
                initialNotes.dentalCheck = results.dentalCheck || ""
                initialNotes.earCondition = results.earCondition || ""
                initialNotes.noseCondition = results.noseCondition || ""
                initialNotes.throatCondition = results.throatCondition || ""
                initialNotes.skinAndMucosa = results.skinAndMucosa || ""
                initialNotes.digestiveSystem = results.digestiveSystem || ""
                initialNotes.urinarySystem = results.urinarySystem || ""
                initialNotes.musculoskeletalSystem = results.musculoskeletalSystem || ""
                initialNotes.neurologyAndPsychiatry = results.neurologyAndPsychiatry || ""
                initialNotes.conclusion = results.additionalNotes || ""

                // Handle genital diseases
                if (Array.isArray(results.diseases)) {
                    results.diseases.forEach((disease) => {
                        const fieldKey = `disease_${disease.diseaseId}`
                        initialNotes[fieldKey] = disease.note || ""
                    })
                }
            } else {
                // Initialize with empty values for new entries
                HEALTH_CHECK_DISEASES.forEach((disease) => {
                    if (disease.category === "physical") {
                        initialMeasurements[disease.field] = ""
                    } else {
                        initialNotes[disease.field] = ""
                    }
                })

                // Initialize genital diseases
                if (Array.isArray(pupilData.disease)) {
                    pupilData.disease.forEach((d, idx) => {
                        const fieldKey = `disease_${d.diseaseId || idx + 1000}`
                        initialNotes[fieldKey] = d.note || ""
                    })
                }

                initialNotes.conclusion = ""
            }

            setMeasurements(initialMeasurements)
            setNotes(initialNotes)

            console.log("Initialized measurements:", initialMeasurements)
            console.log("Initialized notes:", initialNotes)
        }
    }, [pupilData, hasResult])

    // Handle checkbox changes
    const handleHealthCheck = (diseaseId, checked) => {
        setHealthData((prev) => ({ ...prev, [diseaseId]: checked }))
    }

    // Handle note changes
    const handleNoteChange = (diseaseKey, value) => {
        console.log(`Updating note for ${diseaseKey}:`, value)
        setNotes((prev) => ({ ...prev, [diseaseKey]: value }))
    }

    // Handle measurement changes
    const handleMeasurementChange = (diseaseKey, value) => {
        console.log(`Updating measurement for ${diseaseKey}:`, value)
        setMeasurements((prev) => ({ ...prev, [diseaseKey]: value }))
    }

    // Handle section expansion
    const handleSectionToggle = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
    }

    // Get current field value for display
    const getFieldValue = (disease, categoryKey) => {
        if (hasResult && pupilData.healthCheckHistoryRes) {
            // For read-only display, get from healthCheckHistoryRes
            const results = pupilData.healthCheckHistoryRes

            if (categoryKey === "physical") {
                return results[disease.field] || ""
            } else if (categoryKey === "genital") {
                const genitalDisease = results.diseases?.find((d) => d.diseaseId === disease.diseaseId)
                return genitalDisease?.note || ""
            } else {
                return results[disease.field] || ""
            }
        } else {
            // For editable form, get from state
            if (categoryKey === "physical") {
                return measurements[disease.field] || ""
            } else {
                return notes[disease.field] || ""
            }
        }
    }

    // Map the current form state to the required DB format
    const getDetailsForDB = () => ({
        height: measurements["height"] || "",
        weight: measurements["weight"] || "",
        rightEyeVision: measurements["rightEyeVision"] || "",
        leftEyeVision: measurements["leftEyeVision"] || "",
        bloodPressure: notes["bloodPressure"] || "",
        heartRate: measurements["heartRate"] || "",
        dentalCheck: notes["dentalCheck"] || "",
        earCondition: notes["earCondition"] || "",
        noseCondition: notes["noseCondition"] || "",
        throatCondition: notes["throatCondition"] || "",
        skinAndMucosa: notes["skinAndMucosa"] || "",
        hearAnuscultaion: notes["hearAnuscultaion"] || "",
        lungs: notes["lungs"] || "",
        digestiveSystem: notes["digestiveSystem"] || "",
        urinarySystem: notes["urinarySystem"] || "",
        musculoskeletalSystem: notes["musculoskeletalSystem"] || "",
        neurologyAndPsychiatry: notes["neurologyAndPsychiatry"] || "",
        additionalNotes: notes["conclusion"] || "",
        diseases: (diseaseCategories.genital.diseases || []).map((d) => ({
            diseaseId: d.diseaseId,
            note: notes[d.field] || "",
        })),
    })

    // Validate all required fields are not empty
    const validateFields = () => {
        for (const categoryKey of Object.keys(diseaseCategories)) {
            for (const disease of diseaseCategories[categoryKey].diseases) {
                if (categoryKey === "physical") {
                    if (!measurements[disease.field]) {
                        console.log(`Missing measurement for ${disease.field}`)
                        return false
                    }
                } else {
                    if (!notes[disease.field]) {
                        console.log(`Missing note for ${disease.field}`)
                        return false
                    }
                }
            }
        }

        if (!notes["conclusion"]) {
            console.log("Missing conclusion")
            return false
        }

        return true
    }

    // Save result to DB
    const handleSave = async (newStatus) => {
        if (!validateFields()) {
            setSnackbar({ open: true, message: "Please fill in all required fields before saving.", severity: "error" })
            return
        }

        setStatus(newStatus)
        const details = getDetailsForDB()
        const consentId = pupilData?.consentFormId

        if (!consentId) {
            console.error("Consent ID not found! pupilData:", pupilData)
            setSnackbar({
                open: true,
                message: "Consent ID not found in pupilData. Please check your data source.",
                severity: "error",
            })
            return
        }

        const payload = { ...details, status: newStatus }
        console.log("Saving payload:", payload)

        // Replace with your actual save logic
        // const success = await saveResultOfHealthCheckCampaign(consentId, payload);
        const success = true // Placeholder

        if (success) {
            setSnackbar({ open: true, message: `Saved as ${newStatus}.`, severity: "success" })
            if (typeof onResultSaved === "function") onResultSaved()
        } else {
            setSnackbar({ open: true, message: "Failed to save result.", severity: "error" })
        }
    }

    if (!HEALTH_CHECK_DISEASES.length && (!pupilData?.disease || pupilData.disease.length === 0)) {
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
            {/* Header */}
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
                                            label={`${pupilData?.firstName} ${pupilData?.lastName}`}
                                            color="primary"
                                            variant="filled"
                                            sx={{ fontWeight: 500, fontSize: 16, px: 1.5, py: 0.5, borderRadius: 2 }}
                                        />
                                        <Chip
                                            icon={<Assignment />}
                                            label={`ID: ${pupilId}`}
                                            color="secondary"
                                            variant="filled"
                                            sx={{ fontWeight: 500, px: 1.2, borderRadius: 2 }}
                                        />
                                        <Chip
                                            label={pupilData?.gradeName || "Grade"}
                                            color="info"
                                            variant="filled"
                                            sx={{ fontWeight: 500, px: 1.2, borderRadius: 2 }}
                                        />
                                        {hasResult && (
                                            <Chip
                                                label="Has Results"
                                                color="success"
                                                variant="filled"
                                                sx={{ fontWeight: 500, px: 1.2, borderRadius: 2 }}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
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
                                    background: expandedSections[categoryKey]
                                        ? "linear-gradient(120deg, #f5fafd 60%, #e3f2fd 100%)"
                                        : "#f8fafc",
                                    transition: "all 0.25s cubic-bezier(.4,2,.6,1)",
                                    border: expandedSections[categoryKey] ? "2px solid #90caf9" : "1px solid #e3e3e3",
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    className="section-header modern-accordion-header"
                                    sx={{
                                        minHeight: 64,
                                        background: expandedSections[categoryKey] ? "#e3f2fd" : "#f5fafd",
                                        borderRadius: 3,
                                        boxShadow: expandedSections[categoryKey] ? 2 : 0,
                                        px: 3,
                                        py: 1.5,
                                        "& .MuiAccordionSummary-content": { alignItems: "center", gap: 2 },
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Box sx={{ fontSize: 30, color: "#1976d2", mr: 1 }}>{category.icon}</Box>
                                        <Typography variant="h6" className="section-title" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                                            {category.title}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>

                                <AccordionDetails
                                    className="section-content modern-accordion-details"
                                    sx={{ px: 3, py: 2, background: "#fafdff", borderRadius: 2 }}
                                >
                                    <Grid container spacing={2}>
                                        {category.diseases.map((disease) => (
                                            <Grid item xs={12} key={disease.disease_id || disease.field}>
                                                <Paper
                                                    className="disease-item modern-disease-item"
                                                    elevation={0}
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        background: "#fff",
                                                        boxShadow: 1,
                                                        mb: 1,
                                                        transition: "box-shadow 0.2s",
                                                        "&:hover": { boxShadow: 3, background: "#f5fafd" },
                                                    }}
                                                >
                                                    <Box display="flex" alignItems="flex-start" gap={1.5}>
                                                        <Box flex={1}>
                                                            <Typography
                                                                variant="subtitle2"
                                                                className="disease-name"
                                                                sx={{ fontWeight: 600, fontSize: 15, mb: 0.25 }}
                                                            >
                                                                {disease.name}
                                                            </Typography>
                                                            <Box display="flex" gap={1.5} mt={0.5}>
                                                                {categoryKey === "physical" ? (
                                                                    <TextField
                                                                        size="small"
                                                                        label={disease.name}
                                                                        value={getFieldValue(disease, categoryKey)}
                                                                        onChange={(e) =>
                                                                            !hasResult && handleMeasurementChange(disease.field, e.target.value)
                                                                        }
                                                                        InputProps={{ readOnly: hasResult }}
                                                                        sx={{
                                                                            minWidth: 90,
                                                                            maxWidth: 120,
                                                                            background: hasResult ? "#f5fafd" : "#fff",
                                                                            borderRadius: 1,
                                                                            boxShadow: 0,
                                                                            fontWeight: 500,
                                                                            fontSize: 13,
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <TextField
                                                                        size="small"
                                                                        label="Notes & Observations"
                                                                        multiline
                                                                        rows={1}
                                                                        value={getFieldValue(disease, categoryKey)}
                                                                        onChange={(e) => !hasResult && handleNoteChange(disease.field, e.target.value)}
                                                                        placeholder="Add notes..."
                                                                        InputProps={{ readOnly: hasResult }}
                                                                        sx={{
                                                                            flex: 1,
                                                                            background: hasResult ? "#fafdff" : "#fff",
                                                                            borderRadius: 1,
                                                                            fontWeight: 500,
                                                                            fontSize: 13,
                                                                        }}
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
                    )
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
                        value={notes["conclusion"] || ""}
                        onChange={(e) => !hasResult && setNotes((prev) => ({ ...prev, conclusion: e.target.value }))}
                        placeholder="Enter overall conclusion or summary..."
                        InputProps={{ readOnly: hasResult }}
                        sx={{ background: hasResult ? "#fafdff" : "#fff", borderRadius: 2 }}
                    />
                </Box>
            </div>

            {/* Action Footer only if not hasResult */}
            {!hasResult && (
                <Fade in={true} timeout={800}>
                    <Box
                        className="action-footer modern-footer"
                        sx={{
                            position: "sticky",
                            bottom: 0,
                            zIndex: 10,
                            background: "linear-gradient(90deg, #fafdff 80%, #e3f2fd 100%)",
                            boxShadow: 3,
                            borderRadius: 3,
                            py: 2.5,
                            px: 4,
                            mt: 4,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 3,
                            transition: "box-shadow 0.2s",
                        }}
                    >
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<ArrowBack />}
                            onClick={onBack}
                            className="footer-button"
                            sx={{ fontWeight: 600, borderRadius: 2, px: 3, py: 1 }}
                        >
                            Back to Students
                        </Button>

                        {/* <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                variant="contained"
                                size="large"
                                color="success"
                                startIcon={<Save />}
                                onClick={() => handleSave("COMPLETED")}
                                className="footer-button save-button"
                                sx={{ fontWeight: 700, borderRadius: 2, px: 4, py: 1.2, fontSize: 18 }}
                            >
                                Complete
                            </Button>
                        </Box> */}
                    </Box>
                </Fade>
            )}

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
