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

import useSearchPupilInforByPupilId from "@hooks/schoolnurse/useSearchPupilInforByPupilId"

const SearchPupilInformationById = () => {
  const [searchValue, setSearchValue] = useState("")
  const [pupilData, setPupilData] = useState(null)

  const { pupilInfo, isLoading: pupilLoading, error, refetch } = useSearchPupilInforByPupilId(searchValue);

  //debug:
  console.log("Search Value:", searchValue);
  console.log("Pupil Info:", pupilInfo);
  console.log("Pupil Loading:", pupilLoading);
  console.log("Error:", error);

  // Debounced search effect
  useEffect(() => {
    // if searchValue is empty, reset pupilData:
    if (!searchValue.trim()) {1
      setPupilData(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      try {
        await refetch(searchValue);
      } catch (error) {
        console.error("Error searching for pupil:", error);
        setPupilData(null)
      }
    }, 300) // send request after 300ms delay for each change

    // Cleanup function to prevent memory leaks
    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchValue, refetch])

  // Separate effect to handle pupilInfo updates
  useEffect(() => {
    if (pupilInfo) {
      console.log("Pupil found:", pupilInfo);
      setPupilData(pupilInfo)
    } else if (searchValue.trim() && !pupilLoading) {
      // Only set to null if we have a search value and not loading
      console.log("No pupil found for:", searchValue);
      setPupilData(null)
    }
  }, [pupilInfo, pupilLoading, searchValue])

  const formatPhoneNumber = (phone) => {
    const phoneStr = phone.toString()
    return phoneStr.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: "70vh", transition: "all 0.3s ease" }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: "bold", color: "text.primary" }}>
          Pupil Searching
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search Pupil Information by ID
        </Typography>
      </Box>

      {/* Search Input */}
      <Box sx={{ position: "relative", mb: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter Pupil ID"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: "text.secondary", mr: 1 }} />,
            sx: { height: 56, fontSize: "1.125rem" },
          }}
        />
      </Box>

      {/* Loading State */}
      <Box 
        sx={{ 
          textAlign: "center", 
          py: 2,
          minHeight: "80px",
          opacity: pupilLoading ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          pointerEvents: pupilLoading ? "auto" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={20} />
          <Typography color="text.secondary">Searching...</Typography>
        </Box>
      </Box>

      {/* Pupil Information Display */}
      {pupilData && !pupilLoading && (
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 3,
            opacity: pupilData ? 1 : 0,
            transition: "all 0.3s ease-in-out",
            transform: pupilData ? "translateY(0)" : "translateY(10px)",
            mt: 1
          }}
        >
          {/* Pupil Basic Information */}
          <Card elevation={2} sx={{
            transition: "all 0.3s ease",
              "&:hover": { 
                boxShadow: 3, 
                transform: "scale(1.03)"
              }, 
            }}>
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
          <Card elevation={2} sx={{
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: 3,
              transform: "scale(1.03)"
            },
          }}>
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

      {/* No Results - Always rendered but with opacity transition to prevent layout jumping */}
      <Box 
        sx={{ 
          textAlign: "center", 
          py: 2,
          minHeight: "80px", // Maintain consistent height but smaller
          opacity: (searchValue && !pupilData && !pupilLoading) ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          pointerEvents: (searchValue && !pupilData && !pupilLoading) ? "auto" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Person sx={{ fontSize: 40, color: "text.disabled" }} />
          <Typography color="text.secondary" fontSize={'17px'}>No pupil found</Typography>
          {error && (
            <Typography color="error" fontSize={'14px'}>
              Error: {error.message || "Something went wrong"}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default SearchPupilInformationById
