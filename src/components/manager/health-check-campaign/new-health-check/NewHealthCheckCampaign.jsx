import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import useNewestCampaign from '../../../../hooks/manager/useNewestCampaignByStatus';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import HealthCheckCampaignForm from '../new-health-check/health-check-campaign-form/HealthCheckCampaignForm';
import { updateStatusOfNewestCampaignAction } from '../../../../api/manager/manager-requests-action/newest-campaign-request-action';
const NewHealthCheckCampaign = () => {
    const { newestCampaign = [], isLoading } = useNewestCampaign();
    const [open, setOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [publishStatus, setPublishStatus] = useState(false);

    const filteredNewestCampaigns = Array.isArray(newestCampaign)
        ? newestCampaign.filter(c => c.status === 'Pending' || c.status === 'Published')
        : [];

    const handleCardClick = (campaign) => {
        setSelectedCampaign(campaign);
        setOpen(true);
    };
    const handlePublishButtonClick = () => {

        console.log(newestCampaign);

        try {
            // Call the publish API or function here
            if (newestCampaign && newestCampaign[0].status) {

                newestCampaign[0].status === "Pending" ? (updateStatusOfNewestCampaignAction(newestCampaign[0].id, "Published"))
                    : console.log("No status updated");

                alert(`Campaign with ID ${newestCampaign[0].id} has been published successfully!`);
                setPublishStatus(true);

                setOpen(false);
            }
        } catch (error) {
            console.error("Error publishing campaign:", error);
        }


    };
    const handleClose = () => {
        setOpen(false);
        setSelectedCampaign(null);
    };
    const handleAddFormClose = () => setShowAddForm(false);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    if (!filteredNewestCampaigns.length || publishStatus) {
        return (
            <Box p={3} sx={{ position: 'relative' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" color="primary.main" fontWeight={700}>
                        Health Check Campaigns
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => setShowAddForm(true)}
                        sx={{ fontWeight: 700, fontSize: 16, px: 3, py: 1.5 }}
                    >
                        + Add New Campaign
                    </Button>
                </Box>
                <Box textAlign="center" mt={4}>
                    No campaigns found.
                </Box>
            </Box>
        );
    }

    return (
        <>
            {!publishStatus && (
                <Box p={3} sx={{ position: 'relative' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" color="primary.main" fontWeight={700}>
                            Health Check Campaigns
                        </Typography>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => setShowAddForm(true)}
                            sx={{ fontWeight: 700, fontSize: 16, px: 3, py: 1.5 }}
                        >
                            + Add New Campaign
                        </Button>
                    </Box>
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        gap={3}
                        justifyContent="center"
                        className={open || showAddForm ? 'blurred-cards' : ''}
                        style={
                            open || showAddForm
                                ? { filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', transition: 'filter 0.3s' }
                                : {}
                        }
                    >
                        {filteredNewestCampaigns.map((campaign) => (
                            <Card
                                key={campaign.id}
                                className="campaign-card"
                                onClick={() => campaign.status === 'Pending' && handleCardClick(campaign)}
                                style={{
                                    cursor: campaign.status === 'Pending' ? 'pointer' : 'not-allowed',
                                    width: 360,
                                    minWidth: 360,
                                    maxWidth: 360,
                                    opacity: campaign.status === 'Published' ? 0.6 : 1,
                                    pointerEvents: campaign.status === 'Pending' ? 'auto' : 'none',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        {campaign.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Address:</strong> {campaign.address}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Start:</strong> {new Date(campaign.startExaminationDate).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>End:</strong> {new Date(campaign.endExaminationDate).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Deadline:</strong> {new Date(campaign.deadlineDate).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Status:</strong> {campaign.status}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Active:</strong> {campaign.isActive ? 'Yes' : 'No'}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                                        Created at: {new Date(campaign.created_at).toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                        <DialogTitle>
                            <Box display="flex" alignItems="center" gap={1}>
                                <span role="img" aria-label="campaign" style={{ fontSize: 28 }}>📋</span>
                                <Typography variant="h6" component="span" color="primary.main">
                                    Campaign Details
                                </Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers sx={{ background: "#f8fafc" }}>
                            {selectedCampaign && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        mt: 1,
                                        fontSize: 16,
                                    }}
                                >
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        {selectedCampaign.description}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
                                            <strong>Address:</strong>
                                        </Typography>
                                        <Typography variant="body2">{selectedCampaign.address}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
                                            <strong>Start:</strong>
                                        </Typography>
                                        <Typography variant="body2">{new Date(selectedCampaign.startExaminationDate).toLocaleString()}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
                                            <strong>End:</strong>
                                        </Typography>
                                        <Typography variant="body2">{new Date(selectedCampaign.endExaminationDate).toLocaleString()}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
                                            <strong>Deadline:</strong>
                                        </Typography>
                                        <Typography variant="body2">{new Date(selectedCampaign.deadlineDate).toLocaleString()}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
                                            <strong>Status:</strong>
                                        </Typography>
                                        <Typography variant="body2">{selectedCampaign.status}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
                                            <strong>Active:</strong>
                                        </Typography>
                                        <Typography variant="body2">{selectedCampaign.isActive ? 'Yes' : 'No'}</Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                                        Created at: {new Date(selectedCampaign.created_at).toLocaleString()}
                                    </Typography>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ background: "#f8fafc" }}>
                            <Button onClick={() => handlePublishButtonClick()} variant="contained" color="primary">
                                Publish
                            </Button>
                            <Button onClick={() => handleDeleteButtonClick()} variant="contained" color="error">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={showAddForm} onClose={handleAddFormClose} maxWidth="sm" fullWidth>
                        <DialogTitle>Add New Health Check Campaign</DialogTitle>
                        <DialogContent>
                            <HealthCheckCampaignForm onSuccess={handleAddFormClose} onCancel={handleAddFormClose} />
                        </DialogContent>
                    </Dialog>
                </Box>
            )
            }
        </>
    );
};

export default NewHealthCheckCampaign;