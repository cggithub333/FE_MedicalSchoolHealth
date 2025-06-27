import { useState } from "react"
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Chip,
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

    // Filter campaigns by status
    const pendingCampaigns = newestCampaign.filter((c) => c.statusHealthCampaign === "PENDING")
    const publishedCampaigns = newestCampaign.filter((c) => c.statusHealthCampaign === "PUBLISHED")
    const inProgressCampaigns = newestCampaign.filter((c) => c.statusHealthCampaign === "IN_PROGRESS")

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

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "warning"
            case "PUBLISHED":
                return "info"
            case "IN_PROGRESS":
                return "success"
            default:
                return "default"
        }
    }

    const canUpdateToPending = (campaign) => {
        return campaign.statusHealthCampaign === "PENDING" && publishedCampaigns.length === 0
    }

    const canUpdateToProgress = (campaign) => {
        return campaign.statusHealthCampaign === "PUBLISHED" && inProgressCampaigns.length === 0
    }

    if (isLoading) {
        return (
            <Box className="loading-container">
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box className="workflow-container">
            <Typography variant="h4" className="workflow-title">
                Health Check Campaign Workflow
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical" className="workflow-stepper">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel>
                            <Typography variant="h6" className="step-label">
                                {step.label}
                            </Typography>
                        </StepLabel>
                        <StepContent>
                            <Typography variant="body2" className="step-description">
                                {step.description}
                            </Typography>

                            {step.campaigns.length === 0 ? (
                                <Alert severity="info" className="no-campaigns-alert">
                                    No campaigns in this stage
                                </Alert>
                            ) : (
                                <Box className="campaigns-container">
                                    {step.campaigns.map((campaign) => (
                                        <Card
                                            key={campaign.campaignId}
                                            className={`campaign-card ${step.nextStatus ? "clickable" : ""}`}
                                            onClick={() => step.nextStatus && handleCampaignClick(campaign)}
                                        >
                                            <CardContent>
                                                <Box className="campaign-header">
                                                    <Typography variant="h6" className="campaign-title">
                                                        {campaign.title}
                                                    </Typography>
                                                    <Chip
                                                        label={campaign.statusHealthCampaign}
                                                        color={getStatusColor(campaign.statusHealthCampaign)}
                                                        size="small"
                                                        className="status-chip"
                                                    />
                                                </Box>
                                                <Typography variant="body2" className="campaign-description">
                                                    {campaign.description}
                                                </Typography>
                                                <div className="campaign-details">
                                                    <Typography variant="body2">
                                                        <strong>Address:</strong> {campaign.address}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Deadline:</strong> {formatDate(campaign.deadlineDate)}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Examination:</strong> {formatDate(campaign.startExaminationDate)} -{" "}
                                                        {formatDate(campaign.endExaminationDate)}
                                                    </Typography>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            )}

                            {/* Step Navigation */}
                            <Box className="step-navigation">
                                <Button disabled={index === 0} onClick={() => setActiveStep(index - 1)} className="nav-button">
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setActiveStep(index + 1)}
                                    disabled={index === steps.length - 1}
                                    className="nav-button"
                                >
                                    Next
                                </Button>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>

            {/* Campaign Details Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
                className="campaign-dialog"
            >
                <DialogTitle>
                    <Typography variant="h6" className="dialog-title">
                        Campaign Details
                    </Typography>
                </DialogTitle>
                <DialogContent className="dialog-content">
                    {selectedCampaign && (
                        <Box className="campaign-details-container">
                            <Typography variant="h6" className="selected-campaign-title">
                                {selectedCampaign.title}
                            </Typography>
                            <Typography variant="body1" className="selected-campaign-description">
                                {selectedCampaign.description}
                            </Typography>

                            <Box className="details-grid">
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        Address
                                    </Typography>
                                    <Typography variant="body2">{selectedCampaign.address}</Typography>
                                </Box>
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        Status
                                    </Typography>
                                    <Chip
                                        label={selectedCampaign.statusHealthCampaign}
                                        color={getStatusColor(selectedCampaign.statusHealthCampaign)}
                                        size="small"
                                    />
                                </Box>
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        Deadline
                                    </Typography>
                                    <Typography variant="body2">{formatDate(selectedCampaign.deadlineDate)}</Typography>
                                </Box>
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        Created
                                    </Typography>
                                    <Typography variant="body2">{formatDate(selectedCampaign.createdAt)}</Typography>
                                </Box>
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        Start Date
                                    </Typography>
                                    <Typography variant="body2">{formatDate(selectedCampaign.startExaminationDate)}</Typography>
                                </Box>
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        End Date
                                    </Typography>
                                    <Typography variant="body2">{formatDate(selectedCampaign.endExaminationDate)}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    {selectedCampaign && (
                        <>
                            {canUpdateToPending(selectedCampaign) && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleStatusUpdate(selectedCampaign, "PUBLISHED")}
                                    disabled={isUpdating}
                                    className="action-button"
                                >
                                    {isUpdating ? <CircularProgress size={20} /> : "Publish Campaign"}
                                </Button>
                            )}
                            {canUpdateToProgress(selectedCampaign) && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleStatusUpdate(selectedCampaign, "IN_PROGRESS")}
                                    disabled={isUpdating}
                                    className="action-button"
                                >
                                    {isUpdating ? <CircularProgress size={20} /> : "Start Campaign"}
                                </Button>
                            )}
                            {selectedCampaign.statusHealthCampaign === "PENDING" && publishedCampaigns.length > 0 && (
                                <Alert severity="warning" className="warning-alert">
                                    Cannot publish: There is already a published campaign
                                </Alert>
                            )}
                            {selectedCampaign.statusHealthCampaign === "PUBLISHED" && inProgressCampaigns.length > 0 && (
                                <Alert severity="warning" className="warning-alert">
                                    Cannot start: There is already a campaign in progress
                                </Alert>
                            )}
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Floating Action Button for Create New Campaign */}
            <Fab color="primary" aria-label="add" className="create-fab" onClick={() => setCreateFormOpen(true)}>
                <AddIcon />
            </Fab>

            {/* Create Campaign Dialog */}
            <Dialog
                open={createFormOpen}
                onClose={() => setCreateFormOpen(false)}
                maxWidth="md"
                fullWidth
                className="create-dialog"
            >
                <DialogTitle>Create New Health Check Campaign</DialogTitle>
                <DialogContent>
                    <HealthCheckCampaignForm
                        onSuccess={() => {
                            setCreateFormOpen(false)
                            // Refresh the campaigns list
                            window.location.reload() // Or call a refetch function if available
                        }}
                        onCancel={() => setCreateFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default NewHealthCheckCampaign

