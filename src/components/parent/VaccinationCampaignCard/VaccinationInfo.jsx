import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ChecklistIcon from '@mui/icons-material/Checklist';

export default function VaccinationInfoCard({ latestVaccinationCampaign }) {

  let campaignInfor = null;
  if (latestVaccinationCampaign && latestVaccinationCampaign.campaign) {
    campaignInfor = latestVaccinationCampaign.campaign;
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 5, px: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        School Vaccination Campaign
      </Typography>

      {/* Campaign Overview */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
        <Grid container alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Grid item>
            <LocalHospitalIcon sx={{ color: 'success.main' }} />
          </Grid>
          <Grid item>
            <Typography variant="h6">Campaign Overview</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item size={{ xs: 12 }} display={"flex"} gap={1}>
            <span><strong>Campaign name:</strong></span>
            <span>{campaignInfor?.disease?.name}</span>
          </Grid>

          {/* <Grid item xs={6}><strong>Status:</strong></Grid>
          <Grid item xs={6}>{campaignInfor?.campaignStatus}</Grid> */}

          <Grid item size={{ xs: 12}} display={"flex"} gap={1}>
            <span><strong>Date:</strong></span>
            <span>{campaignInfor?.startDate}</span>
          </Grid>

          <Grid item size={{ xs: 12}} display={"flex"} gap={1}>
            <span><strong>Consent Deadline:</strong></span>
            <span>{campaignInfor?.consentFormDeadline}</span>
          </Grid>
        </Grid>
      </Paper>

      {/* Vaccine Details */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
        <Grid container alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Grid item>
            <VaccinesIcon sx={{ color: 'primary.main' }} />
          </Grid>
          <Grid item>
            <Typography variant="h6">Vaccine Details</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid container size={{ xs: 12 }}>
            <Grid item xs={6}><strong>Disease:</strong></Grid>
            <Grid item xs={6}>{campaignInfor?.disease?.name}</Grid>
          </Grid>

          <Grid container size={{ xs: 12 }}>
            <Grid item xs={6}><strong>Description:</strong></Grid>
            <Grid item xs={6}>{campaignInfor?.disease?.description}</Grid>
          </Grid>

          <Grid container size={{ xs: 12 }}>
            <Grid item><strong>Dose Required:</strong></Grid>
            <Grid item>{campaignInfor?.disease?.doseRequired} doses</Grid>
          </Grid>
          
          <Grid container size={{ xs: 12 }}>
            <Grid item><strong>Vaccine Name:</strong></Grid>
            <Grid item>{campaignInfor?.vaccine?.name}</Grid>
          </Grid>
          
          <Grid container size={{ xs: 12 }}>
            <Grid item><strong>Manufacturer:</strong></Grid>
            <Grid item>{campaignInfor?.vaccine?.manufacturer}</Grid>
          </Grid>
          
          <Grid container size={{ xs: 12 }}> 
            <Grid item><strong>Recommended Age:</strong></Grid>
            <Grid item>{campaignInfor?.vaccine?.recommendedAge}</Grid>
          </Grid>
          
          <Grid container size={{ xs: 12 }}>
            <Grid item><strong>Vaccine Type:</strong></Grid>
            <Grid item>{campaignInfor?.vaccine?.description}</Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Important Notes */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <Grid container alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Grid item>
            <ChecklistIcon sx={{ color: 'orange' }} />
          </Grid>
          <Grid item>
            <Typography variant="h6">Important Notes</Typography>
          </Grid>
        </Grid>
        <List dense>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: '30px' }}>•</ListItemIcon>
            <ListItemText primary={campaignInfor?.notes} />
            </ListItem>
        </List>
      </Paper>
    </Box>
  );
}