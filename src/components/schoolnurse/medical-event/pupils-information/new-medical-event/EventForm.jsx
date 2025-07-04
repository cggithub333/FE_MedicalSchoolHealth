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



// Generate fake medical events for each pupil
const fakeMedicalEvents = fakePupils.map((pupil, idx) => ({
    medicalEventId: idx + 1,
    injuryDescription: `Sample injury description for ${pupil.name}`,
    treatmentDescription: `Sample treatment for ${pupil.name}`,
    detailedInformation: `Additional details for ${pupil.name}`,
    status: ["low", "medium", "high"][idx % 3],
    dateTime: new Date(Date.now() - idx * 86400000).toISOString(),
    isActive: true,
    pupil: {
        pupilId: pupil.id,
        lastName: pupil.name.split(" ").slice(-1)[0],
        firstName: pupil.name.split(" ")[0],
        birthDate: "2012-01-01",
        gender: idx % 2 === 0 ? "Female" : "Male",
        avatar: "",
        gradeId: idx + 1,
        startYear: 2017,
        gradeLevel: `GRADE_${pupil.grade.replace(/\D/g, '')}`,
        gradeName: pupil.class,
        parents: [
            {
                userId: `parent${idx + 1}`,
                lastName: pupil.parent.name.split(" ").slice(-1)[0],
                firstName: pupil.parent.name.split(" ")[0],
                birthDate: "1980-01-01",
                email: pupil.parent.email,
                phoneNumber: pupil.parent.phone,
                avatar: "",
                createdAt: "2020-01-01",
                role: "PARENT"
            }
        ]
    },
    schoolNurse: {
        userId: `nurse${idx + 1}`,
        firstName: "Nurse",
        lastName: `#${idx + 1}`,
        phoneNumber: "555-0000"
    },
    equipmentUsed: [fakeEquipment[idx % fakeEquipment.length]],
    medicationUsed: [fakeMedications[idx % fakeMedications.length]]
}))

const event = fakeMedicalEvents[0];
const medicalEventId = event.medicalEventId;
const injuryDescription = event.injuryDescription;
const treatmentDescription = event.treatmentDescription;
const detailedInformation = event.detailedInformation;
const status = event.status;
const dateTime = event.dateTime;
const isActive = event.isActive;

// Pupil info
const pupil = event.pupil;
const pupilId = pupil.pupilId;
const lastName = pupil.lastName;
const firstName = pupil.firstName;
const birthDate = pupil.birthDate;
const gender = pupil.gender;
const avatar = pupil.avatar;
const gradeId = pupil.gradeId;
const startYear = pupil.startYear;
const gradeLevel = pupil.gradeLevel;
const gradeName = pupil.gradeName;

// parent info
const parents = pupil.parents[0]; // array of parent objects
const parentUserId = parents.userId;
const parentLastName = parents.lastName;
const parentFirstName = parents.firstName;
const parentBirthDate = parents.birthDate;
const parentEmail = parents.email;
const parentPhoneNumber = parents.phoneNumber;
const parentAvatar = parents.avatar;
const parentCreatedAt = parents.createdAt;
const parentRole = parents.role; // e.g., "PARENT"


// School nurse info
const schoolNurse = event.schoolNurse;
const nurseUserId = schoolNurse.userId;
const nurseFirstName = schoolNurse.firstName;
const nurseLastName = schoolNurse.lastName;
const nursePhoneNumber = schoolNurse.phoneNumber;

// Equipment and medication used (arrays)
const equipmentUsed = event.equipmentUsed; // array of equipment objects
const medicationUsed = event.medicationUsed; // array of medication objects

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

const MedicalEventResultForm = () => {
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
                                                                    <strong>Name:</strong> {firstName} {lastName}
                                                                </Typography>
                                                                <Typography>
                                                                    <strong>ID:</strong> {pupilId}
                                                                </Typography>
                                                                <Typography>
                                                                    <strong>Class:</strong> {gradeName}
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
                                                                    {parentLastName} {parentFirstName}
                                                                </Typography>
                                                                <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                    <Phone fontSize="small" />
                                                                    {parentPhoneNumber}
                                                                </Typography>
                                                                <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                    <Email fontSize="small" />
                                                                    {parentEmail}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </div>
                                                    <div style={{ width: "20%" }}>
                                                        <Typography variant="h6" className="details-title">
                                                            Health status
                                                        </Typography>
                                                        <Chip label={status} color={getStatusColor(status)} size="normal" sx={{ textTransform: 'capitalize', fontWeight: 1000 }} />
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
                                                                minRows={1} // minimum rows
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
                                                                minRows={1} // minimum rows
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
                                                            minRows={1} // minimum rows
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
                                                                Medication Details
                                                            </Typography>
                                                            <TableContainer component={Paper}>
                                                                <Table>
                                                                    {/* Table Header */}
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Name</TableCell>
                                                                            <TableCell>Description</TableCell>
                                                                            <TableCell>Unit</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>

                                                                    {/* Table Body */}
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
                                                                Equipment Details
                                                            </Typography>
                                                            <TableContainer component={Paper}>
                                                                <Table>
                                                                    {/* Table Header */}
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Name</TableCell>
                                                                            <TableCell>Description</TableCell>
                                                                            <TableCell>Dosage</TableCell>
                                                                            <TableCell>Unit</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>

                                                                    {/* Table Body */}
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
                                                                    <strong>Name:</strong> {nurseFirstName} {nurseLastName}
                                                                </Typography>
                                                                <Typography>
                                                                    <strong>Contact:</strong> {nursePhoneNumber}
                                                                </Typography>

                                                            </Box>
                                                        </Grid>
                                                    </div>
                                                </Grid>
                                            </Box>
                                        </Paper>
                                    </Box>
                                </Card>
                            </Slide>

                        </Box>
                    </form>
                </Box>
            </Container>
        </div>
    )
}

export default MedicalEventResultForm
