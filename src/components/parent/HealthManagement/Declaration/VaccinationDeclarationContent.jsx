import { useState, useEffect } from "react"
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
  Paper,
  Avatar,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Vaccines, Person, Add, Delete, LocalHospital, CalendarToday, Note, Send } from "@mui/icons-material"

import usePupils from "@hooks/parent/usePupils";
import useAllDiseasesVaccines from "@hooks/parent/vaccination/useAllDiseasesVaccines"
import useCreateBulkVaccinationHistoryForEachPupil from "@hooks/parent/vaccination/useCreateBulkVaccinationHisotyForEachPupil";
import { showErrorToast, showSuccessToast } from "@utils/toast-utils";

// help format date from "yyyy-mm-dd" to "dd-mm-yyyy" for submission
const formatDateForSubmission = (dateString) => {
  if (!dateString) return null
  // dateString is in format "yyyy-mm-dd" from date input
  const [year, month, day] = dateString.split('-')
  return `${day}-${month}-${year}` // Convert to "dd-mm-yyyy"
}

const VaccinationDeclarationFormContent = () => {

  const { pupils, isLoading: loadingPupils } = usePupils();
  const { diseaseVaccineMap, loading: diseasesVaccinesLoading, error: diseasesVaccinesError, refetch: diseasesVaccinesRefetch } = useAllDiseasesVaccines();
  const { createBulkVaccinationHistory, loading: createLoading, errror: createError } = useCreateBulkVaccinationHistoryForEachPupil();

  const [selectedPupilId, setSelectedPupilId] = useState("")
  const [diseases, setDiseases] = useState([
    {
      id: 1,
      selectedDiseaseId: "",
      selectedVaccineId: "",
      doses: [{ vaccinatedAt: "", notes: "" }],
    },
  ])

  const getCurrentDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const getOrdinalNumber = (num) => {
    const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"]
    return ordinals[num - 1] || `${num}th`
  }

  const getSelectedDisease = (diseaseId) => {
    return diseaseVaccineMap?.GetVaccineByDisease?.find((disease) => disease.diseaseId === diseaseId)
  }

  const getAvailableVaccines = (diseaseId) => {
    const disease = getSelectedDisease(diseaseId)
    return disease ? disease.vaccines : []
  }

  const getMaxDoses = (diseaseId) => {
    const disease = getSelectedDisease(diseaseId)
    return disease ? disease.doseQuantity : 3
  }

  const handlePupilChange = (event) => {
    setSelectedPupilId(event.target.value)
  }

  const handleDiseaseChange = (diseaseIndex, diseaseId) => {
    const updatedDiseases = [...diseases]
    updatedDiseases[diseaseIndex].selectedDiseaseId = diseaseId
    updatedDiseases[diseaseIndex].selectedVaccineId = "" // Reset vaccine selection
    setDiseases(updatedDiseases)
  }

  const handleVaccineChange = (diseaseIndex, vaccineId) => {
    const updatedDiseases = [...diseases]
    updatedDiseases[diseaseIndex].selectedVaccineId = vaccineId
    setDiseases(updatedDiseases)
  }

  const handleDoseChange = (diseaseIndex, doseIndex, field, value) => {
    const updatedDiseases = [...diseases]
    updatedDiseases[diseaseIndex].doses[doseIndex][field] = value
    setDiseases(updatedDiseases)
  }

  const addDoseInformation = (diseaseIndex) => {
    const updatedDiseases = [...diseases]
    const maxDoses = getMaxDoses(updatedDiseases[diseaseIndex].selectedDiseaseId)

    if (updatedDiseases[diseaseIndex].doses.length < maxDoses) {
      updatedDiseases[diseaseIndex].doses.push({ vaccinatedAt: "", notes: "" })
      setDiseases(updatedDiseases)
    }
  }

  const removeDoseInformation = (diseaseIndex, doseIndex) => {
    const updatedDiseases = [...diseases]
    if (updatedDiseases[diseaseIndex].doses.length > 1) {
      updatedDiseases[diseaseIndex].doses.splice(doseIndex, 1)
      setDiseases(updatedDiseases)
    }
  }

  const addDisease = () => {
    const newDisease = {
      id: diseases.length + 1,
      selectedDiseaseId: "",
      selectedVaccineId: "",
      doses: [{ vaccinatedAt: "", notes: "" }],
    }
    setDiseases([...diseases, newDisease])
  }

  const removeDisease = (diseaseIndex) => {
    if (diseases.length > 1) {
      const updatedDiseases = diseases.filter((_, index) => index !== diseaseIndex)
      setDiseases(updatedDiseases)
    }
  }

  const resetForm = () => {
    setSelectedPupilId("")
    setDiseases([
      {
        id: 1,
        selectedDiseaseId: "",
        selectedVaccineId: "",
        doses: [{ vaccinatedAt: "", notes: "" }],
      },
    ])
  }

  const validateForm = () => {
    // Check if a child is selected
    if (!selectedPupilId) {
      showErrorToast("Please select a child before submitting the form.")
      return false
    }

    // Check if at least one disease is selected (vaccine and dose info are optional)
    const validDiseases = diseases.filter((disease) =>
      disease.selectedDiseaseId
    )

    if (validDiseases.length === 0) {
      showErrorToast("Please select at least one disease before submitting.")
      return false
    }

    return true
  }

  const handleDeclareVaccine = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return
    }

    // Prepare form data
    const formData = {
      pupilId: selectedPupilId,
      vaccinationHistories: diseases
        .filter((disease) => disease.selectedDiseaseId && disease.selectedVaccineId)
        .map((disease) => ({
          vaccineId: disease.selectedVaccineId,
          diseaseId: disease.selectedDiseaseId,
          doses: disease.doses
            .filter((dose) => dose.vaccinatedAt && dose.notes)
            .map((dose, index) => ({
              vaccinatedAt: formatDateForSubmission(dose.vaccinatedAt),
              notes: dose.notes,
              doseNumber: index + 1,
            })),
        })),
    }

    // debug:
    console.log("Form Data to be submitted:", JSON.stringify(formData, null, 2))

    if (!formData) {
      showErrorToast("Something went wrong, please try again later.")
      return
    }

    // Submit the form
    await createBulkVaccinationHistory(formData);
    if (!createError) {
      showSuccessToast("Vaccination history created successfully! Please check at vaccination history page.")
      // Reset the form after successful submission
      resetForm()
    } else {
      showErrorToast("Failed to create vaccination history. Please try again later.")
    }
  }

  const selectedPupil = pupils?.find((pupil) => pupil.pupilId === selectedPupilId)

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
          <Vaccines />
        </Avatar>
        <Typography variant="h4" fontWeight="bold">
          Vaccination Declaration Form
        </Typography>
      </Box>

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {/* Pupil Selection */}
          <Paper sx={{ p: 3, mb: 4, bgcolor: "primary.50", boxShadow: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Person color="primary" />
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Select Child
              </Typography>
            </Box>
            <FormControl fullWidth>
              <InputLabel>Choose your child</InputLabel>
              <Select value={selectedPupilId} label="Choose your child" onChange={handlePupilChange}>
                {pupils?.map((pupil) => (
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
            </FormControl>

            {/* Selected Pupil Info */}
            {selectedPupil && (
              <Paper sx={{ p: 2, mt: 2, bgcolor: "white" }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Selected Child Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedPupil.lastName} {selectedPupil.firstName}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Birth Date:</strong> {selectedPupil.birthDate}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Gender:</strong> {selectedPupil.gender === "M" ? "Male" : "Female"}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2">
                      <strong>Class:</strong> {selectedPupil.gradeName}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Paper>

          {/* Disease Declarations */}
          {diseases.map((disease, diseaseIndex) => (
            <Paper key={disease.id} sx={{ p: 3, mb: 3, bgcolor: "success.50", boxShadow: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocalHospital color="success" />
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {getOrdinalNumber(diseaseIndex + 1)} Disease
                  </Typography>
                </Box>
                {diseases.length > 1 && (
                  <IconButton onClick={() => removeDisease(diseaseIndex)} color="error" size="small">
                    <Delete />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={3}>
                {/* Disease Selection */}
                <Grid item size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Disease</InputLabel>
                    <Select
                      value={disease.selectedDiseaseId}
                      label="Select Disease"
                      onChange={(e) => handleDiseaseChange(diseaseIndex, e.target.value)}
                    >
                      {diseaseVaccineMap?.GetVaccineByDisease?.map((diseaseOption) => (
                        <MenuItem key={diseaseOption.diseaseId} value={diseaseOption.diseaseId}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Typography fontWeight="bold">{diseaseOption.diseaseName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              - Max {diseaseOption.doseQuantity} dose(s)
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Vaccine Selection */}
                <Grid item size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth disabled={!disease.selectedDiseaseId}>
                    <InputLabel>Select Vaccine</InputLabel>
                    <Select
                      value={disease.selectedVaccineId}
                      label="Select Vaccine"
                      onChange={(e) => handleVaccineChange(diseaseIndex, e.target.value)}
                    >
                      {getAvailableVaccines(disease.selectedDiseaseId).map((vaccine) => (
                        <MenuItem key={vaccine.vaccineId} value={vaccine.vaccineId}>
                          {vaccine.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {disease.selectedDiseaseId && getAvailableVaccines(disease.selectedDiseaseId).length === 0 && (
                      <Alert severity="info" sx={{ mt: 1 }}>
                        No vaccines available for this disease
                      </Alert>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              {/* Dose Information */}
              {disease.selectedDiseaseId && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                    Dose Information
                  </Typography>
                  {disease.doses.map((dose, doseIndex) => (
                    <Paper key={doseIndex} sx={{ p: 2, mb: 2, bgcolor: "white" }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                          DOSE {doseIndex + 1}
                        </Typography>
                        {disease.doses.length > 1 && (
                          <IconButton
                            onClick={() => removeDoseInformation(diseaseIndex, doseIndex)}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                      <Grid container spacing={2} display="flex" flexDirection={'column'}>
                        <Grid item size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Vaccination Date"
                            type="date"
                            value={dose.vaccinatedAt}
                            onChange={(e) => handleDoseChange(diseaseIndex, doseIndex, "vaccinatedAt", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ max: getCurrentDate() }}
                            InputProps={{
                              startAdornment: <CalendarToday color="action" sx={{ mr: 1 }} />,
                            }}
                          />
                        </Grid>
                        <Grid item size={{ xs: 12 }} width={"100%"}>
                          <TextField
                            fullWidth
                            label="Notes"
                            multiline
                            rows={2}
                            value={dose.notes}
                            onChange={(e) => handleDoseChange(diseaseIndex, doseIndex, "notes", e.target.value)}
                            placeholder="e.g., Vaccinated at Hospital A, no side effects"
                            InputProps={{
                              startAdornment: <Note color="action" sx={{ mr: 1, alignSelf: "flex-start", mt: 0.2 }} />,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}

                  {/* Add Dose Button */}
                  {disease.doses.length < getMaxDoses(disease.selectedDiseaseId) && (
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => addDoseInformation(diseaseIndex)}
                      sx={{ mt: 1 }}
                    >
                      Add Dose Information
                    </Button>
                  )}
                </Box>
              )}
            </Paper>
          ))}

          {/* Add Disease Button */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Button variant="outlined" startIcon={<Add />} onClick={addDisease} size="large">
              Add Another Disease
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Submit Button */}
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={createLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={handleDeclareVaccine}
              disabled={!selectedPupilId || createLoading}
              sx={{
                p: 2,
                fontSize: "18px",
                fontWeight: "bold",
                minWidth: 200,
              }}
            >
              {createLoading ? "Declaring..." : "Declare Vaccination"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default VaccinationDeclarationFormContent