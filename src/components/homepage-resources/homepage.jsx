"use client"

import { useState } from "react"
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
  LocationOn,
  Email,
  AccessTime,
  Facebook,
  Twitter,
  Instagram,
} from "@mui/icons-material"
import LoginModal from "./login-modal.jsx"

export default function Homepage() {
  const [servicesAnchor, setServicesAnchor] = useState(null)
  const [blogsAnchor, setBlogsAnchor] = useState(null)

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
            <Favorite sx={{ color: "error.main", mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
              SchoolHealth+
            </Typography>
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

            <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>News & Updates</Button>
            <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>Health Records</Button>
            <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>Emergency Contacts</Button>
            <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>About Us</Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #e8f5e8 0%, #e3f2fd 100%)",
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
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "success.main",
                "&:hover": { bgcolor: "success.dark" },
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              Book Health Checkup
            </Button>
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
      <Box sx={{ bgcolor: "grey.900", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Favorite sx={{ color: "error.main", mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  SchoolHealth+
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "grey.300", mb: 3 }}>
                Dedicated to providing comprehensive healthcare services and promoting wellness in our school community.
                Your health is our priority.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton sx={{ color: "white", border: 1, borderColor: "white" }}>
                  <Facebook />
                </IconButton>
                <IconButton sx={{ color: "white", border: 1, borderColor: "white" }}>
                  <Twitter />
                </IconButton>
                <IconButton sx={{ color: "white", border: 1, borderColor: "white" }}>
                  <Instagram />
                </IconButton>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button sx={{ color: "grey.300", justifyContent: "flex-start", p: 0 }}>Health Services</Button>
                <Button sx={{ color: "grey.300", justifyContent: "flex-start", p: 0 }}>Book Appointment</Button>
                <Button sx={{ color: "grey.300", justifyContent: "flex-start", p: 0 }}>Health Records</Button>
                <Button sx={{ color: "grey.300", justifyContent: "flex-start", p: 0 }}>Emergency Contacts</Button>
                <Button sx={{ color: "grey.300", justifyContent: "flex-start", p: 0 }}>Vaccination Schedule</Button>
              </Box>
            </Grid>

            {/* Contact Info */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOn sx={{ color: "grey.400", mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "grey.300" }}>
                    123 School Street, Education City, EC 12345
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Phone sx={{ color: "grey.400", mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "grey.300" }}>
                    +1 (555) 123-4567
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Email sx={{ color: "grey.400", mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "grey.300" }}>
                    health@schoolhealth.edu
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTime sx={{ color: "grey.400", mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "grey.300" }}>
                    Mon-Fri: 8AM-5PM
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Bottom Footer */}
          <Divider sx={{ my: 4, borderColor: "grey.700" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="body2" sx={{ color: "grey.400" }}>
              © 2024 SchoolHealth+. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3, mt: { xs: 2, md: 0 } }}>
              <Button sx={{ color: "grey.400", p: 0 }}>Privacy Policy</Button>
              <Button sx={{ color: "grey.400", p: 0 }}>Terms of Service</Button>
              <Button sx={{ color: "grey.400", p: 0 }}>Cookie Policy</Button>
              <Button sx={{ color: "grey.400", p: 0 }}>Accessibility</Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
