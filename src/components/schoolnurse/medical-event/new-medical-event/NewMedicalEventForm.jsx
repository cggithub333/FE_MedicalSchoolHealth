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

//custom hooks
import { useGetPupilsInformation } from "../../../../hooks/schoolnurse/new-event/useGetPupilsInformation"
import { useCreateNewMedicalEvent } from "../../../../hooks/schoolnurse/new-event/useCreateNewMedicalEvent"
import { useGetAllEquipment } from "../../../../hooks/schoolnurse/new-event/useGetAllEquipment"
import { useGetAllMedication } from "../../../../hooks/schoolnurse/new-event/useGetAllMedication"

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

    // Use custom hooks for real data
    const { pupilsList: pupils = [], loading: pupilsLoading } = useGetPupilsInformation();
    const { medicationList: medications = [], loading: medicationsLoading } = useGetAllMedication();
    const { equipmentList: equipment = [], loading: equipmentLoading } = useGetAllEquipment();
    const { createNewMedicalEvent, loading: createLoading, error: createError, success: createSuccess } = useCreateNewMedicalEvent();

    // Debug: Log pupils array to verify data at render time
    console.log('Pupils from API:', pupils);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedPupil) {
            alert('Please select a pupil.');
            return;
        }
        createNewMedicalEvent({
            pupilId: selectedPupil.pupilId,
            injuryDescription: formData.injuryDescription,
            treatmentDescription: formData.treatmentDescription,
            detailedInformation: formData.detailedInformation,
            status: formData.status.toUpperCase(),
            equipmentIds: selectedEquipment.map(e => e.equipmentId),
            medicationIds: selectedMedications.map(m => m.medicationId),
        });
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
                                                            options={pupils}
                                                            getOptionLabel={(option) => option ? `${option.firstName} ${option.lastName} (${option.pupilId})` : ''}
                                                            value={selectedPupil}
                                                            onChange={(_, value) => {
                                                                setSelectedPupil(value)
                                                                setShowPupilDetails(!!value)
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField {...params} label="Search Pupil or ID" placeholder="Type name or ID..." variant="outlined" required />
                                                            )}
                                                            isOptionEqualToValue={(option, value) => option?.pupilId === value?.pupilId}
                                                            filterOptions={(options, { inputValue }) =>
                                                                options.filter(
                                                                    (p) =>
                                                                        `${p.firstName} ${p.lastName}`.toLowerCase().includes(inputValue.toLowerCase()) ||
                                                                        p.pupilId.toLowerCase().includes(inputValue.toLowerCase())
                                                                )
                                                            }
                                                            loading={pupilsLoading}
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
                                                                        <strong>Name:</strong> {selectedPupil.firstName} {selectedPupil.lastName}
                                                                    </Typography>
                                                                    <Typography>
                                                                        <strong>ID:</strong> {selectedPupil.pupilId}
                                                                    </Typography>
                                                                    <Typography>
                                                                        <strong>Class:</strong> {selectedPupil.gradeName}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="h6" className="details-title">
                                                                    Parent/Guardian Contact
                                                                </Typography>
                                                                <Box className="details-content">
                                                                    {selectedPupil.parents && selectedPupil.parents.length > 0 && (
                                                                        <>
                                                                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                                <Person fontSize="small" />
                                                                                {selectedPupil.parents[0].firstName} {selectedPupil.parents[0].lastName}
                                                                            </Typography>
                                                                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                                <Phone fontSize="small" />
                                                                                {selectedPupil.parents[0].phoneNumber}
                                                                            </Typography>
                                                                        </>
                                                                    )}
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
                                                            options={medications}
                                                            getOptionLabel={(option) => option ? `${option.name} (${option.dosage} ${option.unit})` : ''}
                                                            value={selectedMedications}
                                                            onChange={(_, value) => setSelectedMedications(value)}
                                                            renderInput={(params) => (
                                                                <TextField {...params} label="Search & Add Medication" placeholder="Type medication name..." variant="outlined" />
                                                            )}
                                                            isOptionEqualToValue={(option, value) => option?.medicationId === value?.medicationId}
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
                                                                        key={option.medicationId}
                                                                    />
                                                                ))
                                                            }
                                                            loading={medicationsLoading}
                                                        />
                                                    </Grid>
                                                </div>

                                                <div style={{ width: "100%" }}>
                                                    <Grid item xs={12} md={6}>
                                                        <Autocomplete
                                                            multiple
                                                            fullWidth
                                                            options={equipment}
                                                            getOptionLabel={(option) => option ? `${option.name} (${option.unit})` : ''}
                                                            value={selectedEquipment}
                                                            onChange={(_, value) => setSelectedEquipment(value)}
                                                            renderInput={(params) => (
                                                                <TextField {...params} label="Search & Add Equipment" placeholder="Type equipment name..." variant="outlined" />
                                                            )}
                                                            isOptionEqualToValue={(option, value) => option?.equipmentId === value?.equipmentId}
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
                                                                        key={option.equipmentId}
                                                                    />
                                                                ))
                                                            }
                                                            loading={equipmentLoading}
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
