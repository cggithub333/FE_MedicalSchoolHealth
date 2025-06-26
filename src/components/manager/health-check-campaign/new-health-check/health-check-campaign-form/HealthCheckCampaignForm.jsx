// for creating a health check campaign form done
import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
    Paper,
    Divider,
} from "@mui/material";
import { useCreateNewCampaign } from "../../../../hooks/manager/healthcheck/campaign/useCreateNewCampaign";
import "./HealthCheckCampaignForm.scss";

const HealthCheckCampaignForm = () => {
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
    const [selectDisease, setSelectDisease] = useState("");

    // Populate availableOptions and diseaseDetails from diseases data


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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