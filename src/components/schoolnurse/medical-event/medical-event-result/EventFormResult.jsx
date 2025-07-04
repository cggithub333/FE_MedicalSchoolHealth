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
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow
} from '@mui/material';
import "./MedicalEventForm.scss"

//custom hooks 
import { useGetMedicalEventByMedicalEventId } from "@hooks/schoolnurse/new-event/useGetMedicalEventByMedicalEventId"

const MedicalEventResultForm = ({ onCancel, eventId }) => {
    // Fetch real event details
    console.log("Fetching event details for ID:", eventId);
    const { medicalEventDetail: event, loading, error } = useGetMedicalEventByMedicalEventId(eventId);
    console.log("Event details:", event);
    if (loading) return <div>Loading...</div>;
    if (error || !event) return <div>Error loading event details.</div>;

    // Destructure event data
    const {
        injuryDescription,
        treatmentDescription,
        detailedInformation,
        status,
        dateTime,
        pupil,
        schoolNurse,
        equipmentUsed = [],
        medicationUsed = [],
    } = event;
    const parent = pupil?.parents?.[0] || {};

    const getStatusColor = (status) => {
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
            <Container maxWidth="lg">
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
                            </Box>
                        </Card>
                    </Fade>

                    {/* Student Information */}
                    <form>
                        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 4 }}>
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
                                        <Fade in timeout={500}>
                                            <Paper className="pupil-details-card" elevation={2}>
                                                <Grid container spacing={3}>
                                                    <div style={{ width: "35%" }}>
                                                        <Grid item xs={12} md={5}>
                                                            <Typography variant="h6" className="details-title">
                                                                Student Details
                                                            </Typography>
                                                            <Box className="details-content">
                                                                <Typography>
                                                                    <strong>Name:</strong> {pupil?.firstName} {pupil?.lastName}
                                                                </Typography>
                                                                <Typography>
                                                                    <strong>ID:</strong> {pupil?.pupilId}
                                                                </Typography>
                                                                <Typography>
                                                                    <strong>Class:</strong> {pupil?.gradeName}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </div>

                                                    <div style={{ width: "35%" }}>
                                                        <Grid item xs={12} md={5}>
                                                            <Typography variant="h6" className="details-title">
                                                                Parent/Guardian Contact
                                                            </Typography>
                                                            <Box className="details-content">
                                                                <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                    <Person fontSize="small" />
                                                                    {parent?.lastName} {parent?.firstName}
                                                                </Typography>
                                                                <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                    <Phone fontSize="small" />
                                                                    {parent?.phoneNumber}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </div>

                                                    <div style={{ width: "20%" }}>
                                                        <Typography variant="h6" className="details-title">
                                                            Health status
                                                        </Typography>
                                                        <Chip label={status} color={getStatusColor(status?.toLowerCase())} size="normal" sx={{ textTransform: 'capitalize', fontWeight: 1000 }} />
                                                    </div>

                                                </Grid>
                                            </Paper>
                                        </Fade>
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
                                        <Paper className="pupil-details-card" elevation={2}>
                                            <Box sx={{ p: 3 }}>
                                                <Grid container spacing={2}>
                                                    <Typography variant="h6" className="details-title">
                                                        Injury Description
                                                    </Typography>
                                                    <div style={{ width: "100%" }}>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                fullWidth
                                                                multiline
                                                                minRows={1}
                                                                maxRows={10}
                                                                value={injuryDescription}
                                                                className="textarea-field"
                                                                disabled
                                                            />
                                                        </Grid>
                                                    </div>
                                                    <Typography variant="h6" className="details-title">
                                                        Treatment Description
                                                    </Typography>
                                                    <div style={{ width: "100%" }}>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                fullWidth
                                                                required
                                                                multiline
                                                                minRows={1}
                                                                maxRows={10}
                                                                value={treatmentDescription}
                                                                disabled
                                                            />
                                                        </Grid>
                                                    </div>
                                                    <Typography variant="h6" className="details-title">
                                                        Additional Details
                                                    </Typography>
                                                    <div style={{ width: "100%" }}><Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            multiline
                                                            minRows={1}
                                                            maxRows={10}
                                                            value={detailedInformation}
                                                            disabled
                                                        />
                                                    </Grid>
                                                    </div>
                                                </Grid>
                                            </Box>
                                        </Paper>
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
                                        <Fade in timeout={500}>
                                            <Paper className="pupil-details-card" elevation={2}>
                                                <Grid container spacing={3}>
                                                    <div style={{ width: "100%" }}>
                                                        <Grid item xs={12} md={5}>
                                                            <Typography variant="h6" className="details-title">
                                                                Equipment Details
                                                            </Typography>
                                                            <TableContainer component={Paper}>
                                                                <Table>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Name</TableCell>
                                                                            <TableCell>Description</TableCell>
                                                                            <TableCell>Unit</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {equipmentUsed.map((item, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>{item.name}</TableCell>
                                                                                <TableCell>{item.description}</TableCell>
                                                                                <TableCell>{item.unit}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Grid>
                                                    </div>

                                                    <div style={{ width: "100%" }}>
                                                        <Grid item xs={12} md={5}>
                                                            <Typography variant="h6" className="details-title">
                                                                Medication Details
                                                            </Typography>
                                                            <TableContainer component={Paper}>
                                                                <Table>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Name</TableCell>
                                                                            <TableCell>Description</TableCell>
                                                                            <TableCell>Dosage</TableCell>
                                                                            <TableCell>Unit</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {medicationUsed.map((item, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>{item.name}</TableCell>
                                                                                <TableCell>{item.description}</TableCell>
                                                                                <TableCell>{item.dosage}</TableCell>
                                                                                <TableCell>{item.unit}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Grid>
                                                    </div>
                                                </Grid>
                                            </Paper>
                                        </Fade>
                                    </Box>
                                </Card>
                            </Slide>

                            {/* Responsible Nurse */}
                            <Slide direction="up" in timeout={800}>
                                <Card className="form-section-card" elevation={4}>
                                    <Box className="section-header">
                                        <Typography variant="h5" className="section-title">
                                            <Warning sx={{ mr: 1, verticalAlign: "middle" }} />
                                            Responsible Nurse
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ p: 3 }}>
                                        <Paper className="pupil-details-card" elevation={2}>
                                            <Box sx={{ p: 3 }}>
                                                <Grid container spacing={2}>
                                                    <div style={{ width: "35%" }}>
                                                        <Grid item xs={12} md={5}>
                                                            <Typography variant="h6" className="details-title">
                                                                School Nurse & Contact
                                                            </Typography>
                                                            <Box className="details-content">
                                                                <Typography>
                                                                    <strong>Name:</strong> {schoolNurse?.firstName} {schoolNurse?.lastName}
                                                                </Typography>
                                                                <Typography>
                                                                    <strong>Contact:</strong> {schoolNurse?.phoneNumber}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </div>
                                                </Grid>
                                            </Box>
                                        </Paper>
                                    </Box>
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
                                            BACK
                                        </Button>
                                    </Grid>
                                </Card>
                            </Slide>

                        </Box>
                    </form>
                </Box>
            </Container>
        </div>
    );
}

export default MedicalEventResultForm
