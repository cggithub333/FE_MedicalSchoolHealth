import { useState, useEffect } from "react"
import { Box, TextField, Button, Typography, Grid, Alert, CircularProgress, Paper, Fade, Checkbox, FormGroup, FormControlLabel, IconButton, MenuItem } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useCreateNewCampaign from "../../../../../hooks/manager/healthcheck/create-new-campaign/useCreateNewCampaign"
import { useGetGenitalHealthCheck } from "../../../../../hooks/manager/healthcheck/create-new-campaign/useGetGenitalHealthCheck"
import "./HealthCheckCampaignForm.scss"

const HealthCheckCampaignForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        address: "",
        deadlineDate: "",
        startExaminationDate: "",
        endExaminationDate: "",
        selectedDisease: "",
    })
    const [validationErrors, setValidationErrors] = useState({})

    const { createNewCampaign, isCreating, error } = useCreateNewCampaign()
    const { genitalHealthCheck: genitalDiseasesRaw = {}, loading: loadingDiseases } = useGetGenitalHealthCheck();
    const genitalDiseases = Array.isArray(genitalDiseasesRaw.data) ? genitalDiseasesRaw.data : [];
    const [form, setForm] = useState({
        consentOptions: [],
        selectedConsents: [],
        newConsent: "",
    });
    // Sync consentOptions with fetched genitalDiseases
    useEffect(() => {
        if (genitalDiseases.length > 0) {
            setForm(prev => ({
                ...prev,
                consentOptions: genitalDiseases.map(d => d.name)
            }));
        }
    }, [genitalDiseases]);
    const [openDetailIdx, setOpenDetailIdx] = useState(null);
    const diseaseDetails = genitalDiseases.reduce((acc, d) => { acc[d.name] = d.description; return acc; }, {});
    // Handlers for consent options
    const handleConsentChange = (option) => {
        setForm((prev) => ({
            ...prev,
            selectedConsents: prev.selectedConsents.includes(option)
                ? prev.selectedConsents.filter((o) => o !== option)
                : [...prev.selectedConsents, option],
        }));
    };
    const handleAddConsent = () => {
        if (form.newConsent && !form.consentOptions.includes(form.newConsent)) {
            setForm((prev) => ({
                ...prev,
                consentOptions: [...prev.consentOptions, prev.newConsent],
                newConsent: "",
            }));
        }
    };
    const handleDeleteConsent = (option) => {
        setForm((prev) => ({
            ...prev,
            consentOptions: prev.consentOptions.filter((o) => o !== option),
            selectedConsents: prev.selectedConsents.filter((o) => o !== option),
        }));
    };
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        // Clear validation error when user starts typing
        if (validationErrors[field]) {
            setValidationErrors((prev) => ({
                ...prev,
                [field]: "",
            }))
        }
    }

    const validateForm = () => {
        const errors = {}

        if (!formData.title.trim()) {
            errors.title = "Campaign title is required"
        }

        if (!formData.description.trim()) {
            errors.description = "Description is required"
        }

        if (!formData.address.trim()) {
            errors.address = "Address is required"
        }

        if (!formData.deadlineDate) {
            errors.deadlineDate = "Deadline date is required"
        }

        if (!formData.startExaminationDate) {
            errors.startExaminationDate = "Start date and time is required"
        }

        if (!formData.endExaminationDate) {
            errors.endExaminationDate = "End date and time is required"
        }

        // Check if end date is after start date
        if (formData.startExaminationDate && formData.endExaminationDate) {
            const startDate = new Date(formData.startExaminationDate)
            const endDate = new Date(formData.endExaminationDate)

            if (endDate <= startDate) {
                errors.endExaminationDate = "End date must be after start date"
            }
        }

        // Check if deadline is before or same as start date (allow same day)
        if (formData.deadlineDate && formData.startExaminationDate) {
            const deadlineDate = new Date(formData.deadlineDate)
            const startDate = new Date(formData.startExaminationDate)
            if (deadlineDate > startDate) {
                errors.deadlineDate = "Deadline must be before or same as examination start date"
            }
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Update formatDateForAPI to output UTC ISO string with 'Z' for date-times
    const formatDateForAPI = (dateString, withTime = false) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (withTime) {
            // Use UTC ISO string (YYYY-MM-DDTHH:mm:ss.sssZ)
            return date.toISOString();
        }
        // Only date (YYYY-MM-DD)
        return dateString;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            // Get diseaseIds as an array of IDs only
            const diseaseIds = form.consentOptions
                .map(name => genitalDiseases.find(d => d.name === name)?.diseaseId)
                .filter(id => id !== undefined && id !== null);

            // Format data according to your API structure
            const campaignData = {
                address: formData.address.trim(),
                title: formData.title.trim(),
                description: formData.description.trim(),
                deadlineDate: formData.deadlineDate, // Keep as date string (YYYY-MM-DD)
                startExaminationDate: formatDateForAPI(formData.startExaminationDate, true),
                endExaminationDate: formatDateForAPI(formData.endExaminationDate, true),
                diseaseIds,
            }

            await createNewCampaign(campaignData)

            setFormData({
                title: "",
                description: "",
                address: "",
                deadlineDate: "",
                startExaminationDate: "",
                endExaminationDate: "",
                selectedDisease: "",
            })

            onSuccess && onSuccess()
        } catch (error) {
            console.error("Error creating campaign:", error)
        }
    }

    return (
        <Fade in timeout={500}>
            <Paper elevation={4} sx={{
                maxWidth: 600,
                mx: "auto",
                mt: 4,
                p: { xs: 2, sm: 4 },
                borderRadius: 4,
                background: "rgba(255,255,255,0.98)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                transition: "box-shadow 0.3s"
            }}>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <Typography variant="h5" fontWeight={700} align="center" mb={3} color="primary.main" letterSpacing={1}>
                        Create New Health Check Campaign
                    </Typography>
                    {error && (
                        <Box mb={2}>
                            <Paper elevation={0} sx={{ background: "#ffeaea", p: 1, borderRadius: 2 }}>
                                <Typography color="error" align="center" fontSize={15}>
                                    Error: {error}
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                    <Box mb={3}>
                        <Typography variant="subtitle1" fontWeight={600} mb={1} color="text.secondary">
                            Campaign Information
                        </Typography>
                        <TextField
                            fullWidth
                            label="Campaign Title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            required
                            variant="outlined"
                            error={!!validationErrors.title}
                            helperText={validationErrors.title}
                            disabled={isCreating}
                            sx={{ mb: 1.5, background: "#f7fafd", borderRadius: 2, transition: "background 0.2s" }}
                        />
                        <TextField
                            fullWidth
                            label="Address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            required
                            variant="outlined"
                            error={!!validationErrors.address}
                            helperText={validationErrors.address}
                            disabled={isCreating}
                            sx={{ background: "#f7fafd", borderRadius: 2, transition: "background 0.2s" }}
                        />
                    </Box>
                    <Box mb={3}>
                        <Typography variant="subtitle1" fontWeight={600} mb={1} color="text.secondary">
                            Description
                        </Typography>
                        <TextField
                            fullWidth
                            label="Description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            required
                            multiline
                            rows={3}
                            variant="outlined"
                            error={!!validationErrors.description}
                            helperText={validationErrors.description}
                            disabled={isCreating}
                            sx={{ background: "#f7fafd", borderRadius: 2 }}
                        />
                    </Box>
                    <Box mb={3}>
                        <Typography variant="subtitle1" fontWeight={600} mb={1} color="text.secondary">
                            Schedule
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Deadline"
                                    type="date"
                                    value={formData.deadlineDate}
                                    onChange={(e) => handleInputChange("deadlineDate", e.target.value)}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    error={!!validationErrors.deadlineDate}
                                    helperText={validationErrors.deadlineDate || "Deadline for registration"}
                                    disabled={isCreating}
                                    sx={{ background: "#f7fafd", borderRadius: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Start Date & Time"
                                    type="datetime-local"
                                    value={formData.startExaminationDate}
                                    onChange={(e) => handleInputChange("startExaminationDate", e.target.value)}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    error={!!validationErrors.startExaminationDate}
                                    helperText={validationErrors.startExaminationDate || "When examination starts"}
                                    disabled={isCreating}
                                    sx={{ background: "#f7fafd", borderRadius: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="End Date & Time"
                                    type="datetime-local"
                                    value={formData.endExaminationDate}
                                    onChange={(e) => handleInputChange("endExaminationDate", e.target.value)}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    error={!!validationErrors.endExaminationDate}
                                    helperText={validationErrors.endExaminationDate || "When examination ends"}
                                    disabled={isCreating}
                                    sx={{ background: "#f7fafd", borderRadius: 2 }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className="form-section consent-section" mb={3}>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, mb: 1 }}
                        >
                            Parental Consent for Genital Examination:
                        </Typography>
                        {loadingDiseases ? (
                            <Typography variant="body2">
                                Loading diseases...
                            </Typography>
                        ) : (
                            <FormGroup>
                                {form.consentOptions.map((option, idx) => (
                                    <Box
                                        key={option}
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="flex-start"
                                        className="consent-option-row"
                                        sx={{ mb: 1 }}
                                    >
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            width="100%"
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={form.selectedConsents.includes(option)}
                                                        onChange={() => handleConsentChange(option)}
                                                    />
                                                }
                                                label={option}
                                            />
                                            <Button
                                                size="small"
                                                variant="text"
                                                sx={{ minWidth: 0, ml: 1, textTransform: "none" }}
                                                onClick={() => setOpenDetailIdx(openDetailIdx === idx ? null : idx)}
                                            >
                                                {openDetailIdx === idx ? "Hide" : "Details"}
                                            </Button>
                                            <IconButton
                                                aria-label="delete"
                                                size="small"
                                                onClick={() => handleDeleteConsent(option)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        {openDetailIdx === idx && diseaseDetails[option] && (
                                            <Box
                                                sx={{
                                                    ml: 4,
                                                    mt: 0.5,
                                                    color: "#555",
                                                    fontSize: 14,
                                                    background: "#f5f5f5",
                                                    p: 1,
                                                    borderRadius: 1,
                                                }}
                                            >
                                                {diseaseDetails[option]}
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                                <Box display="flex" alignItems="center" mt={1}>
                                    <TextField
                                        select
                                        label="Add Disease Option"
                                        value={form.newConsent}
                                        onChange={(e) => setForm({ ...form, newConsent: e.target.value })}
                                        size="small"
                                        variant="outlined"
                                        sx={{ mr: 1, flex: 1 }}
                                    >
                                        <MenuItem value="" disabled>Select disease to add</MenuItem>
                                        {genitalDiseases
                                            .filter(d => !form.consentOptions.includes(d.name))
                                            .map(disease => (
                                                <MenuItem key={disease.diseaseId} value={disease.name}>
                                                    {disease.name}
                                                </MenuItem>
                                            ))}
                                    </TextField>
                                    <IconButton color="primary" onClick={handleAddConsent} disabled={!form.newConsent}>
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            </FormGroup>
                        )}
                    </Box>
                    <Grid container spacing={2} justifyContent="flex-end" mt={2}>
                        <Grid item>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={onCancel}
                                disabled={isCreating}
                                sx={{
                                    px: 3,
                                    py: 1.2,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    boxShadow: "none",
                                    transition: "background 0.2s, color 0.2s"
                                }}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isCreating}
                                sx={{
                                    px: 3,
                                    py: 1.2,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    boxShadow: "0 2px 8px 0 rgba(25, 118, 210, 0.08)",
                                    transition: "background 0.2s, color 0.2s"
                                }}
                                endIcon={isCreating ? <CircularProgress size={18} color="inherit" /> : null}
                            >
                                {isCreating ? "Creating..." : "Create Campaign"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Fade>
    )
}

export default HealthCheckCampaignForm
