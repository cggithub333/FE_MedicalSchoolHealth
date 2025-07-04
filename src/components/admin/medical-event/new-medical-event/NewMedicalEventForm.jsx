import { useState } from "react"
import {
    Box,
    Button,
    Card,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Chip,
    Paper,
    Divider,
    Container,
    Fade,
    Slide,
} from "@mui/material"
import { CalendarToday, Person, Phone, Email, Warning, LocalHospital, Print, Clear, Save } from "@mui/icons-material"
import { Autocomplete } from '@mui/material';
import "./MedicalEventForm.scss"

// Fake pupils data with parent info
const fakePupils = [
    {
        id: "P001",
        name: "Alice Nguyen",
        grade: "5th",
        class: "5A",
        parent: {
            name: "Minh Nguyen",
            phone: "555-1234",
            email: "minh.nguyen@email.com",
        },
    },
    {
        id: "P002",
        name: "Bao Le",
        grade: "4th",
        class: "4B",
        parent: {
            name: "Lan Le",
            phone: "555-5678",
            email: "lan.le@email.com",
        },
    },
    {
        id: "P003",
        name: "Chi Pham",
        grade: "6th",
        class: "6C",
        parent: {
            name: "Tuan Pham",
            phone: "555-9012",
            email: "tuan.pham@email.com",
        },
    },
    {
        id: "P004",
        name: "David Kim",
        grade: "3rd",
        class: "3A",
        parent: {
            name: "Sarah Kim",
            phone: "555-3456",
            email: "sarah.kim@email.com",
        },
    },
    {
        id: "P005",
        name: "Emma Wilson",
        grade: "5th",
        class: "5B",
        parent: {
            name: "John Wilson",
            phone: "555-7890",
            email: "john.wilson@email.com",
        },
    },
]

// Fake medications data
const fakeMedications = [
    { medication_id: "M001", name: "Paracetamol", description: "Pain reliever and fever reducer", dosage: "500mg", unit: "tablet", is_active: true },
    { medication_id: "M002", name: "Ibuprofen", description: "Anti-inflammatory and pain relief", dosage: "200mg", unit: "tablet", is_active: true },
    { medication_id: "M003", name: "Amoxicillin", description: "Antibiotic for infections", dosage: "250mg", unit: "capsule", is_active: true },
    { medication_id: "M004", name: "Cetirizine", description: "Antihistamine for allergies", dosage: "10mg", unit: "tablet", is_active: true },
    { medication_id: "M005", name: "Salbutamol Inhaler", description: "Relief for asthma symptoms", dosage: "100mcg", unit: "puff", is_active: true },
]

// Fake equipment data
const fakeEquipment = [
    { equipment_id: "E001", name: "Bandage", description: "Sterile bandage for wounds", unit: "piece", is_active: true },
    { equipment_id: "E002", name: "Ice Pack", description: "Reusable cold pack for injuries", unit: "pack", is_active: true },
    { equipment_id: "E003", name: "Thermometer", description: "Digital thermometer for temperature", unit: "unit", is_active: true },
    { equipment_id: "E004", name: "Gloves", description: "Disposable medical gloves", unit: "pair", is_active: true },
    { equipment_id: "E005", name: "Antiseptic Wipes", description: "Wipes for cleaning wounds", unit: "piece", is_active: true },
]

const MedicalEventForm = ({ onCancel }) => {
    // Get current date-time in yyyy-MM-ddTHH:mm format for input type="datetime-local"
    const getCurrentDateTime = () => {
        const now = new Date()
        const pad = (n) => n.toString().padStart(2, '0')
        const yyyy = now.getFullYear()
        const MM = pad(now.getMonth() + 1)
        const dd = pad(now.getDate())
        const hh = pad(now.getHours())
        const mm = pad(now.getMinutes())
        return `${yyyy}-${MM}-${dd}T${hh}:${mm}`
    }

    const [formData, setFormData] = useState({
        dateTime: getCurrentDateTime(),
        injuryDescription: "",
        treatmentDescription: "",
        detailedInformation: "",
        status: "",
    })

    const [selectedPupil, setSelectedPupil] = useState(null)
    const [showPupilDetails, setShowPupilDetails] = useState(false)
    const [selectedMedications, setSelectedMedications] = useState([])
    const [selectedEquipment, setSelectedEquipment] = useState([])

    const handlePupilSelect = (event) => {
        const pupilId = event.target.value
        const pupil = fakePupils.find((p) => p.id === pupilId)
        setSelectedPupil(pupil || null)
        setShowPupilDetails(!!pupil)
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Medical Event Form Data:", { ...formData, selectedPupil, selectedMedications, selectedEquipment })
        alert("Medical event recorded successfully!");
    }

    const handleClearForm = () => {
        const confirmed = window.confirm("Are you sure you want to clear all form data?")
        if (confirmed) {
            setFormData({
                dateTime: getCurrentDateTime(),
                injuryDescription: "",
                treatmentDescription: "",
                detailedInformation: "",
                status: "",
            })
            setSelectedPupil(null)
            setShowPupilDetails(false)
            setSelectedMedications([])
            setSelectedEquipment([])
        }
    }

    const getSeverityColor = (status) => {
        switch (status) {
            case "low":
                return "success"
            case "medium":
                return "warning"
            case "high":
                return "error"
            default:
                return "default"
        }
    }

    const getSeverityIcon = (status) => {
        switch (status) {
            case "low":
                return "🟢"
            case "medium":
                return "🟡"
            case "high":
                return "🔴"
            default:
                return ""
        }
    }

    return (
        <div className="medical-form-container">
            <>
                <Container maxWidth="xl" sx={{ maxWidth: '1800px', width: '100%' }}>
                    <Box sx={{ py: 4 }}>
                        {/* Header */}
                        <Fade in timeout={800}>
                            <Card className="header-card" elevation={8}>
                                <Box sx={{ p: 4, textAlign: "center" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                                        <LocalHospital sx={{ fontSize: 48, color: "primary.main", mr: 2 }} />
                                        <Typography variant="h3" className="header-title">
                                            Medical Event Report
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" className="header-subtitle">
                                        Complete this form to document any medical event, injury, or health incident involving a student
                                    </Typography>
                                </Box>
                            </Card>
                        </Fade>

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                                {/* Student Information */}
                                <Slide direction="up" in timeout={600}>
                                    <Card className="form-section-card" elevation={4}>
                                        <Box className="section-header">
                                            <Typography variant="h5" className="section-title">
                                                <Person sx={{ mr: 1, verticalAlign: "middle" }} />
                                                Student Information
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ p: 3 }}>
                                            <Grid container spacing={3}>
                                                <div style={{ width: "40%" }}>
                                                    <Grid item xs={12} md={6}>
                                                        <Autocomplete
                                                            fullWidth
                                                            options={fakePupils}
                                                            getOptionLabel={(option) => option ? `${option.name} (${option.id})` : ''}
                                                            value={selectedPupil}
                                                            onChange={(_, value) => {
                                                                setSelectedPupil(value)
                                                                setShowPupilDetails(!!value)
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField {...params} label="Search Pupil or ID" placeholder="Type name or ID..." variant="outlined" required />
                                                            )}
                                                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                            filterOptions={(options, { inputValue }) =>
                                                                options.filter(
                                                                    (p) =>
                                                                        p.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                                                                        p.id.toLowerCase().includes(inputValue.toLowerCase())
                                                                )
                                                            }
                                                        />
                                                    </Grid>
                                                </div>

                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        type="datetime-local"
                                                        label="Date & Time"
                                                        value={formData.dateTime}
                                                        onChange={(e) => handleInputChange("dateTime", e.target.value)}
                                                        InputLabelProps={{ shrink: true }}
                                                        InputProps={{
                                                            startAdornment: <CalendarToday sx={{ mr: 1, color: "action.active" }} />,
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>

                                            {showPupilDetails && selectedPupil && (
                                                <Fade in timeout={500}>
                                                    <Paper className="pupil-details-card" elevation={2}>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="h6" className="details-title">
                                                                    Student Details
                                                                </Typography>
                                                                <Box className="details-content">
                                                                    <Typography>
                                                                        <strong>Name:</strong> {selectedPupil.name}
                                                                    </Typography>
                                                                    <Typography>
                                                                        <strong>ID:</strong> {selectedPupil.id}
                                                                    </Typography>
                                                                    <Typography>
                                                                        <strong>Class:</strong> {selectedPupil.class}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="h6" className="details-title">
                                                                    Parent/Guardian Contact
                                                                </Typography>
                                                                <Box className="details-content">
                                                                    <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                        <Person fontSize="small" />
                                                                        {selectedPupil.parent.name}
                                                                    </Typography>
                                                                    <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                        <Phone fontSize="small" />
                                                                        {selectedPupil.parent.phone}
                                                                    </Typography>
                                                                    <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                        <Email fontSize="small" />
                                                                        {selectedPupil.parent.email}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                </Fade>
                                            )}
                                        </Box>
                                    </Card>
                                </Slide>

                                {/* Incident Details */}
                                <Slide direction="up" in timeout={800}>
                                    <Card className="form-section-card" elevation={4}>
                                        <Box className="section-header">
                                            <Typography variant="h5" className="section-title">
                                                <Warning sx={{ mr: 1, verticalAlign: "middle" }} />
                                                Incident Details
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ p: 3 }}>
                                            <Grid container spacing={3}>
                                                <div style={{ width: "100%" }}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            multiline
                                                            rows={4}
                                                            label="Injury Description"
                                                            placeholder="Describe the injury (e.g., cut, bruise, sprain, etc.)"
                                                            value={formData.injuryDescription}
                                                            onChange={(e) => handleInputChange("injuryDescription", e.target.value)}
                                                            className="textarea-field"
                                                        />
                                                    </Grid>
                                                </div>

                                                <div style={{ width: "100%" }}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            multiline
                                                            rows={4}
                                                            label="Treatment Description"
                                                            placeholder="Describe the treatment given (e.g., ice pack, bandage, etc.)"
                                                            value={formData.treatmentDescription}
                                                            onChange={(e) => handleInputChange("treatmentDescription", e.target.value)}
                                                            className="textarea-field"
                                                        />
                                                    </Grid></div>

                                                <div style={{ width: "100%" }}><Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        multiline
                                                        rows={5}
                                                        label="Additional Details"
                                                        placeholder="Provide any additional details about the incident, circumstances, witnesses, etc."
                                                        value={formData.detailedInformation}
                                                        onChange={(e) => handleInputChange("detailedInformation", e.target.value)}
                                                        className="textarea-field"
                                                    />
                                                </Grid>
                                                </div>



                                            </Grid>
                                        </Box>
                                    </Card>
                                </Slide>

                                {/* Medication & Equipment Section */}
                                <Slide direction="up" in timeout={900}>
                                    <Card className="form-section-card" elevation={4}>
                                        <Box className="section-header">
                                            <Typography variant="h5" className="section-title">
                                                <LocalHospital sx={{ mr: 1, verticalAlign: "middle" }} />
                                                Medication & Equipment Used
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ p: 3 }}>
                                            <Grid container spacing={3}>
                                                <div style={{ width: "100%" }}>
                                                    <Grid item xs={12} md={6}>
                                                        <Autocomplete
                                                            multiple
                                                            fullWidth
                                                            options={fakeMedications}
                                                            getOptionLabel={(option) => option ? `${option.name} (${option.dosage} ${option.unit})` : ''}
                                                            value={selectedMedications}
                                                            onChange={(_, value) => setSelectedMedications(value)}
                                                            renderInput={(params) => (
                                                                <TextField {...params} label="Search & Add Medication" placeholder="Type medication name..." variant="outlined" />
                                                            )}
                                                            isOptionEqualToValue={(option, value) => option?.medication_id === value?.medication_id}
                                                            filterOptions={(options, { inputValue }) =>
                                                                options.filter(
                                                                    (m) =>
                                                                        m.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                                                                        m.description.toLowerCase().includes(inputValue.toLowerCase())
                                                                )
                                                            }
                                                            renderTags={(value, getTagProps) =>
                                                                value.map((option, index) => (
                                                                    <Chip
                                                                        label={`${option.name} (${option.dosage} ${option.unit})`}
                                                                        {...getTagProps({ index })}
                                                                        key={option.medication_id}
                                                                    />
                                                                ))
                                                            }
                                                        />
                                                    </Grid>
                                                </div>

                                                <div style={{ width: "100%" }}>
                                                    <Grid item xs={12} md={6}>
                                                        <Autocomplete
                                                            multiple
                                                            fullWidth
                                                            options={fakeEquipment}
                                                            getOptionLabel={(option) => option ? `${option.name} (${option.unit})` : ''}
                                                            value={selectedEquipment}
                                                            onChange={(_, value) => setSelectedEquipment(value)}
                                                            renderInput={(params) => (
                                                                <TextField {...params} label="Search & Add Equipment" placeholder="Type equipment name..." variant="outlined" />
                                                            )}
                                                            isOptionEqualToValue={(option, value) => option?.equipment_id === value?.equipment_id}
                                                            filterOptions={(options, { inputValue }) =>
                                                                options.filter(
                                                                    (e) =>
                                                                        e.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                                                                        e.description.toLowerCase().includes(inputValue.toLowerCase())
                                                                )
                                                            }
                                                            renderTags={(value, getTagProps) =>
                                                                value.map((option, index) => (
                                                                    <Chip
                                                                        label={`${option.name} (${option.unit})`}
                                                                        {...getTagProps({ index })}
                                                                        key={option.equipment_id}
                                                                    />
                                                                ))
                                                            }
                                                        />
                                                    </Grid>
                                                </div>

                                            </Grid>
                                        </Box>
                                    </Card>
                                </Slide>

                                {/* Action Buttons */}
                                <Slide direction="up" in timeout={1000}>
                                    <Card className="action-buttons-card" elevation={4}>
                                        <Box sx={{ p: 3 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        size="large"
                                                        fullWidth
                                                        className="submit-button"
                                                        startIcon={<Save />}
                                                    >
                                                        Submit Report
                                                    </Button>
                                                </Grid>

                                                <Grid item xs={12} sm={12} md={4}>
                                                    <Button
                                                        type="button"
                                                        variant="text"
                                                        size="large"
                                                        fullWidth
                                                        onClick={handleClearForm}
                                                        startIcon={<Clear />}
                                                        className="clear-button"
                                                    >
                                                        Clear Form
                                                    </Button>
                                                </Grid>
                                                <div style={{ width: "50%" }}>
                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth required>
                                                            <InputLabel>Severity Level</InputLabel>
                                                            <Select
                                                                value={formData.status}
                                                                onChange={(e) => handleInputChange("status", e.target.value)}
                                                                label="Severity Level"
                                                            >
                                                                <MenuItem value="low">
                                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                        🟢 Low - Minor injury, no immediate concern
                                                                    </Box>
                                                                </MenuItem>
                                                                <MenuItem value="medium">
                                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                        🟡 Medium - Moderate injury, requires monitoring
                                                                    </Box>
                                                                </MenuItem>
                                                                <MenuItem value="high">
                                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                        🔴 High - Serious injury, immediate attention needed
                                                                    </Box>
                                                                </MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        {formData.status && (
                                                            <Box sx={{ mt: 2 }}>
                                                                <Chip
                                                                    label={`${getSeverityIcon(formData.status)} ${formData.status.charAt(0).toUpperCase() + formData.status.slice(1)} Severity`}
                                                                    color={getSeverityColor(formData.status)}
                                                                    variant="filled"
                                                                    size="medium"
                                                                />
                                                            </Box>
                                                        )}
                                                    </Grid>
                                                </div>
                                                <Grid item xs={12} sm={12} md={4}>
                                                    <Button
                                                        type="button"
                                                        size="large"
                                                        fullWidth
                                                        onClick={onCancel}
                                                        variant="outlined"
                                                        color="secondary"
                                                        startIcon={<Clear />}
                                                        className="clear-button"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Card>
                                </Slide>
                            </Box>
                        </form>
                    </Box>
                </Container>
            </>
        </div>
    )
}

export default MedicalEventForm
