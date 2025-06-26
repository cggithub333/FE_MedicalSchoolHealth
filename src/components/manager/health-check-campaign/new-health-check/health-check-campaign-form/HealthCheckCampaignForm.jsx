import { useState } from "react"
import { Box, TextField, Button, Typography, Grid, Alert, CircularProgress } from "@mui/material"
import useCreateNewCampaign from "../../../../../hooks/manager/healthcheck/create-new-campaign/useCreateNewCampaign"
import "./HealthCheckCampaignForm.scss"

const HealthCheckCampaignForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        address: "",
        deadlineDate: "",
        startExaminationDate: "",
        endExaminationDate: "",
    })
    const [validationErrors, setValidationErrors] = useState({})

    const { createNewCampaign, isCreating, error } = useCreateNewCampaign()

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

        // Check if deadline is before start date
        if (formData.deadlineDate && formData.startExaminationDate) {
            const deadlineDate = new Date(formData.deadlineDate)
            const startDate = new Date(formData.startExaminationDate)

            if (deadlineDate >= startDate) {
                errors.deadlineDate = "Deadline must be before examination start date"
            }
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const formatDateForAPI = (dateString) => {
        // Convert datetime-local format to ISO string
        if (!dateString) return ""
        return new Date(dateString).toISOString()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            // Format data according to your API structure
            const campaignData = {
                address: formData.address.trim(),
                title: formData.title.trim(),
                description: formData.description.trim(),
                deadlineDate: formData.deadlineDate, // Keep as date string (YYYY-MM-DD)
                startExaminationDate: formatDateForAPI(formData.startExaminationDate),
                endExaminationDate: formatDateForAPI(formData.endExaminationDate),
            }

            console.log("Submitting campaign data:", campaignData)

            const response = await createNewCampaign(campaignData)

            console.log("Campaign created successfully:", response)

            // Reset form
            setFormData({
                title: "",
                description: "",
                address: "",
                deadlineDate: "",
                startExaminationDate: "",
                endExaminationDate: "",
            })

            onSuccess && onSuccess()
        } catch (error) {
            console.error("Error creating campaign:", error)
        }
    }

    return (
        <Box className="campaign-form-container">
            <Typography variant="h6" className="form-title">
                Create New Health Check Campaign
            </Typography>

            {error && (
                <Alert severity="error" className="error-alert">
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="campaign-form">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
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
                    </Grid>

                    <Grid item xs={12} md={6}>
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
                    </Grid>

                    <Grid item xs={12}>
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
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Registration Deadline"
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

                    <Grid item xs={12} md={4}>
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

                    <Grid item xs={12} md={4}>
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

                <Box className="form-actions">
                    <Button type="button" variant="outlined" onClick={onCancel} disabled={isCreating} className="cancel-button">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isCreating} className="submit-button">
                        {isCreating ? (
                            <>
                                <CircularProgress size={20} style={{ marginRight: 8 }} />
                                Creating...
                            </>
                        ) : (
                            "Create Campaign"
                        )}
                    </Button>
                </Box>
            </form>
        </Box>
    )
}

export default HealthCheckCampaignForm
