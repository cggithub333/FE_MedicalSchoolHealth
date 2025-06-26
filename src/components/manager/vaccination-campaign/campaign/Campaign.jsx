"use client"

import { useState, useMemo } from "react"
import {
    Box,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
    IconButton,
    Menu,
    ListItemIcon,
    ListItemText,
    Divider,
    Grid,
    Paper,
    Badge,
    Alert,
    Skeleton,
    Fade,
    Slide,
    Zoom,
    Container,
    AppBar,
    Toolbar,
    InputAdornment,
    Fab,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import VisibilityIcon from "@mui/icons-material/Visibility"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import RefreshIcon from "@mui/icons-material/Refresh"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import VaccinesIcon from "@mui/icons-material/Vaccines"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import NotesIcon from "@mui/icons-material/Notes"
import { useAllVaccinationCampaign } from "./hooks/useAllVaccinationCampaign"
import { styleCampaign } from "./StyleCampaign"

const statusConfig = {
    PENDING: {
        color: "warning",
        label: "Pending",
        icon: "⏳",
        gradient: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
        shadowColor: "rgba(255, 193, 7, 0.3)",
    },
    IN_PROGRESS: {
        color: "primary",
        label: "In Progress",
        icon: "💉",
        gradient: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
        shadowColor: "rgba(33, 150, 243, 0.3)",
    },
    COMPLETED: {
        color: "success",
        label: "Completed",
        icon: "✅",
        gradient: "linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)",
        shadowColor: "rgba(76, 175, 80, 0.3)",
    },
}

const LoadingSkeleton = () => (
    <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item}>
                <Card sx={{ height: 320 }}>
                    <CardContent>
                        <Skeleton variant="text" width="80%" height={32} />
                        <Skeleton variant="rectangular" width={80} height={24} sx={{ my: 1, borderRadius: 1 }} />
                        <Skeleton variant="text" width="100%" />
                        <Skeleton variant="text" width="90%" />
                        <Skeleton variant="text" width="85%" />
                        <Skeleton variant="text" width="75%" />
                        <Skeleton variant="text" width="95%" />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Skeleton variant="text" width="40%" />
                            <Skeleton variant="circular" width={24} height={24} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
)

const allCampaign = () => {
    const { allCampaigns, isLoading, error, refetch } = useAllVaccinationCampaign()
    const [selectedTab, setSelectedTab] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogMode, setDialogMode] = useState("view")
    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const [menuCampaignId, setMenuCampaignId] = useState(null)

    const statusTabs = ["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"]

    // Filter campaigns by status and search term
    const filteredCampaigns = useMemo(() => {
        let filtered = allCampaigns || []

        // Filter by status
        if (selectedTab > 0) {
            const status = statusTabs[selectedTab]
            filtered = filtered.filter((campaign) => campaign.status === status)
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (campaign) =>
                    campaign.titleCampaign?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    campaign.vaccineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    campaign.diseaseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    campaign.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        return filtered
    }, [allCampaigns, selectedTab, searchTerm])

    // Count campaigns by status
    const statusCounts = useMemo(() => {
        const campaigns = allCampaigns || []
        const counts = { ALL: campaigns.length }
        statusTabs.slice(1).forEach((status) => {
            counts[status] = campaigns.filter((c) => c.status === status).length
        })
        return counts
    }, [allCampaigns])

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue)
    }

    const handleMenuClick = (event, campaignId) => {
        setAnchorEl(event.currentTarget)
        setMenuCampaignId(campaignId)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setMenuCampaignId(null)
    }

    const handleViewCampaign = (campaign) => {
        setSelectedCampaign(campaign)
        setDialogMode("view")
        setOpenDialog(true)
        handleMenuClose()
    }

    const handleEditCampaign = (campaign) => {
        setSelectedCampaign(campaign)
        setDialogMode("edit")
        setOpenDialog(true)
        handleMenuClose()
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setSelectedCampaign(null)
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        // Handle DD-MM-YYYY format
        const [day, month, year] = dateString.split("-")
        const date = new Date(year, month - 1, day)
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    }

    const getStatusActions = (campaign) => {
        const actions = []
        const status = campaign.status

        if (status === "PENDING") {
            actions.push({ label: "Start Campaign", status: "IN_PROGRESS", icon: <PlayArrowIcon /> })
        }
        if (status === "IN_PROGRESS") {
            actions.push({ label: "Complete", status: "COMPLETED", icon: <CheckCircleIcon /> })
        }

        return actions
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={refetch}>
                            Retry
                        </Button>
                    }
                >
                    Error loading vaccination campaigns: {error}
                </Alert>
            </Container>
        )
    }

    return (
        <Box sx={styleCampaign.bg}>
            {/* Header */}
            <AppBar
                position="static"
                elevation={0}
                sx={styleCampaign.header}
            >
                <Toolbar>
                    <VaccinesIcon sx={{ mr: 2, fontSize: 32, color: "white" }} />
                    <Typography
                        variant="h4"
                        sx={styleCampaign.title}
                    >
                        Vaccination Campaign Management
                    </Typography>
                    <IconButton color="inherit" onClick={refetch} disabled={isLoading} sx={{ mr: 2 }}>
                        <RefreshIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Search Bar */}
                <Fade in timeout={800}>
                    <Paper sx={styleCampaign.searchbar}>
                        <TextField
                            fullWidth
                            placeholder="Search campaigns by title, vaccine, disease, or notes..."
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
                    </Paper>
                </Fade>

                {/* Status Tabs */}
                <Slide direction="up" in timeout={1000}>
                    <Paper sx={styleCampaign.tabs}>
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                "& .MuiTab-root": {
                                    fontWeight: 600,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        background: "rgba(0,0,0,0.04)",
                                    },
                                },
                                "& .Mui-selected": {
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "white !important",
                                    borderRadius: "8px 8px 0 0",
                                },
                            }}
                        >
                            {statusTabs.map((status, index) => (
                                <Tab
                                    key={status}
                                    label={
                                        <Badge
                                            badgeContent={statusCounts[status]}
                                            color="primary"
                                            sx={{
                                                "& .MuiBadge-badge": {
                                                    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                                                    color: "white",
                                                },
                                            }}
                                        >
                                            {status === "ALL" ? "All Campaigns" : statusConfig[status]?.label || status}
                                        </Badge>
                                    }
                                />
                            ))}
                        </Tabs>
                    </Paper>
                </Slide>

                {/* Loading State */}
                {isLoading && <LoadingSkeleton />}

                {/* Campaign Cards */}
                {!isLoading && (
                    <Grid container spacing={3}>
                        {filteredCampaigns.map((campaign, index) => (
                            <Grid item xs={12} md={6} lg={4} key={campaign.campaignId}>
                                <Zoom in timeout={600 + index * 100}>
                                    <Card
                                        sx={styleCampaign.card(
                                            statusConfig[campaign.status]?.gradient,
                                            statusConfig[campaign.status]?.shadowColor
                                        )}
                                    >
                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700,
                                                        flex: 1,
                                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                        backgroundClip: "text",
                                                        WebkitBackgroundClip: "text",
                                                        WebkitTextFillColor: "transparent",
                                                        lineHeight: 1.3,
                                                    }}
                                                >
                                                    {campaign.titleCampaign}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleMenuClick(e, campaign.campaignId)}
                                                    sx={{
                                                        background: "rgba(255,255,255,0.8)",
                                                        backdropFilter: "blur(10px)",
                                                        "&:hover": {
                                                            background: "rgba(255,255,255,0.9)",
                                                            transform: "scale(1.1)",
                                                        },
                                                        transition: "all 0.3s ease",
                                                    }}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Box>

                                            <Chip
                                                label={`${statusConfig[campaign.status]?.icon} ${statusConfig[campaign.status]?.label}`}
                                                color={statusConfig[campaign.status]?.color}
                                                size="small"
                                                sx={styleCampaign.chip}
                                            />

                                            <Box sx={styleCampaign.vaccine}>
                                                <VaccinesIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} />
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    {campaign.vaccineName}
                                                </Typography>
                                            </Box>

                                            <Box sx={styleCampaign.disease}>
                                                <LocalHospitalIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} />
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    {campaign.diseaseName}
                                                </Typography>
                                            </Box>

                                            <Box sx={styleCampaign.date}>
                                                <CalendarTodayIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} />
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                                                </Typography>
                                            </Box>

                                            <Box sx={styleCampaign.deadline}>
                                                <CalendarTodayIcon sx={{ fontSize: 18, color: "error.main", mr: 1 }} />
                                                <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
                                                    Deadline: {formatDate(campaign.formDeadline)}
                                                </Typography>
                                            </Box>

                                            {campaign.notes && (
                                                <Box sx={styleCampaign.notes}>
                                                    <NotesIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1, mt: 0.2 }} />
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {campaign.notes}
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Box sx={styleCampaign.active}>
                                                <Chip
                                                    label={campaign.active ? "Active" : "Inactive"}
                                                    color={campaign.active ? "success" : "default"}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Zoom>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Empty State */}
                {!isLoading && filteredCampaigns.length === 0 && (
                    <Fade in timeout={800}>
                        <Paper sx={styleCampaign.empty}>
                            <VaccinesIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                            <Typography variant="h5" color="text.secondary" gutterBottom>
                                No vaccination campaigns found
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                {searchTerm
                                    ? "Try adjusting your search terms"
                                    : "Create your first vaccination campaign to get started"}
                            </Typography>
                            {!searchTerm && (
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => {
                                        setSelectedCampaign(null)
                                        setDialogMode("create")
                                        setOpenDialog(true)
                                    }}
                                    sx={{
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        borderRadius: 3,
                                        px: 4,
                                        py: 1.5,
                                        textTransform: "none",
                                        fontSize: "1.1rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    Create Your First Campaign
                                </Button>
                            )}
                        </Paper>
                    </Fade>
                )}
            </Container>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="add"
                sx={styleCampaign.fab}
                onClick={() => {
                    setSelectedCampaign(null)
                    setDialogMode("create")
                    setOpenDialog(true)
                }}
            >
                <AddIcon />
            </Fab>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(10px)",
                    },
                }}
            >
                <MenuItem
                    onClick={() => handleViewCampaign(allCampaigns.find((c) => c.campaignId === menuCampaignId))}
                    sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
                >
                    <ListItemIcon>
                        <VisibilityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>

                <MenuItem
                    onClick={() => handleEditCampaign(allCampaigns.find((c) => c.campaignId === menuCampaignId))}
                    sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
                >
                    <ListItemIcon>
                        <EditIcon color="info" />
                    </ListItemIcon>
                    <ListItemText>Edit Campaign</ListItemText>
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                {/* Status Change Actions */}
                {menuCampaignId &&
                    getStatusActions(allCampaigns.find((c) => c.campaignId === menuCampaignId)).map((action) => (
                        <MenuItem key={action.status} sx={{ borderRadius: 1, mx: 1, my: 0.5 }}>
                            <ListItemIcon>{action.icon}</ListItemIcon>
                            <ListItemText>{action.label}</ListItemText>
                        </MenuItem>
                    ))}

                <Divider sx={{ my: 1 }} />

                <MenuItem onClick={handleMenuClose} sx={{ borderRadius: 1, mx: 1, my: 0.5, color: "error.main" }}>
                    <ListItemIcon>
                        <DeleteIcon color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete Campaign</ListItemText>
                </MenuItem>
            </Menu>

            {/* Campaign Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <VaccinesIcon sx={{ mr: 2 }} />
                    {dialogMode === "create"
                        ? "Create New Vaccination Campaign"
                        : dialogMode === "edit"
                            ? "Edit Vaccination Campaign"
                            : "Vaccination Campaign Details"}
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {selectedCampaign && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                            {dialogMode === "view" ? (
                                <>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                                        {selectedCampaign.titleCampaign}
                                    </Typography>
                                    <Box sx={{ display: "grid", gap: 2 }}>
                                        <Typography>
                                            <strong>Vaccine:</strong> {selectedCampaign.vaccineName}
                                        </Typography>
                                        <Typography>
                                            <strong>Disease:</strong> {selectedCampaign.diseaseName}
                                        </Typography>
                                        <Box>
                                            <strong>Status: </strong>
                                            <Chip
                                                label={`${statusConfig[selectedCampaign.status]?.icon} ${statusConfig[selectedCampaign.status]?.label}`}
                                                color={statusConfig[selectedCampaign.status]?.color}
                                                sx={{ ml: 1 }}
                                            />
                                        </Box>
                                        <Typography>
                                            <strong>Start Date:</strong> {formatDate(selectedCampaign.startDate)}
                                        </Typography>
                                        <Typography>
                                            <strong>End Date:</strong> {formatDate(selectedCampaign.endDate)}
                                        </Typography>
                                        <Typography>
                                            <strong>Form Deadline:</strong> {formatDate(selectedCampaign.formDeadline)}
                                        </Typography>
                                        <Typography>
                                            <strong>Active:</strong> {selectedCampaign.active ? "Yes" : "No"}
                                        </Typography>
                                        {selectedCampaign.notes && (
                                            <Typography>
                                                <strong>Notes:</strong> {selectedCampaign.notes}
                                            </Typography>
                                        )}
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Campaign Title"
                                        defaultValue={selectedCampaign?.titleCampaign || ""}
                                        variant="outlined"
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Vaccine Name"
                                        defaultValue={selectedCampaign?.vaccineName || ""}
                                        variant="outlined"
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Disease Name"
                                        defaultValue={selectedCampaign?.diseaseName || ""}
                                        variant="outlined"
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            defaultValue={selectedCampaign?.status || "PENDING"}
                                            label="Status"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {Object.keys(statusConfig).map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {statusConfig[status].icon} {statusConfig[status].label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        label="Start Date"
                                        type="date"
                                        defaultValue={selectedCampaign?.startDate || ""}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="End Date"
                                        type="date"
                                        defaultValue={selectedCampaign?.endDate || ""}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Form Deadline"
                                        type="date"
                                        defaultValue={selectedCampaign?.formDeadline || ""}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Notes"
                                        defaultValue={selectedCampaign?.notes || ""}
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} sx={{ borderRadius: 2, textTransform: "none" }}>
                        {dialogMode === "view" ? "Close" : "Cancel"}
                    </Button>
                    {dialogMode !== "view" && (
                        <Button
                            variant="contained"
                            sx={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                borderRadius: 2,
                                textTransform: "none",
                                px: 3,
                            }}
                        >
                            {dialogMode === "create" ? "Create" : "Save Changes"}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default allCampaign
