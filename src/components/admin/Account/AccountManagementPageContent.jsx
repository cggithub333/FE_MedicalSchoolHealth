
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

// Mock data
const userAccounts = [
  {
    id: "PR0001",
    firstName: "Hùng",
    lastName: "Nguyễn",
    email: "hung.nguyen@truonghoc.edu.vn",
    phone: "0281234678",
    role: "PARENT",
    status: true,
    avatar: null,
  },
  {
    id: "SN0001",
    firstName: "Lan",
    lastName: "Trần",
    email: "lan.tran@truonghoc.edu.vn",
    phone: "0282345789",
    role: "SCHOOL_NURSE",
    status: true,
    avatar: null,
  },
  {
    id: "AD0001",
    firstName: "Minh",
    lastName: "Phạm",
    email: "minh.pham@truonghoc.edu.vn",
    phone: "0284567890",
    role: "ADMIN",
    status: false,
    avatar: null,
  },
  {
    id: "MN0001",
    firstName: "Thảo",
    lastName: "Lê",
    email: "thao.le@truonghoc.edu.vn",
    phone: "0284562890",
    role: "MANAGER",
    status: true,
    avatar: null,
  },
  {
    id: "PR0002",
    firstName: "Tuấn",
    lastName: "Hoàng",
    email: "tuan.hoang@truonghoc.edu.vn",
    phone: "0284567811",
    role: "PARENT",
    status: true,
    avatar: null,
  },
  {
    id: "PR0003",
    firstName: "Quỳnh",
    lastName: "Đỗ",
    email: "quynh.do@truonghoc.edu.vn",
    phone: "0286789012",
    role: "PARENT",
    status: true,
    avatar: null,
  },
  {
    id: "SN0002",
    firstName: "An",
    lastName: "Vũ",
    email: "an.vu@truonghoc.edu.vn",
    phone: "0287890123",
    role: "SCHOOL_NURSE",
    status: true,
    avatar: null,
  },
  {
    id: "AD0002",
    firstName: "Tuệ",
    lastName: "Ngô",
    email: "tue.ngo@truonghoc.edu.vn",
    phone: "0288901234",
    role: "ADMIN",
    status: false,
    avatar: null,
  },
  {
    id: "PR0004",
    firstName: "Việt",
    lastName: "Lâm",
    email: "viet.lam@truonghoc.edu.vn",
    phone: "0289012345",
    role: "PARENT",
    status: true,
    avatar: null,
  },
  {
    id: "MN0002",
    firstName: "Như",
    lastName: "Đinh",
    email: "nhu.dinh@truonghoc.edu.vn",
    phone: "0280123456",
    role: "MANAGER",
    status: true,
    avatar: null,
  },
  {
    id: "PR0005",
    firstName: "Long",
    lastName: "Trịnh",
    email: "long.trinh@truonghoc.edu.vn",
    phone: "0282345678",
    role: "PARENT",
    status: true,
    avatar: null,
  },
  {
    id: "SN0003",
    firstName: "Hà",
    lastName: "Bùi",
    email: "ha.bui@truonghoc.edu.vn",
    phone: "0283456789",
    role: "SCHOOL_NURSE",
    status: false,
    avatar: null,
  },
  {
    id: "AD0003",
    firstName: "Sơn",
    lastName: "Mai",
    email: "son.mai@truonghoc.edu.vn",
    phone: "0284567890",
    role: "ADMIN",
    status: true,
    avatar: null,
  },
  {
    id: "PR0006",
    firstName: "Thư",
    lastName: "Phan",
    email: "thu.phan@truonghoc.edu.vn",
    phone: "0285678901",
    role: "PARENT",
    status: true,
    avatar: null,
  },
  {
    id: "MN0003",
    firstName: "Dũng",
    lastName: "Hoàng",
    email: "dung.hoang@truonghoc.edu.vn",
    phone: "0286789012",
    role: "MANAGER",
    status: false,
    avatar: null,
  },
]

const ACCOUNT_PER_PAGE = 5;

const AccountManagementPageContent = () => {
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

  const handleStatusToggle = (userId) => {
    setUsers((users || []).map((user) => (user.id === userId ? { ...user, status: !user.status } : user)))
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleActionsClick = (event) => {
    setActionsAnchor(event.currentTarget)
  }

  const handleActionsClose = () => {
    setActionsAnchor(null)
  }

  const filteredUsers = (users || []).filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm)

    const matchesRole = roleFilter === "All" || user.role === roleFilter
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && user.status) ||
      (statusFilter === "Inactive" && !user.status)

    return matchesSearch && matchesRole && matchesStatus
  })

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
            <Grid item size={{xs: 12, md:3}}>
              <TextField
                fullWidth
                placeholder="Search by ID, email, or name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            </Grid>

            <Grid item size={{xs: 12, md:2}}>
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

            <Grid item size={{xs: 12, md:2}}>
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

            <Grid item size={{xs: 12, md:2}}>
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

            <Grid item size={{xs: 12, md:3}}>
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
                <MenuItem onClick={handleActionsClose}>
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
              {filteredUsers.map((user, index) => {

                if (!user) return null; // skip if user is null or undefined

                // pagination logic:
                const startIndex = (page - 1) * ACCOUNT_PER_PAGE;
                const endIndex = startIndex + ACCOUNT_PER_PAGE;
                if (index < startIndex || index >= endIndex) return null; // skip rows

                return (
                  <TableRow
                    key={user.id}
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
                          {user.firstName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                          {user.lastName}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{user.phone}</Typography>
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
                        <Switch checked={user.status} onChange={() => handleStatusToggle(user.id)} size="small" />
                        <Typography variant="body2" color="text.secondary">
                          {user.status ? "Active" : "Inactive"}
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
                        <Tooltip title="Delete User">
                          <IconButton size="small" sx={{ color: "#d32f2f" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
          count={3}
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
