"use client"

import { useEffect, useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  Grid,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material"
import {
  Favorite,
  ExpandMore,
  LocalHospital,
  Shield,
  Psychology,
  Phone,
  Assignment,
  Group,
} from "@mui/icons-material"
import LoginModal from "./login-modal.jsx"
import HomepageFooter from "./homepage-footer.jsx"

import SchoolHealthIcon from '@mui/icons-material/School';
import useMyInformation from "@hooks/common/useMyInformation.js"
import { Link } from "react-router-dom"

export default function Homepage() {
  const [servicesAnchor, setServicesAnchor] = useState(null)
  const [blogsAnchor, setBlogsAnchor] = useState(null)

  const { personalInforState, loading} = useMyInformation();

  const [currentUser, setCurrentUser] = useState({
    role: personalInforState?.role || "guest",
  })

  // reload if state changes:
  useEffect(() => {
    if (!loading) {
      setCurrentUser({
        role: personalInforState?.role || "guest",
      })
    }
  }, [loading, personalInforState]);

  // debug:
  console.log("Current User Role:", JSON.stringify(currentUser, null, 2));  


  const handleServicesClick = (event) => {
    setServicesAnchor(event.currentTarget)
  }

  const handleBlogsClick = (event) => {
    setBlogsAnchor(event.currentTarget)
  }

  const handleClose = () => {
    setServicesAnchor(null)
    setBlogsAnchor(null)
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "white", color: "text.primary", boxShadow: 1 }}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img  src={'/assets/images/blue_logo.png'} alt={'medical health logo'}
                  style={{ width: "12vw", height: "auto" }}/>
          </Box>
          <LoginModal />
        </Toolbar>
      </AppBar>

      {/* Navigation Bar */}
      <Box sx={{ bgcolor: "grey.50", borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
            <Button sx={{ mx: 1, color: "text.primary", fontWeight: "medium" }}>Home</Button>

            <Button
              sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}
              endIcon={<ExpandMore />}
              onClick={handleServicesClick}
            >
              Health Services
            </Button>
            <Menu anchorEl={servicesAnchor} open={Boolean(servicesAnchor)} onClose={handleClose}>
              <MenuItem onClick={handleClose}>Medical Checkups</MenuItem>
              <MenuItem onClick={handleClose}>Vaccination Services</MenuItem>
              <MenuItem onClick={handleClose}>Mental Health Support</MenuItem>
              <MenuItem onClick={handleClose}>Emergency Care</MenuItem>
            </Menu>

            <Button
              sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}
              endIcon={<ExpandMore />}
              onClick={handleBlogsClick}
            >
              Blogs
            </Button>
            <Menu anchorEl={blogsAnchor} open={Boolean(blogsAnchor)} onClose={handleClose}>
              <MenuItem onClick={handleClose}>Vaccination Blogs</MenuItem>
              <MenuItem onClick={handleClose}>Health Check Blogs</MenuItem>
              <MenuItem onClick={handleClose}>Nutrition Tips</MenuItem>
              <MenuItem onClick={handleClose}>Mental Wellness</MenuItem>
              <MenuItem onClick={handleClose}>Sports Medicine</MenuItem>
            </Menu>

            {/* <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>News & Updates</Button> */}
            <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>Health Records</Button>
            <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>Contacts</Button>
            {/* <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>About Us</Button> */}
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: "#ccdde5",
          py: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                mb: 2,
                fontSize: { xs: "2.5rem", md: "3.75rem" },
              }}
            >
              Your School's Health & Wellness Hub
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                mb: 4,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Comprehensive healthcare services, health education, and wellness resources for students, parents, and
              staff.
            </Typography>
            <Box component={Link} to={currentUser.role === "guest" ? "/news" : "/dashboard"}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "#5ba8e5",
                  "&:hover": { bgcolor: "#0189f4" },
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                }}
              >
                {currentUser.role === "guest" ? "Watching blogs" : "Explore Health Services"}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
              Our Health Services
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              Comprehensive healthcare solutions for your school community
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ height: "100%", p: 2 }}>
                <CardContent>
                  <LocalHospital sx={{ fontSize: 40, color: "success.main", mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Regular Health Checkups
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comprehensive health screenings and medical examinations for all students
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ height: "100%", p: 2 }}>
                <CardContent>
                  <Shield sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Vaccination Programs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Up-to-date immunization schedules and vaccination tracking
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ height: "100%", p: 2 }}>
                <CardContent>
                  <Psychology sx={{ fontSize: 40, color: "error.main", mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Mental Health Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Counseling services and mental wellness programs for students
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ height: "100%", p: 2 }}>
                <CardContent>
                  <Phone sx={{ fontSize: 40, color: "warning.main", mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    24/7 Emergency Care
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Round-the-clock emergency medical assistance and first aid
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ height: "100%", p: 2 }}>
                <CardContent>
                  <Assignment sx={{ fontSize: 40, color: "secondary.main", mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Health Records
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Secure digital health records and medical history tracking
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ height: "100%", p: 2 }}>
                <CardContent>
                  <Group sx={{ fontSize: 40, color: "info.main", mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Health Education
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Educational programs on nutrition, hygiene, and healthy lifestyle
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Latest News Section */}
      <Box sx={{ py: 8, bgcolor: "grey.50" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
              Latest Health News & Updates
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              Stay informed about health initiatives and important announcements
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    New Vaccination Schedule Released
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                    March 15, 2024
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Updated immunization requirements for the upcoming school year. All students must complete...
                  </Typography>
                  <Button size="small">Read More</Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Mental Health Awareness Week
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                    March 10, 2024
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Join us for a week of activities focused on mental wellness and emotional health support...
                  </Typography>
                  <Button size="small">Read More</Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Healthy Eating Initiative Launch
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                    March 5, 2024
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    New nutrition program aims to promote healthy eating habits among students and staff...
                  </Typography>
                  <Button size="small">Read More</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <HomepageFooter />
    </Box>
  )
}
