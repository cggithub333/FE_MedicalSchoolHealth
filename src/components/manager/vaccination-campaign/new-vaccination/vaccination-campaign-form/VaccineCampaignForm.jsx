import React, { useState, useEffect } from "react";
import "./StyleVaccineCampaignForm.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import useGetVaccineByDisease from "../../../../../hooks/manager/vaccination/create-new-campaign/useGetVaccineByDisease";

const VaccineCampaignForm = () => {
    const { vaccines: diseases, isLoading: isVaccineLoading } = useGetVaccineByDisease();

    const [form, setForm] = useState({
        campaignName: "",
        description: "",
        diseaseId: "",
        vaccineId: "",
        doseInfo: "",
        supplier: "",
        startDate: "",
        endDate: "",
        sessionTimes: "",
        location: "",
        contactNurse: "",
        specialNotes: "",
    });

    const [vaccines, setVaccines] = useState([]);
    const [maxQuantity, setMaxQuantity] = useState("");


    // When user selects a disease, update vaccines & dose quantity
    useEffect(() => {
        if (form.diseaseId) {
            const disease = diseases.find(d => String(d.diseaseId) === String(form.diseaseId));
            setVaccines(disease ? disease.vaccines : []);
            setForm(f => ({ ...f, vaccineId: "" }));
            setMaxQuantity(disease ? disease.doseQuantity : "");
        } else {
            setVaccines([]);
            setForm(f => ({ ...f, vaccineId: "" }));
            setMaxQuantity("");
        }
    }, [form.diseaseId, diseases]);

    // When user selects a vaccine, update dose info
    useEffect(() => {
        if (form.vaccineId && vaccines.length > 0) {
            const selected = vaccines.find(v => String(v.vaccineId) === String(form.vaccineId));
            if (selected) {
                setForm(f => ({
                    ...f,
                    doseInfo: String(maxQuantity),
                }));
            } else {
                setForm(f => ({ ...f, doseInfo: "" }));
            }
        } else {
            setForm(f => ({ ...f, doseInfo: "" }));
        }
    }, [form.vaccineId, vaccines, maxQuantity]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        // Just a demo submit — replace with real API later
        alert("Vaccine form created!");
        console.log(form);
    };

    return (
        <div className="vaccine-campaign-root">
            <form className="vaccine-campaign-form" onSubmit={handleSubmit}>
                <h2 className="vaccine-campaign-title">
                    Vaccine Campaign Form
                </h2>
                <div className="vaccine-section">
                    <div className="vaccine-section-title">
                        Campaign Information
                    </div>
                    <TextField
                        id="campaignName"
                        label="Campaign Name"
                        variant="outlined"
                        name="campaignName"
                        value={form.campaignName}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </div>

                <div className="vaccine-section">
                    <div className="vaccine-section-title">Vaccine Details</div>
                    <div className="vaccine-row">
                        <select
                            className="vaccine-input"
                            name="diseaseId"
                            value={form.diseaseId}
                            onChange={handleChange}
                            required
                            disabled={isVaccineLoading}
                        >
                            <option value="">Select Disease</option>
                            {isVaccineLoading ? (
                                <option disabled>Loading...</option>
                            ) : diseases.length === 0 ? (
                                <option disabled>No diseases found</option>
                            ) : (
                                diseases.map(d => (
                                    <option key={d.diseaseId} value={d.diseaseId}>
                                        {d.diseaseName}
                                    </option>
                                ))
                            )}
                        </select>

                        <select
                            className="vaccine-input"
                            name="vaccineId"
                            value={form.vaccineId}
                            onChange={handleChange}
                            required
                            disabled={!form.diseaseId}
                        >
                            <option value="">Select Vaccine</option>
                            {vaccines.map(v => (
                                <option key={v.vaccineId} value={v.vaccineId}>
                                    {v.name}
                                </option>
                            ))}
                        </select>

                        <input
                            className="vaccine-input"
                            type="number"
                            name="doseInfo"
                            placeholder="Dose Quantity"
                            value={form.doseInfo}
                            min={maxQuantity || 1}
                            max={maxQuantity || ""}
                            disabled
                        />
                    </div>
                </div>


                <div className="vaccine-section">
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
                </div>

                <div className="vaccine-section">
                    <div className="vaccine-section-title">Additional Notes</div>
                    <TextField
                        id="description"
                        label="Description (purpose & notes)"
                        variant="outlined"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        fullWidth
                    />
                </div>

                <button className="vaccine-submit-btn" type="submit">
                    Create Campaign
                </button>
            </form>
        </div>
    );
};

export default VaccineCampaignForm;
