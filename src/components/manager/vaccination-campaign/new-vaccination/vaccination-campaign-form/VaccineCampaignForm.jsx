import { useState, useEffect } from "react"
import { Box, TextField, Alert, AlertTitle } from "@mui/material"
import { useGetVaccineByDisease } from "../../../../../hooks/manager/vaccination/create-new-campaign/useGetVaccineByDisease"
import { useCreateNewCampaign } from "../../../../../hooks/manager/vaccination/create-new-campaign/useCreateNewCampaign"
import { showSuccessToast, showErrorToast } from "../../../../../utils/toast-utils";
import "./StyleVaccineCampaignForm.css"

// Helper to format date as dd-MM-YYYY
function formatDate(dateStr) {
    if (!dateStr) return "";
    // If already in dd-MM-YYYY, return as is
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    // If only day is provided, return empty string (invalid)
    if (/^\d{1,2}$/.test(dateStr)) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

const VaccineCampaignForm = ({ onSuccess, onCancel }) => {
    const { vaccines: diseases, isLoading: isVaccineLoading } = useGetVaccineByDisease()
    const { createNewCampaign, isLoading: isCreating, error } = useCreateNewCampaign()

    const [form, setForm] = useState({
        titleCampaign: "",
        diseaseId: "",
        vaccineId: "",
        startDate: "",
        endDate: "",
        formDeadline: "",
        notes: "",
    })

    const [vaccines, setVaccines] = useState([])
    const [maxQuantity, setMaxQuantity] = useState("")
    const [validationErrors, setValidationErrors] = useState({})

    // When user selects a disease, update vaccines & dose quantity
    useEffect(() => {
        if (form.diseaseId) {
            const disease = diseases.find((d) => String(d.diseaseId) === String(form.diseaseId))
            setVaccines(disease ? disease.vaccines : [])
            setForm((f) => ({ ...f, vaccineId: "" }))
            setMaxQuantity(disease ? disease.doseQuantity : "")
        } else {
            setVaccines([])
            setForm((f) => ({ ...f, vaccineId: "" }))
            setMaxQuantity("")
        }
    }, [form.diseaseId, diseases])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm({ ...form, [name]: type === "checkbox" ? checked : value })

        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = () => {
        const errors = {}

        if (!form.titleCampaign.trim()) {
            errors.titleCampaign = "Campaign title is required"
        }

        if (!form.diseaseId) {
            errors.diseaseId = "Disease selection is required"
        }

        if (!form.vaccineId) {
            errors.vaccineId = "Vaccine selection is required"
        }

        if (!form.startDate) {
            errors.startDate = "Start date is required"
        }

        if (!form.endDate) {
            errors.endDate = "End date is required"
        }

        if (!form.formDeadline) {
            errors.formDeadline = "Form deadline is required"
        }

        // Check if end date is after start date
        if (form.startDate && form.endDate) {
            const startDate = new Date(form.startDate)
            const endDate = new Date(form.endDate)

            if (endDate <= startDate) {
                errors.endDate = "End date must be after start date"
            }
            // Check if end date is at least 5 days after start date
            else if ((endDate - startDate) / (1000 * 60 * 60 * 24) < 5) {
                errors.endDate = "End date must be at least 5 days after start date"
            }
        }

        // Check if deadline is before start date and not in the past
        if (form.formDeadline && form.startDate) {
            const deadlineDate = new Date(form.formDeadline)
            const startDate = new Date(form.startDate)
            const now = new Date()
            if (deadlineDate >= startDate) {
                errors.startDate = "Form start date must be after deadline date"
            }
            if (deadlineDate < now) {
                errors.formDeadline = "Form deadline must not be in the past"
            }
        }

        setValidationErrors(errors)
        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const errors = validateForm()
        if (Object.keys(errors).length > 0) {
            showErrorToast("Please fix the errors in the form before submitting.")
            return
        }

        try {
            // Format data according to API structure
            const campaignData = {
                titleCampaign: form.titleCampaign.trim(),
                diseaseId: Number.parseInt(form.diseaseId),
                vaccineId: Number.parseInt(form.vaccineId),
                startDate: formatDate(form.startDate),
                endDate: formatDate(form.endDate),
                formDeadline: formatDate(form.formDeadline),
                notes: (form.notes && form.notes.trim()) || "", // always send string
            }

            try {
                const response = await createNewCampaign(campaignData)
                showSuccessToast("Vaccination campaign created successfully!")
                console.log("Vaccination campaign created successfully:", response)
            } catch (err) {
                // Log the error and any error response from backend
                if (err?.response) {
                    console.error("Backend error response:", err.response.data)
                    if (err.response.data && err.response.data.message) {
                        console.error("Backend error: " + err.response.data.message)
                    }
                }
                console.error("Error creating vaccination campaign (full):", err)
                return;
            }

            // Reset form
            setForm({
                titleCampaign: "",
                diseaseId: "",
                vaccineId: "",
                startDate: "",
                endDate: "",
                formDeadline: "",
                notes: "",
            })

            onSuccess && onSuccess()
        } catch (error) {
            showErrorToast("Failed to create campaign. Please try again.")
            console.error("Error creating vaccination campaign:", error)
        }
    }

    return (
        <div className="vaccine-campaign-root">
            <form className="vaccine-campaign-form" onSubmit={handleSubmit}>
                <h2 className="vaccine-campaign-title">Vaccination Campaign Form</h2>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        <AlertTitle>Error</AlertTitle>
                        {error.message || "Failed to create campaign"}
                    </Alert>
                )}

                <div className="vaccine-section">
                    <div className="vaccine-section-title">Campaign Information</div>
                    <TextField
                        id="titleCampaign"
                        label="Campaign Title"
                        variant="outlined"
                        name="titleCampaign"
                        value={form.titleCampaign}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!validationErrors.titleCampaign}
                        helperText={validationErrors.titleCampaign}
                        disabled={isCreating}
                    />
                </div>

                <div className="vaccine-section">
                    <div className="vaccine-section-title">Vaccine Details</div>
                    <div className="vaccine-row">
                        <select
                            className={`vaccine-input ${validationErrors.diseaseId ? "error" : ""}`}
                            name="diseaseId"
                            value={form.diseaseId}
                            onChange={handleChange}
                            required
                            disabled={isVaccineLoading || isCreating}
                        >
                            <option value="">Select Disease</option>
                            {isVaccineLoading ? (
                                <option disabled>Loading...</option>
                            ) : diseases.length === 0 ? (
                                <option disabled>No diseases found</option>
                            ) : (
                                diseases.map((d) => (
                                    <option key={d.diseaseId} value={d.diseaseId}>
                                        {d.diseaseName}
                                    </option>
                                ))
                            )}
                        </select>

                        <select
                            className={`vaccine-input ${validationErrors.vaccineId ? "error" : ""}`}
                            name="vaccineId"
                            value={form.vaccineId}
                            onChange={handleChange}
                            required
                            disabled={!form.diseaseId || isCreating}
                        >
                            <option value="">Select Vaccine</option>
                            {vaccines.map((v) => (
                                <option key={v.vaccineId} value={v.vaccineId}>
                                    {v.name}
                                </option>
                            ))}
                        </select>

                        {maxQuantity && <span className="vaccine-max-info">Max Doses: {maxQuantity}</span>}
                    </div>
                    {validationErrors.diseaseId && (
                        <div style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}>{validationErrors.diseaseId}</div>
                    )}
                    {validationErrors.vaccineId && (
                        <div style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}>{validationErrors.vaccineId}</div>
                    )}
                </div>

                <div className="vaccine-section">
                    <div className="vaccine-section-title">Schedule</div>
                    <div className="vaccine-row">
                        <Box display="flex" gap={2} width="100%" marginTop={2}>
                            <TextField
                                className="vaccine-input"
                                label="Deadline"
                                type="date"
                                name="formDeadline"
                                value={form.formDeadline}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                                required
                                error={!!validationErrors.formDeadline}
                                helperText={validationErrors.formDeadline}
                                disabled={isCreating}
                            />
                            <TextField
                                className="vaccine-input"
                                label="Start Date"
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                                required
                                error={!!validationErrors.startDate}
                                helperText={validationErrors.startDate}
                                disabled={isCreating}
                            />
                            <TextField
                                className="vaccine-input"
                                label="End Date"
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                                required
                                error={!!validationErrors.endDate}
                                helperText={validationErrors.endDate}
                                disabled={isCreating}
                            />

                        </Box>
                    </div>
                </div>

                <div className="vaccine-section">
                    <div className="vaccine-section-title">Additional Notes</div>
                    <TextField
                        id="notes"
                        label="Notes (optional)"
                        variant="outlined"
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        fullWidth
                        disabled={isCreating}
                    />
                </div>

                <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end", marginTop: "24px" }}>
                    <button
                        className="vaccine-submit-btn"
                        type="button"
                        onClick={onCancel}
                        disabled={isCreating}
                    // style={{
                    //     padding: "0px 24px",
                    //     border: "1px solid #1976d2",
                    //     background: "white",
                    //     color: "#1976d2",
                    //     borderRadius: "8px",
                    //     cursor: "pointer",
                    // }}
                    >
                        Cancel
                    </button>
                    <button className="vaccine-submit-btn" type="submit" disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create Campaign"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default VaccineCampaignForm
