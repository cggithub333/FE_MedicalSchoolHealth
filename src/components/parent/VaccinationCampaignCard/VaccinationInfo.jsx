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

export default function VaccinationInfoCard({ campaign }) {

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
          <Grid item xs={6}>{campaign.name}</Grid>

          <Grid item xs={6}><strong>Status:</strong></Grid>
          <Grid item xs={6}>{campaign.status}</Grid>

          <Grid item xs={6}><strong>Date:</strong></Grid>
          <Grid item xs={6}>{campaign.startDate}</Grid>

          <Grid item xs={6}><strong>Consent Deadline:</strong></Grid>
          <Grid item xs={6}>{campaign.consentDeadline}</Grid>
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
            <Grid item xs={6}>{campaign.disease.name}</Grid>
          </Grid>

          <Grid container size={{ xs: 12 }}>
            <Grid item xs={6}><strong>Description:</strong></Grid>
            <Grid item xs={6}>{campaign.disease.description}</Grid>
          </Grid>

          <Grid container size={{ xs: 12 }}>
            <Grid item><strong>Dose Required:</strong></Grid>
            <Grid item>{campaign.disease.doseRequired} doses</Grid>
          </Grid>
          
          <Grid container size={{ xs: 12 }}>
            <Grid item><strong>Vaccine Name:</strong></Grid>
            <Grid item>{campaign.vaccine.name}</Grid>
          </Grid>
          
          <Grid container size={{ xs: 12 }}>
            <Grid item><strong>Manufacturer:</strong></Grid>
            <Grid item>{campaign.vaccine.manufacturer}</Grid>
          </Grid>
          
          <Grid container size={{ xs: 12 }}> 
            <Grid item><strong>Recommended Age:</strong></Grid>
            <Grid item>{campaign.vaccine.recommendedAge}</Grid>
          </Grid>
          
          <Grid container size={{ xs: 12 }}>
            <Grid item><strong>Vaccine Type:</strong></Grid>
            <Grid item>{campaign.vaccine.description}</Grid>
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
          {campaign.notes.map((note, idx) => (
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