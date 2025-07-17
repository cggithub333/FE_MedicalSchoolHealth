import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
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
import PublishIcon from "@mui/icons-material/Publish"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import RefreshIcon from "@mui/icons-material/Refresh"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import DescriptionIcon from "@mui/icons-material/Description"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import GroupIcon from "@mui/icons-material/Group"
import RoomIcon from "@mui/icons-material/Room"
import NotesIcon from "@mui/icons-material/Notes"
import { useAllCampaign } from "../../../../hooks/manager/healthcheck/campaign/useAllCampaignByStatus"
import { styleCampaign } from "./StyleCampaign";
import HealthCheckScheduleForm from "../campaign/schedule/healthcheck-schedule-management/ScheduleForm";
import { useUpdateCampaignStatus } from "../../../../hooks/manager/healthcheck/create-new-campaign/useUpdateStatusOfNewCampaign";

const statusConfig = {
    PENDING: {
        color: "warning",
        label: "Pending",
        icon: "⏳",
        gradient: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
        shadowColor: "rgba(255, 193, 7, 0.3)",
    },
    PUBLISHED: {
        color: "info",
        label: "Published",
        icon: "📢",
        gradient: "linear-gradient(135deg, #E3F2FD 0%, #B3E5FC 100%)",
        shadowColor: "rgba(3, 169, 244, 0.2)",
    },
    IN_PROGRESS: {
        color: "primary",
        label: "In Progress",
        icon: "🩺",
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
                <Card sx={{ height: 280 }}>
                    <CardContent>
                        <Skeleton variant="text" width="80%" height={32} />
                        <Skeleton variant="rectangular" width={80} height={24} sx={{ my: 1, borderRadius: 1 }} />
                        <Skeleton variant="text" width="100%" />
                        <Skeleton variant="text" width="90%" />
                        <Skeleton variant="text" width="85%" />
                        <Skeleton variant="text" width="75%" />
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

const HealthCampaignManager = () => {
    const { allCampaigns, isLoading, error, refetch } = useAllCampaign()
    const { updateCampaignStatus, isUpdating } = useUpdateCampaignStatus();
    const [selectedTab, setSelectedTab] = useState(0)
    const [selectedYear, setSelectedYear] = useState('ALL')
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogMode, setDialogMode] = useState("view")
    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const [menuCampaignId, setMenuCampaignId] = useState(null)
    const [showScheduleForm, setShowScheduleForm] = useState(false)

    const statusTabs = ["ALL", "PENDING", "PUBLISHED", "IN_PROGRESS", "COMPLETED"]

    // Compute available years from campaigns (by deadlineDate)
    const availableYears = useMemo(() => {
        const campaigns = allCampaigns || [];
        const years = campaigns
            .map(c => {
                if (!c.deadlineDate) return null;
                const d = new Date(c.deadlineDate);
                return isNaN(d) ? null : d.getFullYear();
            })
            .filter(y => y !== null && !isNaN(y));
        return ['ALL', ...Array.from(new Set(years)).sort((a, b) => b - a)];
    }, [allCampaigns])

    // Filter campaigns by status and year (by deadlineDate)
    const filteredCampaigns = useMemo(() => {
        let filtered = allCampaigns || []

        // Only allow these statuses in ALL tab
        const allowedStatuses = ["PENDING", "PUBLISHED", "IN_PROGRESS", "COMPLETED"];

        // Filter by status
        if (selectedTab > 0) {
            const status = statusTabs[selectedTab]
            filtered = filtered.filter((campaign) => campaign.statusHealthCampaign === status)
        } else {
            // ALL tab: filter to allowed statuses only
            filtered = filtered.filter((campaign) => allowedStatuses.includes(campaign.statusHealthCampaign));
        }

        // Filter by year
        if (selectedYear !== 'ALL') {
            filtered = filtered.filter((campaign) => {
                if (!campaign.deadlineDate) return false;
                const d = new Date(campaign.deadlineDate);
                if (isNaN(d)) return false;
                return d.getFullYear() === Number(selectedYear);
            })
        }

        return filtered
    }, [allCampaigns, selectedTab, selectedYear])

    // Count campaigns by status
    const statusCounts = useMemo(() => {
        const campaigns = allCampaigns || []
        const counts = { ALL: campaigns.length }
        statusTabs.slice(1).forEach((status) => {
            counts[status] = campaigns.filter((c) => c.statusHealthCampaign === status).length
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
        setSelectedCampaign(campaign);
        setShowScheduleForm(true);
        handleMenuClose();
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

    const formatDate = (dateString, dateOnly = false) => {
        if (!dateString) return "N/A"
        const options = dateOnly
            ? { year: "numeric", month: "2-digit", day: "2-digit" }
            : { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }
        return new Date(dateString).toLocaleDateString("vi-VN", options)
    }

    const getStatusActions = (campaign) => {
        const actions = []
        const status = campaign.statusHealthCampaign

        if (status === "PENDING") {
            actions.push({ label: "Publish", status: "PUBLISHED", icon: <PublishIcon /> })
        }
        if (status === "PUBLISHED") {
            actions.push({ label: "Start", status: "IN_PROGRESS", icon: <PlayArrowIcon /> })
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
                    Error loading campaigns: {error}
                </Alert>
            </Container>
        )
    }

    if (showScheduleForm) {
        // Pass campaignId instead of the whole campaign object for clarity and to match the refactored ScheduleForm
        return (
            <HealthCheckScheduleForm campaignId={selectedCampaign?.campaignId} onBack={() => setShowScheduleForm(false)} />
        );
    }

    return (
        <div style={styleCampaign.bg}>
            <div style={styleCampaign.bgGradient}></div>
            {/* Header */}
            <AppBar
                position="static"
                elevation={0}
                sx={styleCampaign.header}
            >
                <Toolbar>
                    <Typography
                        variant="h4"
                        sx={styleCampaign.title}
                    >
                        Health Campaign Management
                    </Typography>
                    <IconButton color="inherit" onClick={refetch} disabled={isLoading} sx={{ mr: 2 }}>
                        <RefreshIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Year Filter Dropdown */}
                <Fade in timeout={800}>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Year:</Typography>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                                value={selectedYear}
                                onChange={e => setSelectedYear(e.target.value)}
                                sx={{ borderRadius: 2 }}
                            >
                                {availableYears.map(year => (
                                    <MenuItem key={year} value={year}>{year === 'ALL' ? 'All Years' : year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
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

                {/* Main Content Area: Card Grid or Empty State */}
                <Paper sx={{ background: '#fff', borderRadius: 3, boxShadow: '0 8px 32px rgba(102,126,234,0.08)', p: 3, minHeight: '60vh', width: '100%', mt: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : filteredCampaigns.length > 0 ? (
                        <Grid container spacing={3}>
                            {filteredCampaigns.map((campaign, index) => (
                                <Grid item xs={12} md={6} lg={4} key={campaign.campaignId}>
                                    <Zoom in timeout={600 + index * 100}>
                                        <Card
                                            sx={styleCampaign.card(
                                                statusConfig[campaign.statusHealthCampaign]?.gradient,
                                                statusConfig[campaign.statusHealthCampaign]?.shadowColor
                                            )}
                                        >
                                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={styleCampaign.cardTitle}
                                                    >
                                                        {campaign.title}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) =>
                                                            ["PENDING", "PUBLISHED", "COMPLETED"].includes(campaign.statusHealthCampaign)
                                                                ? handleMenuClick(e, campaign.campaignId)
                                                                : null
                                                        }
                                                        sx={{
                                                            background: "rgba(255,255,255,0.8)",
                                                            backdropFilter: "blur(10px)",
                                                            "&:hover": {
                                                                background: "rgba(255,255,255,0.9)",
                                                                transform: "scale(1.1)",
                                                            },
                                                            transition: "all 0.3s ease",
                                                            visibility: ["PENDING", "PUBLISHED", "COMPLETED"].includes(campaign.statusHealthCampaign) ? "visible" : "hidden",
                                                        }}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Box>

                                                <Chip
                                                    label={`${statusConfig[campaign.statusHealthCampaign]?.icon} ${statusConfig[campaign.statusHealthCampaign]?.label}`}
                                                    color={statusConfig[campaign.statusHealthCampaign]?.color}
                                                    size="small"
                                                    sx={styleCampaign.chip}
                                                />

                                                <Box sx={styleCampaign.address}>
                                                    <LocationOnIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} />
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                        {campaign.address}
                                                    </Typography>
                                                </Box>

                                                <Box sx={styleCampaign.description}>
                                                    <DescriptionIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1, mt: 0.2 }} />
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {campaign.description}
                                                    </Typography>
                                                </Box>

                                                {/* Date Range Display */}
                                                <Box sx={styleCampaign.deadline}>
                                                    <CalendarTodayIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} />
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                        {formatDate(campaign.startExaminationDate, true)} - {formatDate(campaign.endExaminationDate, true)}
                                                    </Typography>
                                                </Box>

                                                <Box sx={styleCampaign.deadline}>
                                                    <CalendarTodayIcon sx={{ fontSize: 18, color: "error.main", mr: 1 }} />
                                                    <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
                                                        Deadline: {formatDate(campaign.deadlineDate)}
                                                    </Typography>
                                                </Box>

                                                <Typography
                                                    variant="caption"
                                                    sx={styleCampaign.created}
                                                >
                                                    Created: {formatDate(campaign.createdAt)}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Fade in timeout={800}>
                            <Box sx={{ ...styleCampaign.empty, background: 'transparent', boxShadow: 'none', minHeight: 320 }}>
                                <Typography variant="h5" color="text.secondary" gutterBottom>
                                    No campaigns found
                                </Typography>

                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                    Create your first campaign to get started
                                </Typography>
                                <Link to="/manager/health-check-campaign/new">
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
                                </Link>

                            </Box>
                        </Fade>
                    )}
                </Paper>
            </Container>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && ["PENDING", "PUBLISHED", "COMPLETED"].includes(allCampaigns.find((c) => c.campaignId === menuCampaignId)?.statusHealthCampaign)}
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
                {(() => {
                    const campaign = allCampaigns.find((c) => c.campaignId === menuCampaignId);
                    if (!campaign) return null;
                    if (campaign.statusHealthCampaign === "COMPLETED") {
                        return (
                            <MenuItem
                                onClick={() => handleViewCampaign(campaign)}
                                sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
                            >
                                <ListItemIcon>
                                    <VisibilityIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText>View Details</ListItemText>
                            </MenuItem>
                        );
                    }
                    if (["PENDING", "PUBLISHED"].includes(campaign.statusHealthCampaign)) {
                        return (
                            <MenuItem
                                onClick={async () => {
                                    await updateCampaignStatus(campaign.campaignId, "CANCELLED");
                                    handleMenuClose();
                                    refetch();
                                }}
                                disabled={isUpdating}
                                sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
                            >
                                <ListItemIcon>
                                    <DeleteIcon color="error" />
                                </ListItemIcon>
                                <ListItemText>Delete</ListItemText>
                            </MenuItem>
                        );
                    }
                    return null;
                })()}
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
                    {dialogMode === "create"
                        ? "Create New Campaign"
                        : dialogMode === "edit"
                            ? "Edit Campaign"
                            : "Campaign Details"}
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {selectedCampaign && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                            {dialogMode === "view" ? (
                                <>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                                        {selectedCampaign.title}
                                    </Typography>
                                    <Box sx={{ display: "grid", gap: 2 }}>
                                        <Typography>
                                            <strong>Address:</strong> {selectedCampaign.address}
                                        </Typography>
                                        <Typography>
                                            <strong>Description:</strong> {selectedCampaign.description}
                                        </Typography>
                                        <Box>
                                            <strong>Status: </strong>
                                            <Chip
                                                label={`${statusConfig[selectedCampaign.statusHealthCampaign]?.icon} ${statusConfig[selectedCampaign.statusHealthCampaign]?.label}`}
                                                color={statusConfig[selectedCampaign.statusHealthCampaign]?.color}
                                                sx={{ ml: 1 }}
                                            />
                                        </Box>
                                        {/* Date Range Display in Dialog */}
                                        <Typography>
                                            {formatDate(selectedCampaign.startExaminationDate, true)} - {formatDate(selectedCampaign.endExaminationDate, true)}
                                        </Typography>
                                        <Typography>
                                            <strong>Deadline:</strong> {formatDate(selectedCampaign.deadlineDate)}
                                        </Typography>
                                        <Typography>
                                            <strong>Created:</strong> {formatDate(selectedCampaign.createdAt)}
                                        </Typography>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    {(dialogMode === "create" || dialogMode === "edit") && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 3,
                                                mt: 1,
                                                background: "linear-gradient(135deg, #f8fafc 0%, #e3e7ed 100%)",
                                                borderRadius: 3,
                                                boxShadow: "0 4px 24px rgba(102,126,234,0.08)",
                                                p: 4,
                                            }}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Campaign Title"
                                                        defaultValue={selectedCampaign?.titleCampaign || ""}
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <LocalHospitalIcon color="primary" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Status</InputLabel>
                                                        <Select
                                                            defaultValue={selectedCampaign?.status || "PENDING"}
                                                            label="Status"
                                                            sx={{ borderRadius: 2 }}
                                                        >
                                                            {Object.keys(statusConfig).map((status) => (
                                                                <MenuItem key={status} value={status}>
                                                                    <span style={{ marginRight: 8 }}>{statusConfig[status].icon}</span>
                                                                    {statusConfig[status].label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Target Group"
                                                        defaultValue={selectedCampaign?.targetGroup || ""}
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <GroupIcon color="info" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Location"
                                                        defaultValue={selectedCampaign?.location || ""}
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <RoomIcon color="secondary" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField
                                                        fullWidth
                                                        label="Start Date"
                                                        type="date"
                                                        defaultValue={selectedCampaign?.startDate || ""}
                                                        InputLabelProps={{ shrink: true }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <CalendarTodayIcon color="action" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField
                                                        fullWidth
                                                        label="End Date"
                                                        type="date"
                                                        defaultValue={selectedCampaign?.endDate || ""}
                                                        InputLabelProps={{ shrink: true }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <CalendarTodayIcon color="action" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField
                                                        fullWidth
                                                        label="Form Deadline"
                                                        type="date"
                                                        defaultValue={selectedCampaign?.formDeadline || ""}
                                                        InputLabelProps={{ shrink: true }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <CalendarTodayIcon color="error" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Notes"
                                                        defaultValue={selectedCampaign?.notes || ""}
                                                        multiline
                                                        rows={3}
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <NotesIcon color="disabled" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}
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
        </div>
    )
}

export default HealthCampaignManager
