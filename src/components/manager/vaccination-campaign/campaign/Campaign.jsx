import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useAllCampaignByStatus } from '../../../../hooks/manager/vaccination/useAllCampaignByStatus';
import { useAllCampaignByYear } from '../../../../hooks/manager/vaccination/useAllCampaignByYear';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';


const AllCampaign = () => {
    const { allCampaigns, isLoading, error } = useAllCampaignByStatus();
    const [open, setOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [year, setYear] = useState('all');
    const currentYear = new Date().getFullYear();

    // Collect all years from campaigns for dropdown (using endDate year)
    const allYears = React.useMemo(() => {
        const campaigns = allCampaigns.getallcampaign || allCampaigns;
        const years = campaigns.map(c => new Date(c.endDate).getFullYear());
        return Array.from(new Set(years)).sort((a, b) => b - a);
    }, [allCampaigns]);

    // Get campaigns by year if filtered, else all (compare with endDate year)
    const { campaigns: campaignsByYear, isLoading: isLoadingByYear, error: errorByYear } = useAllCampaignByYear(year !== 'all' ? year : null);
    const campaigns = year === 'all'
        ? (allCampaigns.getallcampaign || allCampaigns)
        : (allCampaigns.getallcampaign || allCampaigns).filter(c => new Date(c.endDate).getFullYear() === Number(year));
    const loading = isLoading;
    const err = error;

    const handleCardClick = (campaign) => {
        setSelectedCampaign(campaign);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedCampaign(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    if (err) {
        return (
            <Box color="error.main" textAlign="center" mt={4}>
                Error: {err}
            </Box>
        );
    }

    if (!campaigns || campaigns.length === 0) {
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
                    Vaccination Campaigns
                </Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="year-filter-label">Year</InputLabel>
                    <Select
                        labelId="year-filter-label"
                        value={year}
                        label="Year"
                        onChange={e => setYear(e.target.value)}
                    >
                        <MenuItem value="all">All</MenuItem>
                        {allYears.map(y => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box
                display="flex"
                flexWrap="wrap"
                gap={3}
                justifyContent="center"
                className={open ? 'blurred-cards' : ''}
                style={open ? { filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none' } : {}}
            >
                {campaigns.map((campaign) => (
                    <Card
                        key={campaign.campaignId}
                        className="campaign-card"
                        onClick={() => handleCardClick(campaign)}
                        style={{ cursor: 'pointer', width: 340, minWidth: 340, maxWidth: 340, height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                        <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Typography variant="h6" color="primary" gutterBottom>
                                {campaign.vaccineName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Disease:</strong> {campaign.diseaseName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Start:</strong> {new Date(campaign.startDate).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>End:</strong> {new Date(campaign.endDate).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Stop:</strong> {new Date(campaign.stopDate).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Status:</strong> {campaign.status}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Notes:</strong> {campaign.notes}
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
                            <Typography variant="body1"><strong>Vaccine:</strong> {selectedCampaign.vaccineName}</Typography>
                            <Typography variant="body2"><strong>Disease:</strong> {selectedCampaign.diseaseName}</Typography>
                            <Typography variant="body2"><strong>Start:</strong> {new Date(selectedCampaign.startDate).toLocaleString()}</Typography>
                            <Typography variant="body2"><strong>End:</strong> {new Date(selectedCampaign.endDate).toLocaleString()}</Typography>
                            <Typography variant="body2"><strong>Stop:</strong> {new Date(selectedCampaign.stopDate).toLocaleString()}</Typography>
                            <Typography variant="body2"><strong>Status:</strong> {selectedCampaign.status}</Typography>
                            <Typography variant="body2"><strong>Notes:</strong> {selectedCampaign.notes}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AllCampaign;
