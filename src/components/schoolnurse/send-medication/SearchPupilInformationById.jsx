"use client"

import { useState, useEffect } from "react"
import {
  TextField,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Divider,
  Box,
  Grid,
  CircularProgress,
  Container,
} from "@mui/material"
import { Search, Person, People, CalendarToday, Phone, Email, School } from "@mui/icons-material"

const pupilInfo = {
  pupilId: "PP0001",
  lastName: "Nguyen",
  firstName: "An",
  birthDate: "14-05-2012",
  gender: "M",
  gradeId: 1,
  startYear: 2023,
  gradeLevel: "GRADE_1",
  gradeName: "Lớp 1A",
  parents: [
    {
      userId: "PR0001",
      lastName: "Minh",
      firstName: "Tri",
      email: "quachtri865@gmail.com",
      phoneNumber: 8326699907,
      role: "PARENT",
    },
  ],
}

const SearchPupilInformationById = () => {
  const [searchValue, setSearchValue] = useState("")
  const [pupilData, setPupilData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Debounced search effect
  useEffect(() => {
    if (!searchValue.trim()) {
      setPupilData(null)
      return
    }

    setIsLoading(true)
    const timeoutId = setTimeout(() => {
      // Simulate API call - for now just return the fake data if search matches
      if (
        searchValue.toLowerCase().includes("pp0001") ||
        searchValue.toLowerCase().includes("nguyen") ||
        searchValue.toLowerCase().includes("an")
      ) {
        setPupilData(pupilInfo)
      } else {
        setPupilData(null)
      }
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchValue])

  const formatPhoneNumber = (phone) => {
    const phoneStr = phone.toString()
    return phoneStr.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: "bold", color: "text.primary" }}>
          Pupil Searching
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search Pupil Information by ID
        </Typography>
      </Box>

      {/* Search Input */}
      <Box sx={{ position: "relative", mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter Pupil ID, Name, or other information..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: "text.secondary", mr: 1 }} />,
            sx: { height: 56, fontSize: "1.125rem" },
          }}
        />
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
            <CircularProgress size={20} />
            <Typography color="text.secondary">Searching...</Typography>
          </Box>
        </Box>
      )}

      {/* Pupil Information Display */}
      {pupilData && !isLoading && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Pupil Basic Information */}
          <Card elevation={2}>
            <CardHeader
              avatar={<Person sx={{ color: "primary.main" }} />}
              title={
                <Typography variant="h5" component="h3">
                  Pupil Information
                </Typography>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item size={{xs: 12}}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Full Name: {pupilData.firstName} {pupilData.lastName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item size={{xs: 12}}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Gender: {pupilData.gender === "M" ? "Male" : "Female"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item size={{xs: 12}}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Birth Date: {pupilData.birthDate || "No Information"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item size={{xs: 12}}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Class: {pupilData.gradeName || "1A"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Parent Information */}
          <Card elevation={2}>
            <CardHeader
              avatar={<People sx={{ color: "success.main" }} />}
              title={
                <Typography variant="h5" component="h3">
                  Parent Information
                </Typography>
              }
            />
            <CardContent>
              {pupilData.parents.map((parent, index) => {

                if (index > 0) {
                  return null // Skip rendering if it's not the first parent
                }

                return (
                  <Box key={parent.userId}>
                    {index > 0 && <Divider sx={{ my: 3 }} />}
                    <Grid container spacing={3}>
                      <Grid item size={{xs: 12}}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Full Name: {parent.firstName} {parent.lastName}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item size={{xs: 12}}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Email: {parent.email || "No Information"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Phone Number: {"0" + parent.phoneNumber || "No Information"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* No Results */}
      {searchValue && !pupilData && !isLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Person sx={{ fontSize: 48, color: "text.disabled" }} />
            <Typography color="text.secondary" fontSize={'17px'}>No pupil found matching your search criteria</Typography>
          </Box>
        </Box>
      )}
    </Container>
  )
}

export default SearchPupilInformationById
