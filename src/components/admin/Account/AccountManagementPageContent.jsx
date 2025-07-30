
"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Switch,
  IconButton,
  Pagination,
  InputAdornment,
  Container,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
  DeleteSweep as DeleteSweepIcon,
} from "@mui/icons-material"

import React, { useEffect } from "react"

import { downloadExcel } from "@utils/excel-utils"
import useQueryAllUsers from "@hooks/admin/useQueryAllUsers"
import { showErrorToast, showSuccessToast } from "@utils/toast-utils"

import useChangeStatusUserById from "@hooks/admin/useChangeStatusUserById"

const ACCOUNT_PER_PAGE = 5;

const AccountManagementPageContent = () => {

  const { changeStatus: changeUserStatus } = useChangeStatusUserById();
  const { error: usersError, loading: userLoading, users: userAccounts, refetchAllUsers } = useQueryAllUsers();

  // refetch users every time the userAccounts change:
  useEffect(() => {
    if (userAccounts) {
      setUsers(userAccounts);
    }
  }, [userAccounts])

  // debug:
  console.log("userAccounts:", JSON.stringify(userAccounts, null, 2));

  const [users, setUsers] = useState(userAccounts || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortBy, setSortBy] = useState("A-Z")
  const [page, setPage] = useState(1)
  const [actionsAnchor, setActionsAnchor] = useState(null)

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: "success",
      PARENT: "default",
      SCHOOL_NURSE: "primary",
      MANAGER: "secondary",
    }
    return colors[role] || "default"
  }

  const getRoleLabel = (role) => {
    const labels = {
      ADMIN: "Admin",
      PARENT: "Parent",
      SCHOOL_NURSE: "School Nurse",
      MANAGER: "Manager",
    }
    return labels[role] || role
  }

  const handleStatusToggle = async (user) => {
    
    if (!user) return;
    if (user.role === "ADMIN") {
      showErrorToast("Cannot inactivate admin user");
      return;
    }

    const userName = `${user.firstName} ${user.lastName}`.trim();

    try {
      const result = await changeUserStatus(user.userId, !user.active);
      if (result) {
        refetchAllUsers(); // make the userAccounts change => trigger useEffect to update users state
        showSuccessToast(`User ${userName} has been ${user.active ? "deactivated" : "activated"} successfully`);
      }
    } catch (err) {
      showErrorToast(`Failed to ${user.active ? "deactivate" : "activate"} user ${userName}`);
    }
  }

  const getInitials = (firstName, lastName) => {

    if (!firstName || !lastName) return ""

    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleActionsClick = (event) => {
    setActionsAnchor(event.currentTarget)
  }

  const handleActionsClose = () => {
    setActionsAnchor(null)
  }

  const filterCallback = (user) => {

    const userName = `${user.lastName} ${user.firstName}`.toLowerCase()

    const matchesSearch =
      userName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toString().includes(searchTerm) ||
      user.phoneNumber.includes(searchTerm)

    const matchesRole = roleFilter === "All" || user.role === roleFilter
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && user.active) ||
      (statusFilter === "Inactive" && !user.active)

    return matchesSearch && matchesRole && matchesStatus
  }
  const handleDownloadAsExcel = () => {
    // get data:
    const data = (users || []).filter(filterCallback);
    // debug:
    console.log("Downloaded data:", data);
    downloadExcel(data, "user_accounts");
    setActionsAnchor(null); // Close the menu after action
  }

  const filteredUsers = (users || []).filter(filterCallback)

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 600, mb: 1, color: "#1a1a1a" }}>
              User Account Management
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              Manage all system users including parents, nurses, and staff.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            }}
          >
            Add New User
          </Button>
        </Box>
      </Box>

      {/* Search & Filter Panel */}
      <Card sx={{ mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item size={{ xs: 12, md: 3 }}>
              <Tooltip title="Search by ID, email, phone or name">
                <TextField
                  fullWidth
                  placeholder="Search by ID, email, phone or name"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setPage(1) // Reset to first page on search
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Tooltip>
            </Grid>

            <Grid item size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="PARENT">Parent</MenuItem>
                  <MenuItem value="SCHOOL_NURSE">School Nurse</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="A-Z">A–Z</MenuItem>
                  <MenuItem value="Z-A">Z–A</MenuItem>
                  <MenuItem value="Newest">Newest</MenuItem>
                  <MenuItem value="Oldest">Oldest</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, md: 3 }}>
              <Button
                variant="outlined"
                onClick={handleActionsClick}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  height: 56,
                }}
              >
                Actions
              </Button>
              <Menu anchorEl={actionsAnchor} open={Boolean(actionsAnchor)} onClose={handleActionsClose}>
                <MenuItem onClick={handleDownloadAsExcel}>
                  <ListItemIcon>
                    <FileDownloadIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Export</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleActionsClose}>
                  <ListItemIcon>
                    <DeleteSweepIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Bulk Delete</ListItemText>
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card sx={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)", borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 600, color: "#374151", textAlign: 'center' }}>Avatar</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", textAlign: 'center' }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", textAlign: 'center' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", textAlign: 'center' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", textAlign: 'center' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", textAlign: 'center' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", textAlign: 'center' }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filteredUsers || []).map((user, index) => {

                if (!user) return null; // skip if user is null or undefined

                // pagination logic:
                const startIndex = (page - 1) * ACCOUNT_PER_PAGE;
                const endIndex = startIndex + ACCOUNT_PER_PAGE;
                if (index < startIndex || index >= endIndex) return null; // skip rows

                return (
                  <TableRow
                    key={user.userId}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                        transition: "background-color 0.2s ease",
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#1976d2",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          {getInitials(user.firstName, user.lastName)}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          {user.firstName}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                          {user.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                          {user.firstName}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{user.phoneNumber}</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={getRoleLabel(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          borderRadius: 2,
                          width: "100px",
                          textAlign: "center",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Tooltip title={user.role === "ADMIN" ? "Can not inactive admin" : (user.active ? "Inactive" : "Active")}>
                          <Switch color={user.role === "ADMIN" ? "default" : "primary"} checked={user.active} onChange={() => handleStatusToggle(user)} size="small" />
                        </Tooltip>
                        <Typography variant="body2" color="text.secondary">
                          {user.active ? "Active" : "Inactive"}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                        <Tooltip title="Edit User">
                          <IconButton size="small" sx={{ color: "#1976d2" }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset Password">
                          <IconButton size="small" sx={{ color: "#ed6c02" }}>
                            <LockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title={user.role === "ADMIN" ? "Cannot delete admin" : "Delete User"}>
                          <IconButton size="small" sx={{ color: user.role === "ADMIN" ? "#ddd" : "#d32f2f" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip> */}
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil((filteredUsers.length || 0) / ACCOUNT_PER_PAGE) || 1}
          page={page}
          onChange={(event, page) => setPage(page)}
          color="primary"
          size="large"
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: 2,
              fontWeight: 500,
            },
          }}
        />
      </Box>
    </Container>
  )
}

export default AccountManagementPageContent;
