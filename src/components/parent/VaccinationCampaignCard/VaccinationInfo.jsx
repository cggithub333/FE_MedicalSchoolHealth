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
          <Grid item xs={6}><strong>Campaign name:</strong></Grid>
          <Grid item xs={6}>{latestVaccinationCampaign.name}</Grid>

          <Grid item xs={6}><strong>Status:</strong></Grid>
          <Grid item xs={6}>{latestVaccinationCampaign.status}</Grid>

          <Grid item xs={6}><strong>Date:</strong></Grid>
          <Grid item xs={6}>{latestVaccinationCampaign.startDate}</Grid>

          <Grid item xs={6}><strong>Consent Deadline:</strong></Grid>
          <Grid item xs={6}>{latestVaccinationCampaign.consentDeadline}</Grid>
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
            <Grid item xs={6}>{latestVaccinationCampaign.disease.name}</Grid>
          </Grid>

          <Grid container size={{ xs: 12 }}>
            <Grid item xs={6}><strong>Description:</strong></Grid>
            <Grid item xs={6}>{latestVaccinationCampaign.disease.description}</Grid>
          </Grid>

          <Grid container size={{ xs: 12 }}>
            <Grid item><strong>Dose Required:</strong></Grid>
            <Grid item>{latestVaccinationCampaign.disease.doseRequired} doses</Grid>
          </Grid>
          
          <Grid container size={{ xs: 12 }}>
            <Grid item><strong>Vaccine Name:</strong></Grid>
            <Grid item>{latestVaccinationCampaign.vaccine.name}</Grid>
          </Grid>
          
          <Grid container size={{ xs: 12 }}>
            <Grid item><strong>Manufacturer:</strong></Grid>
            <Grid item>{latestVaccinationCampaign.vaccine.manufacturer}</Grid>
          </Grid>
          
          <Grid container size={{ xs: 12 }}> 
            <Grid item><strong>Recommended Age:</strong></Grid>
            <Grid item>{latestVaccinationCampaign.vaccine.recommendedAge}</Grid>
          </Grid>
          
          <Grid container size={{ xs: 12 }}>
            <Grid item><strong>Vaccine Type:</strong></Grid>
            <Grid item>{latestVaccinationCampaign.vaccine.description}</Grid>
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
          {latestVaccinationCampaign.notes.map((note, idx) => (
            <ListItem key={idx} disableGutters>
              <ListItemIcon sx={{ minWidth: '30px' }}>•</ListItemIcon>
              <ListItemText primary={note} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}