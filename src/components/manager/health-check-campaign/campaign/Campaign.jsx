import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useAllCampaign } from '../../../../hooks/manager/healthcheck/campaign/useAllCampaignByStatus'
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
    const { allCampaigns, isLoading, error } = useAllCampaign();
    const [open, setOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [year, setYear] = useState('all');
    const currentYear = new Date().getFullYear();

    // Collect all years from campaigns for dropdown (using created_at year)
    const allYears = React.useMemo(() => {
        const campaigns = allCampaigns.getallcampaign || allCampaigns;
        const years = campaigns.map(c => new Date(c.created_at).getFullYear());
        return Array.from(new Set(years)).sort((a, b) => b - a);
    }, [allCampaigns]);

    // Filter campaigns by year (no hook)
    const campaigns = React.useMemo(() => {
        const list = allCampaigns.getallcampaign || allCampaigns;
        if (year === 'all') return list;
        return list.filter(c => new Date(c.created_at).getFullYear() === Number(year));
    }, [allCampaigns, year]);
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
                    Health Check Campaigns
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
                        key={campaign.id}
                        className="campaign-card"
                        onClick={() => handleCardClick(campaign)}
                        style={{ cursor: 'pointer', width: 340, minWidth: 340, maxWidth: 340 }}
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
                            <Typography variant="body2"><strong>Status:</strong> {selectedCampaign.status}</Typography>
                            <Typography variant="body2"><strong>Active:</strong> {selectedCampaign.isActive ? 'Yes' : 'No'}</Typography>
                            <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                                Created at: {new Date(selectedCampaign.created_at).toLocaleString()}
                            </Typography>
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
