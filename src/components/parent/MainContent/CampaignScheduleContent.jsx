import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  IconButton
} from '@mui/material'
import {
  Close,
  Event,
  Schedule,
  Group,
  LocationOn,
  Vaccines,
  Description
} from '@mui/icons-material'

export default function CampaignScheduleContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setModalOpen(true);
  };

  // ...existing events array...
  const events = [
    // MMR Vaccination Campaign - Morning Session
    {
      id: 'mmr-morning',
      title: 'MMR Vaccination - Morning',
      start: '2025-07-01T08:00:00',
      end: '2025-07-01T12:00:00',
      description: 'Measles, Mumps, Rubella vaccination for Grades 1-3',
      color: '#ff6b6b',
      textColor: '#fff',
      extendedProps: {
        campaign: 'MMR Vaccination Campaign',
        targetGroup: 'Grades 1-3',
        vaccine: 'MMR',
        location: 'School Health Center - Room A'
      }
    },
    // MMR Vaccination Campaign - Afternoon Session
    {
      id: 'mmr-afternoon',
      title: 'MMR Vaccination - Afternoon',
      start: '2025-07-01T13:00:00',
      end: '2025-07-01T17:00:00',
      description: 'Measles, Mumps, Rubella vaccination for Grades 4-6',
      color: '#ff6b6b',
      textColor: '#fff',
      extendedProps: {
        campaign: 'MMR Vaccination Campaign',
        targetGroup: 'Grades 4-6',
        vaccine: 'MMR',
        location: 'School Health Center - Room A'
      }
    },
    // DTP Vaccination Campaign
    {
      id: 'dtp-fullday',
      title: 'DTP Vaccination - Full Day',
      start: '2025-07-03T09:00:00',
      end: '2025-07-03T15:00:00',
      description: 'Diphtheria, Tetanus, Pertussis booster for all grades',
      color: '#4ecdc4',
      textColor: '#fff',
      extendedProps: {
        campaign: 'DTP Vaccination Campaign',
        targetGroup: 'All Grades',
        vaccine: 'DTP',
        location: 'School Health Center - Room B'
      }
    },
    // Hepatitis B - First Dose
    {
      id: 'hepb-first',
      title: 'Hepatitis B - First Dose',
      start: '2025-07-08T08:30:00',
      end: '2025-07-08T11:30:00',
      description: 'First dose Hepatitis B for new students',
      color: '#ffd93d',
      textColor: '#333',
      extendedProps: {
        campaign: 'Hepatitis B Vaccination',
        targetGroup: 'New Students',
        vaccine: 'Hepatitis B',
        location: 'School Health Center - Room C'
      }
    },
    // Hepatitis B - Second Dose
    {
      id: 'hepb-second',
      title: 'Hepatitis B - Second Dose',
      start: '2025-07-15T14:00:00',
      end: '2025-07-15T16:00:00',
      description: 'Follow-up dose for previous recipients',
      color: '#ffd93d',
      textColor: '#333',
      extendedProps: {
        campaign: 'Hepatitis B Vaccination',
        targetGroup: 'Follow-up Students',
        vaccine: 'Hepatitis B',
        location: 'School Health Center - Room C'
      }
    },
    // Polio Vaccination
    {
      id: 'polio-drive',
      title: 'Polio Vaccination Drive',
      start: '2025-07-10T10:00:00',
      end: '2025-07-10T14:00:00',
      description: 'Oral Polio Vaccine for all eligible students',
      color: '#74b9ff',
      textColor: '#fff',
      extendedProps: {
        campaign: 'Polio Vaccination Campaign',
        targetGroup: 'All Eligible Students',
        vaccine: 'OPV (Oral Polio Vaccine)',
        location: 'School Gymnasium'
      }
    },
    // Health Checkup - Group A
    {
      id: 'health-check-a',
      title: 'Health Checkup - Group A',
      start: '2025-07-05T08:00:00',
      end: '2025-07-05T12:00:00',
      description: 'Annual health screening for Grades 1-3',
      color: '#a29bfe',
      textColor: '#fff',
      extendedProps: {
        campaign: 'Annual Health Checkup',
        targetGroup: 'Grades 1-3',
        vaccine: 'N/A',
        location: 'School Medical Room'
      }
    },
    // Health Checkup - Group B
    {
      id: 'health-check-b',
      title: 'Health Checkup - Group B',
      start: '2025-07-05T13:00:00',
      end: '2025-07-05T17:00:00',
      description: 'Annual health screening for Grades 4-6',
      color: '#a29bfe',
      textColor: '#fff',
      extendedProps: {
        campaign: 'Annual Health Checkup',
        targetGroup: 'Grades 4-6',
        vaccine: 'N/A',
        location: 'School Medical Room'
      }
    },
    // Multi-day Health Campaign
    {
      id: 'health-week',
      title: 'School Health Week',
      start: '2025-07-20',
      end: '2025-07-25',
      description: 'Comprehensive health awareness and vaccination week',
      color: '#fd79a8',
      textColor: '#fff',
      allDay: true,
      extendedProps: {
        campaign: 'Health Awareness Week',
        targetGroup: 'All Students',
        vaccine: 'Various',
        location: 'Entire School Campus'
      }
    }
  ];

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        // weekends={false}
        events={events}
        dateClick={(info) => {
          alert('Clicked on: ' + info.dateStr)
        }}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
      />

      {/* Event Details Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {selectedEvent && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Event color="primary" />
                  <Typography variant="h6" component="span" fontWeight="bold">
                    Event Details
                  </Typography>
                </Box>
                <IconButton onClick={handleCloseModal} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Box sx={{ pt: 1 }}>
                {/* Event Title & Campaign */}
                <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                  <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
                    {selectedEvent.title}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {selectedEvent.extendedProps.campaign}
                  </Typography>
                </Paper>

                {/* Key Information Grid */}
                <Grid container spacing={3}>
                  {/* Date & Time */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%', bgcolor: 'info.50' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Schedule color="info" />
                        <Typography variant="subtitle1" fontWeight="bold" color="info.main">
                          Schedule
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mb: 0.5 }}>
                        <strong>Date:</strong> {selectedEvent.start?.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Time:</strong> {
                          selectedEvent.allDay 
                            ? 'All Day' 
                            : `${selectedEvent.start?.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}${selectedEvent.end ? ` - ${selectedEvent.end.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}` : ''}`
                        }
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Target Group */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%', bgcolor: 'success.50' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Group color="success" />
                        <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                          Target Group
                        </Typography>
                      </Box>
                      <Chip 
                        label={selectedEvent.extendedProps.targetGroup} 
                        color="success" 
                        variant="filled"
                        sx={{ mt: 1 }}
                      />
                    </Paper>
                  </Grid>

                  {/* Vaccine Information */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%', bgcolor: 'warning.50' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Vaccines color="warning" />
                        <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                          Vaccine Type
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                        {selectedEvent.extendedProps.vaccine}
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Location */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%', bgcolor: 'error.50' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn color="error" />
                        <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                          Location
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {selectedEvent.extendedProps.location}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Description */}
                <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Description color="action" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Description
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {selectedEvent.extendedProps.description || 
                     selectedEvent._def?.extendedProps?.description || 
                     selectedEvent.title}
                  </Typography>
                </Paper>

                {/* Additional Information */}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Important Notes:</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Please bring your child's vaccination record
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Arrive 15 minutes before the scheduled time
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Consent forms must be submitted in advance
                  </Typography>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button 
                onClick={handleCloseModal} 
                variant="contained" 
                color="primary"
                fullWidth
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}