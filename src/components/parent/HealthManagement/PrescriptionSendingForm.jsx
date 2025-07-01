"use client"

import { useState } from "react"
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Paper,
  Avatar,
  Divider,
  Alert,
  IconButton,
} from "@mui/material"
import { LocalPharmacy, Person, CalendarToday, Note, Add, Delete, AttachFile, Send, MedicationLiquid as MedicationIcon } from "@mui/icons-material"

import usePupils from "@hooks/parent/usePupils"

const PrescriptionSendingForm = () => {

  const { pupils, isLoading } = usePupils();

  // Form state
  const [selectedPupilId, setSelectedPupilId] = useState("")
  const [diseaseName, setDiseaseName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [note, setNote] = useState("")
  const [prescriptionImage, setPrescriptionImage] = useState(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [medicationItems, setMedicationItems] = useState([
    {
      medicationName: "",
      unitAndUsage: "",
      medicationSchedule: "",
    },
  ])

  // Validation errors
  const [errors, setErrors] = useState({})

  const scheduleOptions = ["After breakfast: 9h00-9h30", "After lunch: 11h30-12h00", "Before lunch: 10h30-11h00"]

  const getCurrentDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const validateForm = () => {
    const newErrors = {}

    if (!selectedPupilId) newErrors.pupilId = "Please select a pupil"
    if (!diseaseName.trim()) newErrors.diseaseName = "Disease name is required"
    if (!startDate) newErrors.startDate = "Start date is required"
    if (!endDate) newErrors.endDate = "End date is required"
    if (!note.trim()) newErrors.note = "Notes are required"

    // Date validation
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (start <= today) {
        newErrors.startDate = "Start date must be after today"
      }
      if (start >= end) {
        newErrors.endDate = "End date must be after start date"
      }
    }

    // Medication validation
    medicationItems.forEach((item, index) => {
      if (!item.medicationName.trim()) {
        newErrors[`medication_${index}_name`] = "Medication name is required"
      }
      if (!item.unitAndUsage.trim()) {
        newErrors[`medication_${index}_usage`] = "Unit and usage is required"
      }
      if (!item.medicationSchedule) {
        newErrors[`medication_${index}_schedule`] = "Schedule is required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddMedication = () => {
    setMedicationItems([
      ...medicationItems,
      {
        medicationName: "",
        unitAndUsage: "",
        medicationSchedule: "",
      },
    ])
  }

  const handleRemoveMedication = (index) => {
    if (medicationItems.length > 1) {
      const newItems = medicationItems.filter((_, i) => i !== index)
      setMedicationItems(newItems)
    }
  }

  const handleMedicationChange = (index, field, value) => {
    const newItems = [...medicationItems]
    newItems[index][field] = value
    setMedicationItems(newItems)
  }

  const handleImageAttach = () => {
    // Empty function as requested - logic to be added later
    console.log("Image attach functionality to be implemented")
  }

  const handleSendPrescription = () => {
    if (!validateForm()) {
      return
    }

    const formData = {
      pupilId: selectedPupilId,
      diseaseName: diseaseName.trim(),
      startDate,
      endDate,
      prescriptionImage:
        prescriptionImage || "https://anh.24h.com.vn/upload/4-2014/images/2014-10-24/1414124020-toa-thuoc.jpg",
      note: note.trim(),
      medicationItems: medicationItems.map((item) => ({
        medicationName: item.medicationName.trim(),
        unitAndUsage: item.unitAndUsage.trim(),
        medicationSchedule: item.medicationSchedule,
      })),
    }

    console.log("Prescription data to be sent:", JSON.stringify(formData, null, 2))
    // Here you would typically send the data to your server
  }

  const selectedPupil = pupils.find((pupil) => pupil.pupilId === selectedPupilId)

  return (
    <Container maxWidth={false} sx={{ py: 3, width: '100%', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
          <LocalPharmacy />
        </Avatar>
        <Typography variant="h4" fontWeight="bold">
          New Prescription
        </Typography>
      </Box>

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {/* Pupil Selection */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Person color="primary" />
              <Typography variant="h6" textTransform={'uppercase'} fontWeight="bold" color="primary.main">
                Select Pupil  
              </Typography>
            </Box>
            <FormControl fullWidth error={!!errors.pupilId}>
              <InputLabel>{isLoading ? "Loading pupil.." : "Choose pupil"}</InputLabel>
              <Select
                value={selectedPupilId}
                label={isLoading ? "Loading pupil.." : "Choose pupil"}
                onChange={(e) => setSelectedPupilId(e.target.value)}
              >
                {pupils.map((pupil) => (
                  <MenuItem key={pupil.pupilId} value={pupil.pupilId}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                      <Typography fontWeight="bold">{pupil.pupilId}</Typography>
                      <Typography>
                        {pupil.lastName} {pupil.firstName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
                        {pupil.gradeName}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.pupilId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.pupilId}
                </Typography>
              )}
            </FormControl>

            {/* Selected Pupil Info */}
            {selectedPupil && (
              <Paper sx={{ p: 2, mt: 2, bgcolor: "white" }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Selected Pupil Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 6}}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedPupil.lastName} {selectedPupil.firstName}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 6}}>
                    <Typography variant="body2">
                      <strong>Birth Date:</strong> {selectedPupil.birthDate}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 6}}>
                    <Typography variant="body2">
                      <strong>Gender:</strong> {selectedPupil.gender === "M" ? "Male" : "Female"}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 6}}>
                    <Typography variant="body2">
                      <strong>Class:</strong> {selectedPupil.gradeName}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Paper>

          {/* Disease Name */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "warning.50" }}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Disease Name"
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.target.value)}
                error={!!errors.diseaseName}
                helperText={errors.diseaseName}
                placeholder="e.g., Common cold with cough"
              />
            </Box>
          </Paper>

          {/* Date Selection */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "info.50" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CalendarToday color="info" />
              <Typography variant="h6" textTransform={'uppercase'} fontWeight="bold" color="info.main">
                Treatment Period
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, md: 6}}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getCurrentDate() }}
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 6}}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: startDate || getCurrentDate() }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Notes */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "warning.50" }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" textTransform={'uppercase'} display={'flex'} alignItems={'center'} gap={'10px'} fontWeight="bold" sx={{ mb: 2, color: "#757575" }}>
                <Note />
                <span>notes for school nurse</span>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description Notes"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                error={!!errors.note}
                helperText={errors.note}
                placeholder="Please provide detailed instructions for the school nurse..."
              />
            </Box>
          </Paper>

          {/* Medication List */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "warning.50" }}>
            <Typography variant="h6" textTransform={'uppercase'} display={'flex'} alignItems={'center'} gap={'10px'} fontWeight="bold" sx={{ mb: 2, color: "warning.main" }}>
              <MedicationIcon />
              <span>Medication List</span>
            </Typography>

            {medicationItems.map((medication, index) => (
              <Paper key={index} sx={{ p: 3, mb: 2, bgcolor: "white" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                    Medication {index + 1}
                  </Typography>
                  {medicationItems.length > 1 && (
                    <IconButton onClick={() => handleRemoveMedication(index)} color="error" size="small">
                      <Delete />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12, md: 6}}>
                    <TextField
                      fullWidth
                      label="Medication Name"
                      value={medication.medicationName}
                      onChange={(e) => handleMedicationChange(index, "medicationName", e.target.value)}
                      error={!!errors[`medication_${index}_name`]}
                      helperText={errors[`medication_${index}_name`]}
                      placeholder="e.g., Dextromethorphan"
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, md: 6}}>
                    <TextField
                      fullWidth
                      label="Unit and Usage"
                      value={medication.unitAndUsage}
                      onChange={(e) => handleMedicationChange(index, "unitAndUsage", e.target.value)}
                      error={!!errors[`medication_${index}_usage`]}
                      helperText={errors[`medication_${index}_usage`]}
                      placeholder="e.g., 1 capsule taken by mouth"
                    />
                  </Grid>
                  <Grid item size={{ xs: 12}}>
                    <FormControl error={!!errors[`medication_${index}_schedule`]}>
                      <FormLabel component="legend">Medication Schedule</FormLabel>
                      <RadioGroup
                        value={medication.medicationSchedule}
                        onChange={(e) => handleMedicationChange(index, "medicationSchedule", e.target.value)}
                        row
                      >
                        {scheduleOptions.map((option) => (
                          <FormControlLabel
                            key={option}
                            value={option}
                            control={<Radio />}
                            label={option}
                            sx={{ mr: 3 }}
                          />
                        ))}
                      </RadioGroup>
                      {errors[`medication_${index}_schedule`] && (
                        <Typography variant="caption" color="error">
                          {errors[`medication_${index}_schedule`]}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Button variant="outlined" startIcon={<Add />} onClick={handleAddMedication} sx={{ mt: 1 }}>
              Add Medication
            </Button>
          </Paper>

          {/* Prescription Image */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "success.50" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <AttachFile color="success" />
              <Typography variant="h6" textTransform={'uppercase'} fontWeight="bold" color="success.main">
                Prescription Image
              </Typography>
            </Box>
            <Button variant="outlined" startIcon={<AttachFile />} onClick={handleImageAttach} color="success">
              Attach Prescription Image
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please attach a clear photo of the prescription from your doctor
            </Typography>
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* Confirmation */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} color="primary" />
              }
              label={<Typography variant="body2">I have read, understood and agreed to the above terms.</Typography>}
            />
          </Box>

          {/* Submit Button */}
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Send />}
              onClick={handleSendPrescription}
              disabled={!isConfirmed}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              Send Prescription
            </Button>
          </Box>

          {!isConfirmed && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Please confirm that you have read and agreed to the terms before sending the prescription.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default PrescriptionSendingForm
