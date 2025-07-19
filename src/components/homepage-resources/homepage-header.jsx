import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Menu,
  MenuItem,
  Tooltip
  
} from "@mui/material"
import {
  ExpandMore,
} from "@mui/icons-material"
import LoginModal from "./login-modal.jsx"
import { Link } from "react-router-dom"

export default function HomepageHeader() {
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
    <>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "white", color: "text.primary", boxShadow: 1 }}>
        <Toolbar>
          <Box component={Link} to="/homepage" sx={{ display: "flex", alignItems: "center", flexGrow: 1, cursor: "pointer", textDecoration: "none" }}>
            <Tooltip title="Medical Health Homepage" arrow >
              <img src={'/assets/images/blue_logo.png'} alt={'medical health logo'}
                style={{ width: "12vw", height: "auto" }} />
            </Tooltip>
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
    </>
  )
}
