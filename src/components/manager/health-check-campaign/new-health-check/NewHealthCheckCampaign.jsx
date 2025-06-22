import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import usePendingCampaign from '../../../../hooks/manager/usePendingCampaignByStatus';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';


const NewHealthCheckCampaign = () => {
    const { pendingCampaign, isLoading } = usePendingCampaign();
    const [open, setOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    // Only show campaigns with status === 'Pending'
    const filteredPendingCampaigns = pendingCampaign.filter(c => c.status === 'Pending');

    const handleCardClick = (campaign) => {
        setSelectedCampaign(campaign);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedCampaign(null);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    if (!filteredPendingCampaigns || filteredPendingCampaigns.length === 0) {
        return (
            <Box textAlign="center" mt={4}>
                No campaigns found.
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                    Health Check Campaigns
                </Typography>
            </Box>
            <Box
                display="flex"
                flexWrap="wrap"
                gap={3}
                justifyContent="center"
                className={open ? 'blurred-cards' : ''}
                style={open ? { filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none' } : {}}
            >
                {filteredPendingCampaigns.map((campaign) => (
                    <Card
                        key={campaign.id}
                        className="campaign-card"
                        onClick={() => handleCardClick(campaign)}
                        style={{ cursor: 'pointer', width: 360, minWidth: 360, maxWidth: 360 }}
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
            {/* Dialog for campaign details form */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Campaign Details</DialogTitle>
                <DialogContent>
                    {selectedCampaign && (
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <Typography variant="body1"><strong>Description:</strong> {selectedCampaign.description}</Typography>
                            <Typography variant="body2"><strong>Address:</strong> {selectedCampaign.address}</Typography>
                            <Typography variant="body2"><strong>Start:</strong> {new Date(selectedCampaign.startExaminationDate).toLocaleString()}</Typography>
                            <Typography variant="body2"><strong>End:</strong> {new Date(selectedCampaign.endExaminationDate).toLocaleString()}</Typography>
                            <Typography variant="body2"><strong>Deadline:</strong> {new Date(selectedCampaign.deadlineDate).toLocaleString()}</Typography>
                            <Typography variant="body2"><strong>Active:</strong> {selectedCampaign.isActive ? 'Yes' : 'No'}</Typography>
                            <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                                Created at: {new Date(selectedCampaign.created_at).toLocaleString()}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">Publish</Button>
                    <Button onClick={handleClose} variant="contained" color="secondary">update</Button>
                    <Button onClick={handleClose} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NewHealthCheckCampaign;
