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
  LinearProgress,
  CircularProgress,
} from "@mui/material"
import { LocalPharmacy, Person, CalendarToday, Note, Add, Delete, AttachFile, Send, MedicationLiquid as MedicationIcon, CloudUpload, Image as ImageIcon } from "@mui/icons-material"

import usePupils from "@hooks/parent/usePupils"
import useUploadImage from "@hooks/magic-hooks/useUploadImage"

const PrescriptionSendingForm = () => {

  const { pupils, isLoading } = usePupils();
  const {
    selectedFile,
    preview,
    uploading,
    uploadProgress,
    imageUrl,
    error: uploadError,
    fileInputRef,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleUpload,
    handleReset
  } = useUploadImage();

  // Form state
  const [selectedPupilId, setSelectedPupilId] = useState("")
  const [diseaseName, setDiseaseName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [note, setNote] = useState("")
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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

  // Image upload logic: Handle file selection from file input dialog
  const handleImageAttach = () => {
    fileInputRef.current?.click();
  }

  // Image upload logic: Enhanced form submission with automatic image upload
  const handleSendPrescription = async () => {
    if (!validateForm()) {
      return
    }

    setSubmitting(true);

    try {
      let finalImageUrl = imageUrl;

      // Image upload logic: If user selected an image but hasn't uploaded it yet, upload it first
      if (selectedFile && !imageUrl) {
        // Image upload logic: Upload the image and wait for completion
        await new Promise((resolve, reject) => {
          handleUpload();
          
          // Image upload logic: Wait for upload to complete by checking the uploading state
          const checkUpload = setInterval(() => {
            if (!uploading && imageUrl) {
              finalImageUrl = imageUrl;
              clearInterval(checkUpload);
              resolve();
            } else if (!uploading && uploadError) {
              clearInterval(checkUpload);
              reject(new Error(uploadError));
            }
          }, 100);
        });
      }

      // Image upload logic: Create form data with either uploaded image URL or fallback
      const formData = {
        pupilId: selectedPupilId,
        diseaseName: diseaseName.trim(),
        startDate,
        endDate,
        prescriptionImage: finalImageUrl || "https://anh.24h.com.vn/upload/4-2014/images/2014-10-24/1414124020-toa-thuoc.jpg",
        note: note.trim(),
        medicationItems: medicationItems.map((item) => ({
          medicationName: item.medicationName.trim(),
          unitAndUsage: item.unitAndUsage.trim(),
          medicationSchedule: item.medicationSchedule,
        })),
      }

      console.log("Prescription data to be sent:", JSON.stringify(formData, null, 2))
      // Here you would typically send the data to your server
      
      // Show success message
      alert("Prescription sent successfully!");
      
    } catch (error) {
      console.error("Error sending prescription:", error);
      alert("Failed to send prescription. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

            {/* Image upload logic: Traditional button for file attachment */}
            {/* <Button 
              variant="outlined" 
              startIcon={<AttachFile />} 
              onClick={handleImageAttach} 
              color="success"
              sx={{ mb: 2 }}
            >
              Attach Prescription Image
            </Button> */}

            {/* Image upload logic: Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {/* Image upload logic: Drag and drop upload area */}
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                border: '2px dashed',
                borderColor: selectedFile ? 'success.main' : 'grey.300',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: selectedFile ? 'success.50' : 'grey.50',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'success.main',
                  bgcolor: 'success.50'
                }
              }}
              onClick={handleImageAttach}
            >
              {preview ? (
                <Box>
                  {/* Image upload logic: Show preview of selected image */}
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {selectedFile?.name}
                  </Typography>
                  {/* Image upload logic: Button to remove selected image */}
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
              ) : (
                <Box>
                  {/* Image upload logic: Default drag and drop UI */}
                  <CloudUpload sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Drop image here or click to browse
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supports: JPG, PNG, GIF (Max 10MB)
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Image upload logic: Show upload progress when uploading */}
            {uploading && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">Uploading... {uploadProgress}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}

            {/* Image upload logic: Show success message when upload completes */}
            {imageUrl && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ImageIcon />
                  <Typography variant="body2">
                    Image uploaded successfully! Ready to submit.
                  </Typography>
                </Box>
              </Alert>
            )}

            {/* Image upload logic: Show error message if upload fails */}
            {uploadError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Upload Error: {uploadError}
              </Alert>
            )}

            {/* Image upload logic: Manual upload button for immediate upload */}
            {/* {selectedFile && !imageUrl && !uploading && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CloudUpload />}
                  onClick={handleUpload}
                  fullWidth
                >
                  Upload Image Now
                </Button>
              </Box>
            )} */}

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Please attach a clear photo of the prescription from your doctor. 
              The image will be uploaded automatically when you submit the form.
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
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={handleSendPrescription}
              disabled={!isConfirmed || submitting || uploading}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              {submitting ? "Sending..." : uploading ? "Uploading..." : "Send Prescription"}
            </Button>
          </Box>

          {(!isConfirmed || uploading) && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {!isConfirmed && "Please confirm that you have read and agreed to the terms before sending the prescription."}
              {uploading && "Please wait for image upload to complete before submitting."}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default PrescriptionSendingForm
