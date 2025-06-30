"use client"

import { useState, useMemo } from "react"
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Alert,
  Skeleton,
} from "@mui/material"
import {
  Search,
  Vaccines,
  Person,
  CalendarToday,
  Campaign,
  Note,
  Close,
  FilterList,
  History,
} from "@mui/icons-material"

import useVaccinationHistoryByPupilId from "@hooks/parent/vaccination/useVaccinationHistoryByPupilId";

const VaccinationHistoryDisplayer = ({ pupilObj }) => {

  const { vaccinationHistoryRecords, loading, error, refetch } = useVaccinationHistoryByPupilId(pupilObj.pupilId)

  // Search and filter states
  const [searchDisease, setSearchDisease] = useState("")
  const [searchYear, setSearchYear] = useState("")
  const [selectedSource, setSelectedSource] = useState("ALL")
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Get unique diseases for dropdown
  const uniqueDiseases = useMemo(() => {
    const diseases = vaccinationHistoryRecords.map((record) => record.diseaseName)
    return [...new Set(diseases)]
  }, [vaccinationHistoryRecords])

  // Filter records based on search criteria
  const filteredRecords = useMemo(() => {
    return vaccinationHistoryRecords.filter((record) => {
      const matchesDisease =
        searchDisease === "" || record.diseaseName.toLowerCase().includes(searchDisease.toLowerCase())
      const matchesYear = searchYear === "" || record.vaccinatedAt.includes(searchYear)
      const matchesSource = selectedSource === "ALL" || record.source === selectedSource
      return matchesDisease && matchesYear && matchesSource && record.active
    })
  }, [vaccinationHistoryRecords, searchDisease, searchYear, selectedSource])

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getSourceColor = (source) => {
    return source === "CAMPAIGN" ? "primary" : "secondary"
  }

  const getSourceText = (source) => {
    return source === "CAMPAIGN" ? "Campaign" : "Parent Declaration"
  }

  const handleCardClick = (record) => {
    setSelectedRecord(record)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedRecord(null)
  }

  const handleGetAllForDisease = (diseaseName) => {
    setSearchDisease(diseaseName)
    setSearchYear("")
    setSelectedSource("ALL")
  }

  const clearFilters = () => {
    setSearchDisease("")
    setSearchYear("")
    setSelectedSource("ALL")
  }

  const renderLoadingSkeleton = () => (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={300} height={40} />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item  size={{ xs: 12, md: 3}}  key={index}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {[1, 2, 3].map((index) => (
          <Grid item  size={{ xs: 12, md: 3, lg:4 }}  key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )

  if (loading) {
    return renderLoadingSkeleton()
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">An error occurred while loading vaccination history: {error}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
          <History />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Vaccination History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {pupilObj.lastName} {pupilObj.firstName} - {pupilObj.gradeName}
          </Typography>
        </Box>
      </Box>

      {/* Student Info Card */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
          Student Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item  size={{ xs: 12, md: 3}} >
            <Typography variant="body2" color="text.secondary">
              Student ID
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {pupilObj.pupilId}
            </Typography>
          </Grid>
          <Grid item  size={{ xs: 12, md: 3}} >
            <Typography variant="body2" color="text.secondary">
              Full Name
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {pupilObj.lastName} {pupilObj.firstName}
            </Typography>
          </Grid>
          <Grid item  size={{ xs: 12, md: 3}} >
            <Typography variant="body2" color="text.secondary">
              Date of Birth
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {pupilObj.birthDate}
            </Typography>
          </Grid>
          <Grid item  size={{ xs: 12, md: 3}} >
            <Typography variant="body2" color="text.secondary">
              Class
            </Typography>
            <Chip label={pupilObj.gradeName} color="primary" variant="outlined" />
          </Grid>
        </Grid>
      </Paper>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <FilterList color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Search and Filter
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item  size={{ xs: 12, md: 3}} >
            <TextField
              fullWidth
              label="Search by disease name"
              value={searchDisease}
              onChange={(e) => setSearchDisease(e.target.value)}
              InputProps={{
                startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>

          <Grid item  size={{ xs: 12, md: 2}} >
            <TextField
              fullWidth
              label="Year"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              placeholder="2025, 2024..."
            />
          </Grid>

          <Grid item  size={{ xs: 12, md: 3}} >
            <FormControl fullWidth>
              <InputLabel>Source</InputLabel>
              <Select value={selectedSource} label="Source" onChange={(e) => setSelectedSource(e.target.value)}>
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value="CAMPAIGN">Campaign</MenuItem>
                <MenuItem value="PARENT_DECLARATION">Parent Declaration</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item  size={{ xs: 12, md: 2}} >
            <Button fullWidth variant="outlined" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Grid>

          <Grid item  size={{ xs: 12, md: 2}} >
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
              {filteredRecords.length} results
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Disease Quick Filter */}
      {uniqueDiseases.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Quick filter by disease:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {uniqueDiseases.map((disease) => (
              <Chip
                key={disease}
                label={disease}
                onClick={() => handleGetAllForDisease(disease)}
                variant={searchDisease === disease ? "filled" : "outlined"}
                color="primary"
                clickable
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Vaccination Records */}
      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Vaccines sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              No results found
            </Typography>
            <Typography color="text.secondary">
              No vaccination history matches the search criteria
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredRecords.map((record) => (
            <Grid item  size={{ xs: 12, md: 3, lg: 4 }}  key={record.historyId}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
                onClick={() => handleCardClick(record)}
              >
                <CardContent>
                  {/* Header with source chip */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {record.diseaseName}
                    </Typography>
                    <Chip
                      label={getSourceText(record.source)}
                      color={getSourceColor(record.source)}
                      size="small"
                      variant="filled"
                    />
                  </Box>

                  {/* Student info */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>{record.pupilName}</strong> - {pupilObj.gradeName}
                    </Typography>
                  </Box>

                  {/* Vaccine info */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Vaccines fontSize="small" color="success" />
                    <Typography variant="body2" color="text.secondary">
                      Vaccine: <strong>{record.vaccineName}</strong>
                    </Typography>
                  </Box>

                  {/* Campaign info */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Campaign fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {record.campaignName}
                    </Typography>
                  </Box>

                  {/* Date */}
                  <Box
                    sx={{
                      bgcolor: "grey.100",
                      p: 1,
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight="bold">
                      {formatDate(record.vaccinatedAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Detail Modal */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Vaccines color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Vaccination Details
              </Typography>
            </Box>
            <Button onClick={handleCloseDialog} sx={{ minWidth: "auto", p: 1 }}>
              <Close />
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent>
          {selectedRecord && (
            <Box sx={{ pt: 1 }}>
              {/* Basic Information */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item  size={{ xs: 12, md: 6}} >
                    <Typography variant="body2" color="text.secondary">
                      Disease
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedRecord.diseaseName}
                    </Typography>
                  </Grid>
                  <Grid item  size={{ xs: 12, md: 6}} >
                    <Typography variant="body2" color="text.secondary">
                      Vaccine
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedRecord.vaccineName}
                    </Typography>
                  </Grid>
                  <Grid item  size={{ xs: 12, md: 6}} >
                    <Typography variant="body2" color="text.secondary">
                      Student
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedRecord.pupilName} ({selectedRecord.pupilId})
                    </Typography>
                  </Grid>
                  <Grid item  size={{ xs: 12, md: 6}} >
                    <Typography variant="body2" color="text.secondary">
                      Source
                    </Typography>
                    <Chip
                      label={getSourceText(selectedRecord.source)}
                      color={getSourceColor(selectedRecord.source)}
                      variant="filled"
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Campaign Information */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "success.50" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "success.main" }}>
                  Campaign Information
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedRecord.campaignName}
                </Typography>
              </Paper>

              {/* Vaccination Details */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "info.50" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "info.main" }}>
                  Vaccination Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item  size={{ xs: 12, md: 6}} >
                    <Typography variant="body2" color="text.secondary">
                      Vaccination Date
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatDateTime(selectedRecord.vaccinatedAt)}
                    </Typography>
                  </Grid>
                  <Grid item  size={{ xs: 12, md: 6}} >
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip label={selectedRecord.active ? "Active" : "Inactive"} color="success" />
                  </Grid>
                </Grid>
              </Paper>

              {/* Notes */}
              <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Note color="action" />
                  <Typography variant="h6" fontWeight="bold">
                    Notes
                  </Typography>
                </Box>
                <Typography variant="body1">{selectedRecord.notes || "No notes available"}</Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default VaccinationHistoryDisplayer
