import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VaccinationInfoCard from './VaccinationInfo';

export default function VaccinationDialog({ latestVaccinationCampaign }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ textAlign: 'center'}}>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        View Campaign Info
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Vaccination Campaign Details
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <VaccinationInfoCard latestVaccinationCampaign={latestVaccinationCampaign }/>
        </DialogContent>
      </Dialog>
    </Box>
  );
}