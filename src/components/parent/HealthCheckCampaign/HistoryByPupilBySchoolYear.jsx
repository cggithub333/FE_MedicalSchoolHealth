"use client"

import usePupils from "@hooks/parent/usePupils";
import useHealthCheckHistoryByPupilIdSchoolYear from "@hooks/parent/health-check/useHealthCheckHistoryByPupilId-SchoolYear";
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Chip,
  Divider,
  Alert,
  Skeleton,
  Grid,
  Box,
  Container,
  Paper,
} from "@mui/material"
import { Search, Person, CalendarToday, Favorite, Visibility, LocalHospital, Warning } from "@mui/icons-material"


const HistoryByPupilBySchoolYear = () => {
  const { pupils } = usePupils()
  const [selectedPupilId, setSelectedPupilId] = useState(localStorage.getItem("pupilId") || "")      // Default to empty string if no pupilId in localStorage
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(new Date().getFullYear().toString()); // Default to current year
  const [ anySelected, setAnySelected ] = useState(false);

  // debug:
  // console.log("Selected Pupil ID:", selectedPupilId);
  // console.log("Selected School Year:", selectedSchoolYear);
  
  const { fetchHealthCheckHistory, historyRecords, isLoading, error } = useHealthCheckHistoryByPupilIdSchoolYear(
    selectedPupilId,
    selectedSchoolYear,
  )

  // debug:
  // console.log("HistoryByPupilBySchoolYear :", historyRecords);
  // console.log("HistoryByPupilBySchoolYear :", typeof historyRecords);

  // Initial fetch
  useEffect(() => {
    if (selectedPupilId && selectedSchoolYear) {
      fetchHealthCheckHistory(selectedPupilId, selectedSchoolYear)
    }
  }, [])

  const handleSearch = () => {
    // only active when both fields are selected
    if (selectedPupilId && selectedSchoolYear) {
      fetchHealthCheckHistory(selectedPupilId, selectedSchoolYear)
    }
  }

  const selectedPupil = pupils.find((pupil) => pupil.pupilId === selectedPupilId)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const renderHealthMetrics = () => {
    if (!historyRecords || historyRecords[0] == null || historyRecords.length == 0) 
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          No health check records found for the selected pupil and school year.
        </Alert>
      );

    // debug:
    console.log("History Records:", historyRecords);

    // const properties:
    const height = `${historyRecords[0].height} cm` || "No Information";
    const weight = historyRecords[0].weight ? `${historyRecords[0].weight} kg` : "No Information";
    const rightEyeVision = historyRecords[0].rightEyeVision || "No Information";
    const leftEyeVision = historyRecords[0].leftEyeVision || "No Information";
    const bloodPressure = historyRecords[0].bloodPressure ? `${historyRecords[0].bloodPressure} mmHg` : "No Information";
    const heartRate = historyRecords[0].heartRate ? `${historyRecords[0].heartRate} bpm` : "No Information";

    const metrics = [
      { label: "Height", value: height, icon: <Person /> },
      { label: "Weight", value: weight, icon: <Person /> },
      { label: "Right Eye Vision", value: rightEyeVision, icon: <Visibility /> },
      { label: "Left Eye Vision", value: leftEyeVision, icon: <Visibility /> },
      { label: "Blood Pressure", value: bloodPressure, icon: <Favorite /> }, 
    ]

    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {metrics.map((metric, index) => (
          <Grid item size={{ xs: 12, md: 6, lg: 4 }} key={index}>
            <Card sx={{ p: 2, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ color: "primary.main" }}>{metric.icon}</Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {metric.label}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {metric.value}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  const renderDetailedExamination = () => {
    if (!historyRecords || historyRecords[0] == null || historyRecords.length == 0) 
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          No detailed examination records found for the selected pupil and school year.
        </Alert>
      );

    // debug:
    console.log("Detailed Examination Records:", historyRecords);

    // take only the first record for detailed examination:
    const historyRecord = historyRecords[0];

    // stored properties's value:
    const dentailCheck = historyRecord.dentalCheck || "No Information";
    const earCondition = historyRecord.earCondition || "No Information";
    const noseCondition = historyRecord.noseCondition || "No Information"; 
    const throatCondition = historyRecord.throatCondition || "No Information";
    const skinAndMucosa = historyRecord.skinAndMucosa || "No Information";
    const hearAnuscultaion = historyRecord.hearAnuscultaion || "No Information";
    const chestShape = historyRecord.chestShape || "No Information";
    const lungs = historyRecord.lungs || "No Information";
    const digestiveSystem = historyRecord.digestiveSystem || "No Information";
    const urinarySystem = historyRecord.urinarySystem || "No Information";
    const musculoskeletalSystem = historyRecord.musculoskeletalSystem || "No Information";
    const neurologyAndPsychiatry = historyRecord.neurologyAndPsychiatry || "No Information";
    const genitalExamination = historyRecord.genitalExamination || "No Information";

    // properties:
    const examinations = [
      { label: "Dental", value: dentailCheck },
      { label: "Ear Condition", value: earCondition },
      { label: "Nose Condition", value: noseCondition },
      { label: "Throat Condition", value: throatCondition },
      { label: "Skin and Mucosa", value: skinAndMucosa },
      { label: "Heart Auscultation", value: hearAnuscultaion },
      { label: "Chest Shape", value: chestShape },
      { label: "Lungs", value: lungs },
      { label: "Digestive System", value: digestiveSystem },
      { label: "Urinary System", value: urinarySystem },
      { label: "Musculoskeletal System", value: musculoskeletalSystem },
      { label: "Neurology and Psychiatry", value: neurologyAndPsychiatry },
      { label: "Genital Examination", value: genitalExamination },
    ]

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {examinations.map((exam, index) => (
          <Box key={index}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              {exam.label}
            </Typography>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="body2">{exam.value}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3}}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <LocalHospital color="primary" />
        <Typography variant="h4" fontWeight="bold">
          Health Check History
        </Typography>
      </Box>

      {/* Advanced Search */}
      <Card sx={{ mb: 3 }}>
        <CardHeader>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Search color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Advanced Search
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Select a student and school year to view health check history
          </Typography>
        </CardHeader>
        <CardContent>
          <Grid container spacing={2} alignItems="center" gap="40px">
            <Grid item size={{ xs: 3, md: 3}}>
              <FormControl fullWidth>
                <InputLabel>Child</InputLabel>
                <Select value={selectedPupilId} label="pupil" onChange={(e) => {
                                                                          setSelectedPupilId(e.target.value);
                                                                          setAnySelected(true);
                                                                        }}>
                  {pupils.map((pupil) => (
                    <MenuItem key={pupil.pupilId} value={pupil.pupilId}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                        <Typography fontWeight="bold">{pupil.pupilId}</Typography>
                        <Typography>-</Typography>
                        <Typography>
                          {pupil.lastName} {pupil.firstName}
                        </Typography>
                        <Chip label={pupil.gradeName} size="small" variant="outlined" sx={{ ml: "auto" }} />
                      </Box>
                    </MenuItem>
                  ))}
                  {pupils.length === 0 && (
                    <MenuItem disabled>
                      <Typography color="text.secondary">--No pupils found--</Typography>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 3, md: 3}}>
              <TextField
                fullWidth
                label="School Year"
                type="number"
                value={selectedSchoolYear}
                onChange={(e) => {
                  setSelectedSchoolYear(Number.parseInt(e.target.value) || 2025);
                  setAnySelected(true);
                }}
                inputProps={{ min: 2020, max: 2030 }}
              />
            </Grid>

            <Grid item size={{ xs: 3, md: 3 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={(e) => {
                  handleSearch();
                  setAnySelected(false);
                }}
                disabled={isLoading}
                startIcon={<Search />}
                sx={{ 
                  py: 1.5 ,
                  fontSize: "1rem",
                  backgroundColor: anySelected ? "#f1fa8c" : "primary.main",
                  color: anySelected ? "black" : "white",
                }}
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Selected Pupil Info */}
      {selectedPupil && (
        <Card sx={{ mb: 3 }}>
          <CardHeader>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Person color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Student Information
              </Typography>
            </Box>
          </CardHeader>
          <CardContent>
            <Grid container spacing={2} display={"flex"} alignItems="center" gap="40px">
              <Grid item size={{ xs: 12, md: 6, lg: 3}}>
                <Typography variant="body2" color="text.secondary">
                  Pupil ID
                </Typography>
                <Typography fontWeight="bold">{selectedPupil.pupilId}</Typography>
              </Grid>
              <Grid item size={{ xs: 12, md: 6, lg: 3}}>
                <Typography variant="body2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography fontWeight="bold">
                  {selectedPupil.lastName} {selectedPupil.firstName}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 12, md: 6, lg: 3}}>
                <Typography variant="body2" color="text.secondary">
                  Birthdate
                </Typography>
                <Typography fontWeight="bold">{selectedPupil.birthDate}</Typography>
              </Grid>
              <Grid item size={{ xs: 12, md: 6, lg: 3}}>
                <Typography variant="body2" color="text.secondary">
                  Class
                </Typography>
                <Chip label={selectedPupil.gradeName} color="primary" variant="outlined" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card sx={{ mb: 3 }}>
          <CardHeader>
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={300} height={24} />
          </CardHeader>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Skeleton variant="rectangular" height={80} />
              <Skeleton variant="rectangular" height={80} />
              <Skeleton variant="rectangular" height={80} />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" icon={<Warning />} sx={{ mb: 3 }}>
          Có lỗi xảy ra khi tải dữ liệu: {error}
        </Alert>
      )}

      {/* Health Check Results */}
      {!isLoading && !error && historyRecords  && historyRecords.length >  0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card>
            <CardHeader>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Kết quả khám sức khỏe
                  </Typography>
                </Box>
                <Chip label={`Năm học ${historyRecords.healthCheckConsentSimpleRes?.schoolYear}`} variant="outlined" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Examination date: {formatDate(historyRecords.createdAt)}
              </Typography>
            </CardHeader>
            <CardContent>
              {/* Health Metrics */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Basic Health Metrics
                </Typography>
                {renderHealthMetrics()}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Detailed Examination */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Detailed Examination
                </Typography>
                {renderDetailedExamination()}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Additional Notes */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Additional Notes
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Typography variant="body2">
                      {historyRecords[0]?.additionalNotes}
                    </Typography>
                  </Paper>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Unusual Signs
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Typography variant="body2">{historyRecords[0]?.unusualSigns}</Typography>
                  </Paper>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {
        !isLoading && !error && historyRecords && historyRecords.length == 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Warning sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                No health check records found
              </Typography>
              <Typography color="text.secondary">
                There are no health check records for pupil {selectedPupilId} in school year {selectedSchoolYear}
              </Typography>
            </CardContent>
          </Card>
        )
      }

      {/* No Data State */}
      {!isLoading && !error && (!historyRecords || historyRecords.length == 0) && selectedPupilId && selectedSchoolYear && (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Warning sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              No history information found
            </Typography>
            <Typography color="text.secondary">
              There is no history information found for pupil {selectedPupilId} in school year {selectedSchoolYear}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default HistoryByPupilBySchoolYear
