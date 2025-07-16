import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import InfoIcon from '@mui/icons-material/Info';

import { formatDateToDDMMYYYY, formatDateTimeToReadable } from '../../../utils/date-utils';

export default function HealthCheckInfor({ latestHealthCheckCampaign }) {


  if (!latestHealthCheckCampaign || Object.keys(latestHealthCheckCampaign).length === 0) {
    return <Box p={3} textAlign="center"><Typography>No health check campaign found.</Typography></Box>;
  }

  return (
    <Box p={3} maxWidth={600} mx="auto">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🏥 School Health Examination
      </Typography>

      {/* Campaign Overview */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" display="flex" alignItems="center" gutterBottom>
            <LocalHospitalIcon color="success" sx={{ mr: 1 }} />
            Campaign Overview
          </Typography>
          {/* <Typography><strong>Status:</strong> {latestHealthCheckCampaign.status}</Typography> */}
          <Typography><strong>Start Date:</strong> {formatDateToDDMMYYYY(latestHealthCheckCampaign.startExaminationDate)}</Typography>
          <Typography><strong>End Date:</strong> {formatDateToDDMMYYYY(latestHealthCheckCampaign.endExaminationDate)}</Typography>
          <Typography><strong>Location:</strong> {latestHealthCheckCampaign.address}</Typography>
          <Typography><strong>Created At:</strong> {latestHealthCheckCampaign.created_at ? formatDateTimeToReadable(latestHealthCheckCampaign.created_at) : ""}</Typography>
        </CardContent>
      </Card>

      {/* Health Check Details */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" display="flex" alignItems="center" gutterBottom>
            <InfoIcon color="info" sx={{ mr: 1 }} />
            Examination Details
          </Typography>
          <Typography><strong>Description:</strong></Typography>
          <Typography>{latestHealthCheckCampaign.description}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}