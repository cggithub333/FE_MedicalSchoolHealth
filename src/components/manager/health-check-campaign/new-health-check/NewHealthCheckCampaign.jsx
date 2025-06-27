import { useState } from "react"
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Chip,
    Paper,
    Fade,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useNewestCampaign } from "../../../../hooks/manager/healthcheck/create-new-campaign/useNewestCampaignByStatus"
import { useUpdateCampaignStatus } from "../../../../hooks/manager/healthcheck/create-new-campaign/useUpdateStatusOfNewCampaign"
import HealthCheckCampaignForm from "./health-check-campaign-form/HealthCheckCampaignForm"
import "./StyleNewHealthCheckCampaign.scss" // Assuming this file contains the necessary styles

const NewHealthCheckCampaign = () => {
    const { newestCampaign, isLoading } = useNewestCampaign()
    const { updateCampaignStatus, isUpdating } = useUpdateCampaignStatus()
    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [createFormOpen, setCreateFormOpen] = useState(false)
    const [activeStep, setActiveStep] = useState(0)

    // Ensure newestCampaign is always an array
    const campaigns = Array.isArray(newestCampaign) ? newestCampaign : []

    // Debug: log all campaign statuses
    console.log("Campaign statuses:", campaigns.map(c => c.statusHealthCampaign))

    // Filter campaigns by status (robust to whitespace/case)
    const pendingCampaigns = campaigns.filter((c) => (c.statusHealthCampaign || "").trim().toUpperCase() === "PENDING")
    const publishedCampaigns = campaigns.filter((c) => (c.statusHealthCampaign || "").trim().toUpperCase() === "PUBLISHED")
    const inProgressCampaigns = campaigns.filter((c) => (c.statusHealthCampaign || "").trim().toUpperCase() === "IN_PROGRESS")

    const steps = [
        {
            label: "Pending Campaigns",
            description: "Select a campaign to publish",
            campaigns: pendingCampaigns,
            nextStatus: "PUBLISHED",
            actionLabel: "Publish Campaign",
        },
        {
            label: "Published Campaigns",
            description: "Move published campaign to in progress",
            campaigns: publishedCampaigns,
            nextStatus: "IN_PROGRESS",
            actionLabel: "Start Campaign",
        },
        {
            label: "In Progress Campaigns",
            description: "Currently active campaigns",
            campaigns: inProgressCampaigns,
            nextStatus: null,
            actionLabel: null,
        },
    ]

    const handleCampaignClick = (campaign) => {
        setSelectedCampaign(campaign)
        setDialogOpen(true)
    }

    const handleStatusUpdate = async (campaign, newStatus) => {
        try {
            await updateCampaignStatus(campaign.campaignId, newStatus)
            setDialogOpen(false)
            // Refresh data or update local state
            window.location.reload()
        } catch (error) {
            console.error("Failed to update campaign status:", error)
            alert("Failed to update campaign status")
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const cardSx = {
        minWidth: 320,
        maxWidth: 340,
        minHeight: 220,
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(102,126,234,0.10)",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%)",
        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        cursor: "pointer",
        mb: 2,
        '&:hover': {
            boxShadow: "0 16px 40px rgba(102,126,234,0.18)",
            transform: "translateY(-4px) scale(1.02)",
        },
    }

    const fabSx = {
        position: "fixed",
        bottom: 32,
        right: 32,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        boxShadow: "0 8px 32px rgba(102,126,234,0.4)",
        '&:hover': {
            background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            transform: "scale(1.1)",
        },
    }

    const bgGradientSx = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 60%, #f7971e 100%)",
        minHeight: "100vh",
        width: "100vw",
    }

    const statusColors = {
        PENDING: "warning",
        PUBLISHED: "info",
        IN_PROGRESS: "primary",
    }
    const statusLabels = {
        PENDING: "Pending",
        PUBLISHED: "Published",
        IN_PROGRESS: "In Progress",
    }
    const statusDescriptions = {
        PENDING: "Campaigns waiting to be published.",
        PUBLISHED: "Campaigns ready to start.",
        IN_PROGRESS: "Active health check campaigns.",
    }
    function getStatusColor(status) {
        return statusColors[status] || "default";
    }
    const statusOrder = ["PENDING", "PUBLISHED", "IN_PROGRESS"];

    function canUpdateToProgress(campaign) {
        return campaign.statusHealthCampaign === "PUBLISHED" && inProgressCampaigns.length === 0;
    }

    function canUpdateToPending(campaign) {
        return campaign.statusHealthCampaign === "PENDING" && publishedCampaigns.length === 0;
    }

    if (isLoading) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column" }}>
            <Box sx={bgGradientSx}></Box>
            <Fade in timeout={800}>
                <Paper elevation={3} sx={{ maxWidth: 1400, mx: "auto", mt: 6, mb: 6, p: 4, borderRadius: 4, boxShadow: "0 12px 48px rgba(102,126,234,0.12)", background: "#fff", position: "relative" }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Health Check Campaign Workflow
                    </Typography>
                    <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "space-between" }}>
                        {statusOrder.map((status) => (
                            <Box key={status} sx={{ flex: 1, minWidth: 280, maxWidth: 340, display: "flex", flexDirection: "column" }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#764ba2' }}>{statusLabels[status]}</Typography>
                                <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>{statusDescriptions[status]}</Typography>
                                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                                    {steps.find((s) => s.label.toUpperCase().includes(statusLabels[status].toUpperCase())).campaigns.length === 0 ? (
                                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                                            No campaigns in this stage
                                        </Alert>
                                    ) : (
                                        steps.find((s) => s.label.toUpperCase().includes(statusLabels[status].toUpperCase())).campaigns.map((campaign) => (
                                            <Card
                                                key={campaign.campaignId}
                                                sx={cardSx}
                                                onClick={() => setSelectedCampaign(campaign) || setDialogOpen(true)}
                                            >
                                                <CardContent>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                                            {campaign.title}
                                                        </Typography>
                                                        <Chip
                                                            label={statusLabels[campaign.statusHealthCampaign]}
                                                            color={statusColors[campaign.statusHealthCampaign]}
                                                            size="small"
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Description:</strong> {campaign.description}</Typography>
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Address:</strong> {campaign.address}</Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        <Typography variant="body2"><strong>Start Date:</strong> {formatDate(campaign.startExaminationDate)}</Typography>
                                                        <Typography variant="body2"><strong>End Date:</strong> {formatDate(campaign.endExaminationDate)}</Typography>
                                                        <Typography variant="body2"><strong>Deadline:</strong> {formatDate(campaign.deadlineDate)}</Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Paper>
            </Fade>

            {/* Campaign Details Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: "rgba(255,255,255,0.97)",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                    },
                }}
            >
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 700, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Health Check Campaign Details
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedCampaign && (
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3, py: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Description</Typography>
                                <Typography variant="body2">{selectedCampaign.description}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Address</Typography>
                                <Typography variant="body2">{selectedCampaign.address}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Status</Typography>
                                <Chip label={selectedCampaign.statusHealthCampaign} color={getStatusColor(selectedCampaign.statusHealthCampaign)} size="small" />
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Start Date</Typography>
                                <Typography variant="body2">{formatDate(selectedCampaign.startExaminationDate)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>End Date</Typography>
                                <Typography variant="body2">{formatDate(selectedCampaign.endExaminationDate)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Deadline</Typography>
                                <Typography variant="body2">{formatDate(selectedCampaign.deadlineDate)}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
                    {selectedCampaign && (
                        <>
                            {canUpdateToProgress(selectedCampaign) && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleStatusUpdate(selectedCampaign, "IN_PROGRESS")}
                                    disabled={isUpdating}
                                    sx={{ borderRadius: 2, textTransform: "none" }}
                                >
                                    {isUpdating ? <CircularProgress size={20} /> : "Start Campaign"}
                                </Button>
                            )}
                            {canUpdateToPending(selectedCampaign) && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleStatusUpdate(selectedCampaign, "PUBLISHED")}
                                    disabled={isUpdating}
                                    sx={{ borderRadius: 2, textTransform: "none" }}
                                >
                                    {isUpdating ? <CircularProgress size={20} /> : "Publish Campaign"}
                                </Button>
                            )}
                            {selectedCampaign.statusHealthCampaign === "PUBLISHED" && (
                                <Alert severity="warning" sx={{ borderRadius: 2, mt: 2 }}>
                                    Cannot start: There is already a campaign in progress
                                </Alert>
                            )}
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Floating Action Button for Create New Campaign */}
            <Fab color="primary" aria-label="add" sx={fabSx} onClick={() => setCreateFormOpen(true)}>
                <AddIcon />
            </Fab>

            {/* Create Campaign Dialog */}
            <Dialog
                open={createFormOpen}
                onClose={() => setCreateFormOpen(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: "rgba(255,255,255,0.97)",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Create New Health Check Campaign
                </DialogTitle>
                <DialogContent>
                    <HealthCheckCampaignForm
                        onSuccess={() => {
                            setCreateFormOpen(false)
                            window.location.reload()
                        }}
                        onCancel={() => setCreateFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default NewHealthCheckCampaign

