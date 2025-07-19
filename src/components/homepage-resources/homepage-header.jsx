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

const getHealthRecordsLink = (role) => {
  switch (role.toLowerCase()) {
    case "parent":
      return "/parent/dashboard";
    case "school_nurse":
      return "/schoolnurse/pupils-management";
    case "manager":
      return "/manager/pupils-management";
    case "admin":
      return "/admin/pupils-management";
    default:
      return "/homepage"; // Default link for other roles or guests
  }
}

export default function HomepageHeader({ currentUser }) {
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
        <Container maxWidth="xl" sx={{ display: "flex", alignItems: "center"}}>
          <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
            <Button sx={{ mx: 1, color: "text.primary", fontWeight: "medium" }}>Home</Button>
            
            <Box component={Link} to={'/blogs'} sx={{ textDecoration: "none" }}>
              <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>Blogs</Button>
            </Box>

            {/* <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>News & Updates</Button> */}
            { currentUser.role !== "guest" && (
              <Box component={Link} to={getHealthRecordsLink(currentUser.role)} sx={{ textDecoration: "none" }}>
                <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>Health Records</Button>
              </Box>
            )}
            <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>Contacts</Button>
            {/* <Button sx={{ mx: 1, color: "text.secondary", fontWeight: "medium" }}>About Us</Button> */}
          </Box>
        </Container>
      </Box>
    </>
  )
}
