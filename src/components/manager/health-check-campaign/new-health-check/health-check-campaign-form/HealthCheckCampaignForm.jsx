import { useState, useEffect } from "react"
import { Box, TextField, Button, Typography, Grid, Alert, CircularProgress, Paper, Fade, Checkbox, FormGroup, FormControlLabel, IconButton, MenuItem } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useCreateNewCampaign from "../../../../../hooks/manager/healthcheck/create-new-campaign/useCreateNewCampaign"
import { useGetGenitalHealthCheck } from "../../../../../hooks/manager/healthcheck/create-new-campaign/useGetGenitalHealthCheck"
import { showSuccessToast, showErrorToast } from "../../../../../utils/toast-utils";
import "./HealthCheckCampaignForm.css"

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
        const errors = {};
        // Trim all string fields before validation
        const title = formData.title.trim();
        const description = formData.description.trim();
        const address = formData.address.trim();
        const deadlineDate = formData.deadlineDate;
        const startExaminationDate = formData.startExaminationDate;
        const endExaminationDate = formData.endExaminationDate;

        if (!title) {
            errors.title = "Campaign title is required";
        }
        if (!description) {
            errors.description = "Description is required";
        }
        if (!address) {
            errors.address = "Address is required";
        }
        if (!deadlineDate) {
            errors.deadlineDate = "Deadline date is required";
        }
        if (!startExaminationDate) {
            errors.startExaminationDate = "Start date and time is required";
        }
        if (!endExaminationDate) {
            errors.endExaminationDate = "End date and time is required";
        }
        // Date logic
        if (startExaminationDate && endExaminationDate) {
            const startDate = new Date(startExaminationDate);
            const endDate = new Date(endExaminationDate);
            if (endDate <= startDate) {
                errors.endExaminationDate = "End date must be after start date";
            }
            // Check if end date is at least 5 days after start date
            else if ((endDate - startDate) / (1000 * 60 * 60 * 24) < 5) {
                errors.endExaminationDate = "End date must be at least 5 days after start date"
            }
        }
        if (deadlineDate && startExaminationDate) {
            const deadline = new Date(deadlineDate);
            const startDate = new Date(startExaminationDate);
            if (deadline > startDate) {
                errors.startExaminationDate = "start date must be after or same as examination deadline";
            }
            // NEW: Deadline must not be in the past
            const now = new Date();
            if (deadline < now) {
                errors.deadlineDate = "Deadline must not be in the past";
            }
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

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
            showErrorToast("Please fix the errors in the form before submitting.");
            // Optionally scroll to first error field
            const firstErrorField = Object.keys(validationErrors)[0];
            if (firstErrorField) {
                const el = document.querySelector(`[name='${firstErrorField}']`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return
        }

        try {
            // Get diseaseIds as an array of IDs only from selectedConsents
            const diseaseIds = form.selectedConsents
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
            showSuccessToast("Campaign created successfully!");
            onSuccess && onSuccess()
        } catch (error) {
            showErrorToast("Failed to create campaign. Please try again.");
            console.error("Error creating campaign:", error)
        }
    }

    return (

        <div className="health-campaign-root">
            <Fade in timeout={500} >
                <Paper elevation={4} className="campaign-form-container">
                    <form onSubmit={handleSubmit} autoComplete="off" className="campaign-form">
                        <h2 className="health-campaign-title">Vaccination Campaign Form</h2>
                        {error && (
                            <Box mb={2} className="error-alert">
                                <Paper elevation={0}>
                                    <Typography color="error" align="center" fontSize={15}>
                                        Error: {error}
                                    </Typography>
                                </Paper>
                            </Box>
                        )}
                        <Box mb={3} className="form-section">
                            <Typography variant="subtitle1" className="form-section-title">
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
                            />
                        </Box>
                        <Box mb={3} className="form-section">
                            <Typography variant="subtitle1" className="form-section-title">
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
                            />
                        </Box>
                        <Box mb={3} className="form-section">
                            <Typography variant="subtitle1" className="form-section-title">
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
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box className="form-section consent-section">
                            <Typography variant="subtitle1" className="form-section-title">
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
                        <Grid container spacing={2} justifyContent="flex-end" mt={2} className="form-actions">
                            <Grid item>
                                <Button
                                    type="button"
                                    variant="contained"
                                    onClick={onCancel}
                                    disabled={isCreating}
                                    className="cancel-button"
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isCreating}
                                    className="submit-button"
                                    endIcon={isCreating ? <CircularProgress size={18} color="inherit" /> : null}
                                >
                                    {isCreating ? "Creating..." : "Create Campaign"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Fade>
        </div >

    )
}

export default HealthCheckCampaignForm
