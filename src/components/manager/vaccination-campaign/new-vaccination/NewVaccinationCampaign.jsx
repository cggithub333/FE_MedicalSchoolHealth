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
import { useNewestCampaignByStatus } from "@hooks/manager/vaccination/create-new-campaign/useGetNewestCampaingByStatus"
import { useUpdateNewCampaign } from "@hooks/manager/vaccination/create-new-campaign/useUpdateNewCampaign"
import VaccineCampaignForm from "./vaccination-campaign-form/VaccineCampaignForm"
import { usePublishVaccinationCampaign } from "@hooks/manager/vaccination/create-new-campaign/usePublishVaccinationCampaign"
import { showErrorToast } from "@utils/toast-utils"
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
    COMPLETED: "success",
};

function getStatusColor(status) {
    return statusColors[status] || "default";
}

const NewVaccinationCampaign = () => {
    const { allCampaigns, isLoading, refetch } = useNewestCampaignByStatus()
    const { updateNewCampaign, isLoading: isUpdating } = useUpdateNewCampaign()
    const { publishCampaign, isPublishing } = usePublishVaccinationCampaign();
    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [createFormOpen, setCreateFormOpen] = useState(false)

    const statusOrder = [
        "PENDING",
        "PUBLISHED",
        "IN_PROGRESS",
    ]
    const statusLabels = {
        PENDING: "Pending",
        PUBLISHED: "Published",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
    }
    const statusDescriptions = {
        PENDING: "Campaigns waiting to be published.",
        PUBLISHED: "Campaigns ready to start.",
        IN_PROGRESS: "Active vaccination campaigns.",
        COMPLETED: "Finished vaccination campaigns.",
    }

    const getCampaignsByStatus = (status) => allCampaigns.filter((c) => c.status === status)

    const canPublish = () =>
        getCampaignsByStatus("PUBLISHED").length === 0 && getCampaignsByStatus("IN_PROGRESS").length === 0
    const canStart = () => getCampaignsByStatus("IN_PROGRESS").length === 0

    const handleCampaignClick = (campaign) => {
        setSelectedCampaign(campaign)
        setDialogOpen(true)
    }

    const handleStatusUpdate = async (campaign, newStatus) => {
        try {
            await updateNewCampaign(campaign.campaignId, newStatus)
            setDialogOpen(false)
            // Refresh data
            refetch && refetch()
        } catch (error) {
            console.error("Failed to update campaign status:", error)
            showErrorToast("Failed to update campaign status")
        }
    }

    const handleDelete = async (campaignId) => {
        if (window.confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
            const success = await deleteCampaign(campaignId)
            if (success) {
                setDialogOpen(false)
                setCreateFormOpen(false)
                refetch && refetch()
            } else {
                showErrorToast("Failed to delete campaign.")
            }
        }
    }

    const handlePublish = async (campaign) => {
        try {
            await publishCampaign(campaign.campaignId);
            setDialogOpen(false);
            refetch && refetch();
        } catch (error) {
            console.error("Failed to publish campaign:", error);
            showErrorToast("Failed to publish campaign");
        }
    };

    const formatDate = (dateString) => {
        // Handle different date formats from API
        if (!dateString) return "N/A"

        // If it's in DD-MM-YYYY format, convert it
        if (dateString.includes("-") && dateString.split("-")[0].length === 2) {
            const [day, month, year] = dateString.split("-")
            return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
        }

        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
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
                        Vaccination Campaign
                    </Typography>
                    <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "space-between" }}>
                        {statusOrder.map((status) => (
                            <Box key={status} sx={{ flex: 1, minWidth: 280, maxWidth: 340, display: "flex", flexDirection: "column" }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#764ba2' }}>{statusLabels[status]}</Typography>
                                <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>{statusDescriptions[status]}</Typography>
                                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                                    {getCampaignsByStatus(status).length === 0 ? (
                                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                                            No campaigns in this stage
                                        </Alert>
                                    ) : (
                                        getCampaignsByStatus(status).map((campaign) => (
                                            <Card
                                                key={status + '-' + campaign.campaignId}
                                                sx={{ ...cardSx, cursor: status === "COMPLETED" ? "default" : "pointer" }}
                                                onClick={() => {
                                                    if (status !== "COMPLETED") {
                                                        setSelectedCampaign(campaign);
                                                        setDialogOpen(true);
                                                    }
                                                }}
                                            >
                                                <CardContent>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                                            {campaign.titleCampaign}
                                                        </Typography>
                                                        <Chip
                                                            label={statusLabels[campaign.status]}
                                                            color={statusColors[campaign.status]}
                                                            size="small"
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Disease:</strong> {campaign.diseaseName}</Typography>
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Vaccine:</strong> {campaign.vaccineName}</Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        <Typography variant="body2"><strong>Start Date:</strong> {formatDate(campaign.startDate)}</Typography>
                                                        <Typography variant="body2"><strong>End Date:</strong> {formatDate(campaign.endDate)}</Typography>
                                                        <Typography variant="body2"><strong>Form Deadline:</strong> {formatDate(campaign.formDeadline)}</Typography>
                                                        {campaign.notes && (
                                                            <Typography variant="body2" sx={{ mt: 0.5 }}><strong>Notes:</strong> {campaign.notes}</Typography>
                                                        )}
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
                        Vaccination Campaign Details
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedCampaign && (
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3, py: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Disease</Typography>
                                <Typography variant="body2">{selectedCampaign.diseaseName}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Vaccine</Typography>
                                <Typography variant="body2">{selectedCampaign.vaccineName}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Status</Typography>
                                <Chip label={selectedCampaign.status} color={getStatusColor(selectedCampaign.status)} size="small" />
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Active</Typography>
                                <Typography variant="body2">{selectedCampaign.active ? "Yes" : "No"}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Start Date</Typography>
                                <Typography variant="body2">{formatDate(selectedCampaign.startDate)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>End Date</Typography>
                                <Typography variant="body2">{formatDate(selectedCampaign.endDate)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Form Deadline</Typography>
                                <Typography variant="body2">{formatDate(selectedCampaign.formDeadline)}</Typography>
                            </Box>
                            {selectedCampaign.notes && (
                                <Box sx={{ gridColumn: "1 / -1" }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Notes</Typography>
                                    <Typography variant="body2">{selectedCampaign.notes}</Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, textTransform: "none" }}>Cancel</Button>
                    {selectedCampaign && (
                        <>
                            {selectedCampaign.status === "PENDING" && canPublish() && (
                                <>

                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handlePublish(selectedCampaign)}
                                        disabled={isPublishing}
                                        sx={{ borderRadius: 2, textTransform: "none" }}
                                    >
                                        {isPublishing ? <CircularProgress size={20} /> : "Publish Campaign"}
                                    </Button>
                                </>
                            )}
                            {selectedCampaign.status === "PUBLISHED" && (
                                <>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleStatusUpdate(selectedCampaign, "IN_PROGRESS")}
                                        disabled={isUpdating}
                                        sx={{ borderRadius: 2, textTransform: "none" }}
                                    >
                                        {isUpdating ? <CircularProgress size={20} /> : "Start Campaign"}
                                    </Button>
                                </>
                            )}
                            {selectedCampaign.status === "IN_PROGRESS" && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleStatusUpdate(selectedCampaign, "COMPLETED")}
                                        disabled={isUpdating}
                                        sx={{ borderRadius: 2, textTransform: "none" }}
                                    >
                                        {isUpdating ? <CircularProgress size={20} /> : "Complete Campaign"}
                                    </Button>
                                </>
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
                    Create New Vaccination Campaign
                </DialogTitle>
                <DialogContent>
                    <VaccineCampaignForm
                        onSuccess={() => {
                            setCreateFormOpen(false)
                            refetch && refetch()
                        }}
                        onCancel={() => setCreateFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default NewVaccinationCampaign
