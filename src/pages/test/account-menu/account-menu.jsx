"use client"

import { useState } from "react"
import { Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Box, Typography, Chip } from "@mui/material"
import { Dashboard, Person, Language, Logout, KeyboardArrowDown } from "@mui/icons-material"

const AccountMenu = ({
  username = "John Doe",
  avatarSrc,
  gender = "male",
  onDashboard = () => console.log("Dashboard clicked"),
  onProfile = () => console.log("Profile clicked"),
  onLanguages = () => console.log("Languages clicked"),
  onLogout = () => console.log("Logout clicked"),
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (callback) => {
    callback()
    handleClose()
  }

  // Generate avatar based on gender if no avatarSrc provided
  const getAvatarProps = () => {
    if (avatarSrc) {
      return { src: avatarSrc }
    }

    const firstLetter = username.charAt(0).toUpperCase()
    const maleColor = "#1976d2" // Blue
    const femaleColor = "#e91e63" // Pink

    return {
      sx: {
        bgcolor: gender === "female" ? femaleColor : maleColor,
        color: "white",
      },
      children: firstLetter,
    }
  }

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
        // Add accessibility props
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${username}`}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            handleClick(event)
          }
        }}
      >
        <Avatar
          {...getAvatarProps()}
          sx={{
            width: 40,
            height: 40,
            marginRight: 1,
            ...getAvatarProps().sx,
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "text.primary",
              display: { xs: "none", sm: "block" },
            }}
          >
            {username}
          </Typography>
          <KeyboardArrowDown
            sx={{
              fontSize: 20,
              color: "text.secondary",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        // Add these accessibility props to fix the aria-hidden warning
        aria-labelledby="account-menu-button"
        role="menu"
        disableAutoFocusItem={false}
        disableEnforceFocus={false}
        disablePortal={false}
        // Keep focus management proper
        autoFocus={true}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            minWidth: 200,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              {...getAvatarProps()}
              sx={{
                width: 32,
                height: 32,
                ...getAvatarProps().sx,
              }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {username}
              </Typography>
              <Chip
                label={gender === "female" ? "Female" : "Male"}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.75rem",
                  bgcolor: gender === "female" ? "#fce4ec" : "#e3f2fd",
                  color: gender === "female" ? "#c2185b" : "#1565c0",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Menu Items - Add role="menuitem" for better accessibility */}
        <MenuItem 
          onClick={() => handleMenuItemClick(onDashboard)}
          role="menuitem"
        >
          <ListItemIcon>
            <Dashboard fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>

        <MenuItem 
          onClick={() => handleMenuItemClick(onProfile)}
          role="menuitem"
        >
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem 
          onClick={() => handleMenuItemClick(onLanguages)}
          role="menuitem"
        >
          <ListItemIcon>
            <Language fontSize="small" />
          </ListItemIcon>
          <ListItemText>Languages</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => handleMenuItemClick(onLogout)}
          role="menuitem"
          sx={{
            color: "error.main",
            "&:hover": {   
              backgroundColor: "error.light",
              color: "error.contrastText",
            },
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "inherit" }} />
          </ListItemIcon>
          <ListItemText>Log out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default AccountMenu