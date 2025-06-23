import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    IconButton,
    Paper,
    Divider,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import "./HealthCheckCampaignForm.scss";
import useAllDisease from "../../../../../hooks/manager/useAllDisease"; // Adjust path if needed

const HealthCheckCampaignForm = () => {
    const { sensitiveDiseases, isLoading } = useAllDisease(); // Assume hook returns { diseases, isLoading }
    const [form, setForm] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        deadline: "",
        location: "",
        selectedConsents: [],
    });
    const [errors, setErrors] = useState({});
    const [diseaseDetails, setDiseaseDetails] = useState({});
    const [openDetailIdx, setOpenDetailIdx] = useState(null);
    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectDisease, setSelectDisease] = useState("");

    // Populate availableOptions and diseaseDetails from diseases data
    useEffect(() => {
        if (sensitiveDiseases && Array.isArray(sensitiveDiseases)) {
            setAvailableOptions(sensitiveDiseases.map(d => d.name));
            const details = {};
            sensitiveDiseases.forEach(d => {
                details[d.name] = d.detail || "";
            });
            setDiseaseDetails(details);
        }
    }, [sensitiveDiseases]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleConsentChange = (option) => {
        setForm((prev) => ({
            ...prev,
            selectedConsents: prev.selectedConsents.includes(option)
                ? prev.selectedConsents.filter((o) => o !== option)
                : [...prev.selectedConsents, option],
        }));
    };

    const handleDeleteConsent = (option) => {
        setForm((prev) => ({
            ...prev,
            selectedConsents: prev.selectedConsents.filter((o) => o !== option),
        }));
    };

    // Add selected disease from dropdown to selectedConsents
    const handleAddConsent = () => {
        if (
            selectDisease &&
            !form.selectedConsents.includes(selectDisease)
        ) {
            setForm((prev) => ({
                ...prev,
                selectedConsents: [...prev.selectedConsents, selectDisease],
            }));
            setSelectDisease("");
        }
    };

    const validate = () => {
        let temp = {};
        temp.title = form.title ? "" : "Required";
        temp.location = form.location ? "" : "Required";
        setErrors(temp);
        return Object.values(temp).every((x) => x === "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Submit logic here
            alert("Health Check Campaign Created!");
        }
    };

    return (
        <Paper className="health-check-campaign-form" elevation={3}>
            <Box className="form-header">
                <Typography variant="h5" className="form-title">
                    HEALTH CHECK CAMPAIGN
                </Typography>
                <Typography variant="body2" className="form-desc">
                    Form description
                </Typography>
            </Box>
            <form onSubmit={handleSubmit} autoComplete="off">
                <Box className="form-section">
                    <TextField
                        label="TITLE"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        error={!!errors.title}
                        helperText={errors.title}
                        fullWidth
                        margin="normal"
                        size="small"
                    />
                    <TextField
                        label="DESCRIPTIONS"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        fullWidth
                        margin="normal"
                        size="small"
                    />
                    <div className="vaccine-section-title">Schedule</div>
                    <div className="vaccine-row">
                        <Box display="flex" gap={2} width="100%" marginTop={2}>
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
                            />
                            <TextField
                                className="vaccine-input"
                                label="Deadline"
                                type="date"
                                name="deadline"
                                value={form.deadline}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Box>
                    </div>
                    <TextField
                        label="Campaign Locations"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        required
                        error={!!errors.location}
                        helperText={errors.location}
                        fullWidth
                        margin="normal"
                        size="small"
                    />
                </Box>
                <Divider sx={{ my: 2 }} />

                <Box mt={3} textAlign="right">
                    <Button type="submit" variant="contained" color="primary">
                        Save
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default HealthCheckCampaignForm;