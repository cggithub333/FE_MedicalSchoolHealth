import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import useNewestVaccinationCampaign from '../../../../hooks/schoolnurse/vaccination/useNewestCampaignByStatus';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import VaccineCampaignForm from './vaccination-campaign-form/VaccineCampaignForm';

const NewVaccinationCampaign = () => {
    const { newestVaccinationCampaign = [], isLoading } = useNewestVaccinationCampaign();
    const [open, setOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Flatten and map the campaign data from the custom hook
    const campaigns = Array.isArray(newestVaccinationCampaign)
        ? newestVaccinationCampaign.map(item => item.campaign)
        : [];

    const filteredNewestCampaigns = campaigns.filter(c => c.status === 'Pending' || c.status === 'Published');

    const handleCardClick = (campaign) => {
        setSelectedCampaign(campaign);
        setOpen(true);
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

    if (!filteredNewestCampaigns.length) {
        return (
            <Box textAlign="center" mt={4}>
                No campaigns found.
            </Box>
        );
    }

    return (
        <Box p={3} sx={{ position: 'relative' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                    Vaccination Campaigns
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
                        key={campaign.campaignId}
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
                                {campaign.disease?.name} ({campaign.vaccine?.name})
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Disease:</strong> {campaign.disease?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Vaccine:</strong> {campaign.vaccine?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Manufacturer:</strong> {campaign.vaccine?.manufacturer}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Recommended Age:</strong> {campaign.vaccine?.recommendedAge}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Notes:</strong> {campaign.notes}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Consent Form Deadline:</strong> {new Date(campaign.consentFormDeadline).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Start:</strong> {new Date(campaign.startDate).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>End:</strong> {new Date(campaign.endDate).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Status:</strong> {campaign.status}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Campaign Status:</strong> {campaign.campaignStatus}
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
                                {selectedCampaign.disease?.name} ({selectedCampaign.vaccine?.name})
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Disease:</strong> {selectedCampaign.disease?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Vaccine:</strong> {selectedCampaign.vaccine?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Manufacturer:</strong> {selectedCampaign.vaccine?.manufacturer}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Recommended Age:</strong> {selectedCampaign.vaccine?.recommendedAge}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Notes:</strong> {selectedCampaign.notes}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Consent Form Deadline:</strong> {new Date(selectedCampaign.consentFormDeadline).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Start:</strong> {new Date(selectedCampaign.startDate).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>End:</strong> {new Date(selectedCampaign.endDate).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Status:</strong> {selectedCampaign.status}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Campaign Status:</strong> {selectedCampaign.campaignStatus}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ background: "#f8fafc" }}>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        Publish
                    </Button>
                    <Button onClick={handleClose} variant="contained" color="secondary">
                        Update
                    </Button>
                    <Button onClick={handleClose} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showAddForm} onClose={handleAddFormClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Vaccination Campaign</DialogTitle>
                <DialogContent>
                    <VaccineCampaignForm onSuccess={handleAddFormClose} onCancel={handleAddFormClose} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default NewVaccinationCampaign;