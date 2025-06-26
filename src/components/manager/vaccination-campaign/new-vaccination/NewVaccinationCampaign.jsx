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
import { useNewestCampaignByStatus } from "../../../../hooks/manager/vaccination/create-new-campaign/useGetNewestCampaingByStatus"
import { useUpdateNewCampaign } from "../../../../hooks/manager/vaccination/create-new-campaign/useUpdateNewCampaign"
import VaccineCampaignForm from "./components/VaccineCampaignForm"
import "./StyleNewVaccinationCampaign.scss"

const NewVaccinationCampaign = () => {
    const { allCampaigns, isLoading } = useNewestCampaignByStatus()
    const { updateNewCampaign, isLoading: isUpdating } = useUpdateNewCampaign()
    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [createFormOpen, setCreateFormOpen] = useState(false)
    const [activeStep, setActiveStep] = useState(0)

    // Filter campaigns by status
    const pendingCampaigns = allCampaigns.filter((c) => c.status === "PENDING")
    const inProgressCampaigns = allCampaigns.filter((c) => c.status === "IN_PROGRESS")
    const completedCampaigns = allCampaigns.filter((c) => c.status === "COMPLETED")

    const steps = [
        {
            label: "Pending Campaigns",
            description: "Select a campaign to start",
            campaigns: pendingCampaigns,
            nextStatus: "IN_PROGRESS",
            actionLabel: "Start Campaign",
        },
        {
            label: "In Progress Campaigns",
            description: "Active vaccination campaigns",
            campaigns: inProgressCampaigns,
            nextStatus: "COMPLETED",
            actionLabel: "Complete Campaign",
        },
        {
            label: "Completed Campaigns",
            description: "Finished vaccination campaigns",
            campaigns: completedCampaigns,
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
            await updateNewCampaign(campaign.campaignId, newStatus)
            setDialogOpen(false)
            // Refresh data
            window.location.reload()
        } catch (error) {
            console.error("Failed to update campaign status:", error)
            alert("Failed to update campaign status")
        }
    }

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

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "warning"
            case "IN_PROGRESS":
                return "info"
            case "COMPLETED":
                return "success"
            default:
                return "default"
        }
    }

    const canUpdateToInProgress = (campaign) => {
        return campaign.status === "PENDING" && inProgressCampaigns.length === 0
    }

    const canUpdateToCompleted = (campaign) => {
        return campaign.status === "IN_PROGRESS"
    }

    if (isLoading) {
        return (
            <Box className="loading-container">
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box className="vaccination-workflow-container">
            <Typography variant="h4" className="workflow-title">
                Vaccination Campaign Workflow
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
                                                        {campaign.titleCampaign}
                                                    </Typography>
                                                    <Chip
                                                        label={campaign.status}
                                                        color={getStatusColor(campaign.status)}
                                                        size="small"
                                                        className="status-chip"
                                                    />
                                                </Box>
                                                <Typography variant="body2" className="campaign-description">
                                                    <strong>Disease:</strong> {campaign.diseaseName}
                                                </Typography>
                                                <Typography variant="body2" className="campaign-description">
                                                    <strong>Vaccine:</strong> {campaign.vaccineName}
                                                </Typography>
                                                <div className="campaign-details">
                                                    <Typography variant="body2">
                                                        <strong>Start Date:</strong> {formatDate(campaign.startDate)}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>End Date:</strong> {formatDate(campaign.endDate)}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Form Deadline:</strong> {formatDate(campaign.formDeadline)}
                                                    </Typography>
                                                    {campaign.notes && (
                                                        <Typography variant="body2">
                                                            <strong>Notes:</strong> {campaign.notes}
                                                        </Typography>
                                                    )}
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
                        Vaccination Campaign Details
                    </Typography>
                </DialogTitle>
                <DialogContent className="dialog-content">
                    {selectedCampaign && (
                        <Box className="campaign-details-container">
                            <Typography variant="h6" className="selected-campaign-title">
                                {selectedCampaign.titleCampaign}
                            </Typography>

                            <Box className="details-grid">
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        Disease
                                    </Typography>
                                    <Typography variant="body2">{selectedCampaign.diseaseName}</Typography>
                                </Box>
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        Vaccine
                                    </Typography>
                                    <Typography variant="body2">{selectedCampaign.vaccineName}</Typography>
                                </Box>
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        Status
                                    </Typography>
                                    <Chip label={selectedCampaign.status} color={getStatusColor(selectedCampaign.status)} size="small" />
                                </Box>
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        Active
                                    </Typography>
                                    <Typography variant="body2">{selectedCampaign.active ? "Yes" : "No"}</Typography>
                                </Box>
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        Start Date
                                    </Typography>
                                    <Typography variant="body2">{formatDate(selectedCampaign.startDate)}</Typography>
                                </Box>
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        End Date
                                    </Typography>
                                    <Typography variant="body2">{formatDate(selectedCampaign.endDate)}</Typography>
                                </Box>
                                <Box className="detail-item">
                                    <Typography variant="subtitle2" className="detail-label">
                                        Form Deadline
                                    </Typography>
                                    <Typography variant="body2">{formatDate(selectedCampaign.formDeadline)}</Typography>
                                </Box>
                                {selectedCampaign.notes && (
                                    <Box className="detail-item" style={{ gridColumn: "1 / -1" }}>
                                        <Typography variant="subtitle2" className="detail-label">
                                            Notes
                                        </Typography>
                                        <Typography variant="body2">{selectedCampaign.notes}</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    {selectedCampaign && (
                        <>
                            {canUpdateToInProgress(selectedCampaign) && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleStatusUpdate(selectedCampaign, "IN_PROGRESS")}
                                    disabled={isUpdating}
                                    className="action-button"
                                >
                                    {isUpdating ? <CircularProgress size={20} /> : "Start Campaign"}
                                </Button>
                            )}
                            {canUpdateToCompleted(selectedCampaign) && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleStatusUpdate(selectedCampaign, "COMPLETED")}
                                    disabled={isUpdating}
                                    className="action-button"
                                >
                                    {isUpdating ? <CircularProgress size={20} /> : "Complete Campaign"}
                                </Button>
                            )}
                            {selectedCampaign.status === "PENDING" && inProgressCampaigns.length > 0 && (
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
                maxWidth="lg"
                fullWidth
                className="create-dialog"
            >
                <DialogTitle>Create New Vaccination Campaign</DialogTitle>
                <DialogContent>
                    <VaccineCampaignForm
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

export default NewVaccinationCampaign
