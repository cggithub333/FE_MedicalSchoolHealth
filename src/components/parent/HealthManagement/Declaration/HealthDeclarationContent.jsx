import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
  Box,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import { useState, useEffect } from "react"
import Person from "@mui/icons-material/Person"
import usePupils from "@hooks/parent/usePupils";
import { useCreateNewHealthRecords } from "@hooks/parent/new-event/useCreateNewHealthRecords"
import { showSuccessToast, showErrorToast } from "@utils/toast-utils";

// Styled components
const MainContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  borderRadius: 16,
  backgroundColor: "#ffffff",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
}))

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 12,
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  fontSize: "2rem",
  fontWeight: "bold",
  margin: "0 auto 16px auto",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
}))

const PupilInfo = styled(Box)({
  textAlign: "center",
  flexGrow: 1,
})

const PupilId = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  marginTop: 8,
  backgroundColor: "rgba(25, 118, 210, 0.1)",
  padding: "4px 12px",
  borderRadius: 12,
  display: "inline-block",
  fontSize: "0.875rem",
}))

const GradeName = styled(Typography)(({ theme }) => ({
  color: "#ffffff",
  fontWeight: 600,
  marginTop: 8,
  backgroundColor: theme.palette.primary.main,
  padding: "6px 16px",
  borderRadius: 20,
  display: "inline-block",
}))


const HealthDeclarationContent = () => {
  // Function to generate avatar initials
  const getAvatarInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // Function to get avatar color based on gender
  const getAvatarColor = (gender) => {
    return gender === "M" ? "#1976d2" : "#e91e63"
  }

  const handleViewDetails = (pupilId) => {
    console.log(`View details for pupil: ${pupilId}`)
    // Add your logic here
  }

  const { pupils, isLoading: pupilsLoading } = usePupils();
  const { createNewHealthRecords, isLoading: createLoading, error: createError } = useCreateNewHealthRecords();

  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    reactionOrNote: "",
    imageUrl: "",
    typeHistory: "",
    pupilId: localStorage.getItem("selectedPupilId") || "",
    isActive: true,
  })
  const [selectedPupilId, setSelectedPupilId] = useState(form.pupilId || "")
  const selectedPupil = pupils.find((p) => p.pupilId === selectedPupilId)

  // Get selected pupilId from localStorage (set by VaccinationDeclarationContent)
  useEffect(() => {
    const selectedPupilId = localStorage.getItem("selectedPupilId")
    if (selectedPupilId) {
      setForm((prev) => ({ ...prev, pupilId: selectedPupilId }))
    }
  }, [dialogOpen])

  const handleDialogOpen = () => setDialogOpen(true)
  const handleDialogClose = () => setDialogOpen(false)

  const handlePupilChange = (event) => {
    setSelectedPupilId(event.target.value)
    setForm((prev) => ({ ...prev, pupilId: event.target.value }))
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNewHealthRecords(form);
      showSuccessToast("Health declaration submitted successfully!");
      handleDialogClose();
    } catch (err) {
      showErrorToast("Failed to create health record. Please try again.");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Container maxWidth="lg">
        <MainContainer elevation={3}>
          {/* title */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              textAlign: "center",
              mb: 4,
              fontWeight: "bold",
              color: "primary.main",
              fontSize: { xs: "1.75rem", md: "2.125rem" },
            }}
          >
            Health Declaration for Pupils
          </Typography>
          {/* Request Body */}
          <CardActions sx={{ p: 2, pt: 0, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={handleDialogOpen}
              sx={{
                minWidth: 140,
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 5,
                padding: "8px 24px",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                  transform: "translateY(-2px)",
                },
                position: "realative",
                left: 300,
              }}
            >
              New Health Declaration
            </Button>
            {/* New Health Records Form */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
              <DialogTitle>New Health Declaration</DialogTitle>
              <form onSubmit={handleSubmit}>
                <DialogContent>
                  <Paper sx={{ p: 3, mb: 4, bgcolor: "primary.50", boxShadow: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <Person color="primary" />
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        Select Child
                      </Typography>
                    </Box>
                    <FormControl fullWidth>
                      <InputLabel>Choose your child</InputLabel>
                      <Select
                        value={selectedPupilId}
                        label="Choose your child"
                        onChange={handlePupilChange}
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
                    </FormControl>
                    {selectedPupil && (
                      <Paper sx={{ p: 2, mt: 2, bgcolor: "white" }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Selected Child Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={3}>
                            <Typography variant="body2">
                              <strong>Name:</strong> {selectedPupil.lastName}{" "}
                              {selectedPupil.firstName}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="body2">
                              <strong>Birth Date:</strong> {selectedPupil.birthDate}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="body2">
                              <strong>Gender:</strong> {selectedPupil.gender === "M" ? "Male" : "Female"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="body2">
                              <strong>Class:</strong> {selectedPupil.gradeName}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    )}
                  </Paper>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Description"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Reaction or Note"
                    name="reactionOrNote"
                    value={form.reactionOrNote}
                    onChange={handleFormChange}
                    required
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Image URL"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleFormChange}
                  />
                  <TextField
                    select
                    fullWidth
                    margin="normal"
                    label="Type History"
                    name="typeHistory"
                    value={form.typeHistory}
                    onChange={handleFormChange}
                    required
                  >
                    <MenuItem value="ALLERGY">ALLERGY</MenuItem>
                    <MenuItem value="MEDICAL_HISTORY">MEDICAL_HISTORY</MenuItem>
                  </TextField>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDialogClose}>Cancel</Button>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </form>
            </Dialog>

          </CardActions>

          <Grid container spacing={3}>
            {pupils.map((pupil) => (
              <Grid item size={6} sm={6} key={pupil.pupilId}>
                <StyledCard>
                  <CardContent sx={{ p: 3 }}>
                    <PupilInfo>
                      <StyledAvatar
                        sx={{
                          backgroundColor: getAvatarColor(pupil.gender),
                        }}
                      >
                        {getAvatarInitials(pupil.firstName, pupil.lastName)}
                      </StyledAvatar>

                      <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{
                          fontWeight: "bold",
                          color: "#2d3748",
                          fontSize: { xs: "1.25rem", md: "1.5rem" },
                        }}
                      >
                        {`${pupil.firstName} ${pupil.lastName}`}
                      </Typography>

                      <GradeName variant="body1" component="div">
                        {pupil.gradeName}
                      </GradeName>

                      <Box sx={{ mt: 2 }}>
                        <PupilId variant="body2" component="div">
                          ID: {pupil.pupilId}
                        </PupilId>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        <strong>Birth Date:</strong> {pupil.birthDate}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        <strong>Gender:</strong> {pupil.gender === "M" ? "Male" : "Female"}
                      </Typography>
                    </PupilInfo>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      onClick={() => handleViewDetails(pupil.pupilId)}
                      sx={{
                        minWidth: 140,
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: 25,
                        padding: "8px 24px",
                        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                        "&:hover": {
                          boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </MainContainer>
      </Container>
    </Box>
  )
}

export default HealthDeclarationContent
