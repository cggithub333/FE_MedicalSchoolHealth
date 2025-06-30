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

export default function VaccinationSchedule() {
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

  // pupil infor:
  const pupil = {
    pupilId: "PP0006",
    lastName: "Hoàng",
    firstName: "Em",
    birthDate: "12-01-2018",
    gender: "M",
    gradeId: 1,
    startYear: 2024,
    gradeLevel: "GRADE_1",
    gradeName: "Lớp 1D"
  };

  // Real campaign data
  const latestCampaign = {
    campaign: {
      campaignId: 4,
      disease: {
        disease_id: 1,
        name: "Measles ",
        description: "Infectious disease with rash and high fever",
        isInjectedVaccine: true,
        doseQuantity: 1
      },
      vaccine: {
        vaccineId: 1,
        name: "Vaccine MMR",
        manufacturer: "PharmaCorp",
        recommendedAge: "12–15 tháng",
        description: null
      },
      notes: "Please confirm the form before the deadline form for making sure the best for your child's health.",
      startDate: "2025-07-02",
      endDate: "2025-07-05",
      campaignStatus: "PUBLISHED",
      status: "Pending"
    }
  };

  const latestHealthCheckCampaign = {
    campaignId: 2,
    address: "123ABC School",
    title: "Health check campaign Winter 2025",
    description: "A winter health screening initiative aimed at ensuring the physical well-being of all students. The campaign includes general check-ups, dental and vision assessments, and promotes awareness of healthy habits for a strong academic year.",
    startExaminationDate: "2025-06-21T04:54:57.263",
    endExaminationDate: "2025-06-21T04:54:57.263",
    createdAt: "2025-06-28",
    statusHealthCampaign: "PUBLISHED"
  };

  // Generate events from real campaign data only
  const events = [
    // Vaccination Campaign Event
    {
      id: `vaccination-${latestCampaign.campaign.campaignId}`,
      title: `${latestCampaign.campaign.vaccine.name} Campaign`,
      start: latestCampaign.campaign.startDate,
      end: latestCampaign.campaign.endDate,
      description: `${latestCampaign.campaign.disease.description}. ${latestCampaign.campaign.notes}`,
      color: '#ff6b6b',
      textColor: '#fff',
      allDay: true,
      extendedProps: {
        type: 'vaccination',
        campaign: `${latestCampaign.campaign.disease.name} Vaccination Campaign`,
        targetGroup: 'All Students',
        vaccine: latestCampaign.campaign.vaccine.name,
        manufacturer: latestCampaign.campaign.vaccine.manufacturer,
        recommendedAge: latestCampaign.campaign.vaccine.recommendedAge,
        location: '123ABC School - Health Center',
        disease: latestCampaign.campaign.disease.name,
        doseQuantity: latestCampaign.campaign.disease.doseQuantity,
        isInjected: latestCampaign.campaign.disease.isInjectedVaccine,
        status: latestCampaign.campaign.status,
        campaignStatus: latestCampaign.campaign.campaignStatus,
        notes: latestCampaign.campaign.notes
      }
    },
    // Health Check Campaign Event
    {
      id: `healthcheck-${latestHealthCheckCampaign.campaignId}`,
      title: latestHealthCheckCampaign.title,
      start: latestHealthCheckCampaign.startExaminationDate.split('T')[0],
      end: latestHealthCheckCampaign.endExaminationDate.split('T')[0],
      description: latestHealthCheckCampaign.description,
      color: '#a29bfe',
      textColor: '#fff',
      allDay: true,
      extendedProps: {
        type: 'healthcheck',
        campaign: latestHealthCheckCampaign.title,
        targetGroup: 'All Students',
        vaccine: 'N/A',
        location: latestHealthCheckCampaign.address,
        status: latestHealthCheckCampaign.statusHealthCampaign,
        createdAt: latestHealthCheckCampaign.createdAt,
        notes: 'Comprehensive health screening for all students'
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
                  <Grid item size={{ xs: 12, md: 6}}>
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
                  <Grid item size={{ xs: 12, md: 6}}>
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
                      {(selectedEvent.extendedProps.status || selectedEvent.extendedProps.campaignStatus) && (
                        <Box sx={{ mt: 1 }}>
                          <Chip 
                            label={`Status: ${selectedEvent.extendedProps.campaignStatus || selectedEvent.extendedProps.status}`} 
                            color={(selectedEvent.extendedProps.campaignStatus || selectedEvent.extendedProps.status) === 'PUBLISHED' ? 'success' : 'warning'} 
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                      )}
                    </Paper>
                  </Grid>

                  {/* Vaccine Information */}
                  <Grid item size={{ xs: 12, md: 6}}>
                    <Paper sx={{ p: 2, height: '100%', bgcolor: 'warning.50' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Vaccines color="warning" />
                        <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                          {selectedEvent.extendedProps.type === 'healthcheck' ? 'Health Check' : 'Vaccine Information'}
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                        {selectedEvent.extendedProps.vaccine}
                      </Typography>
                      {selectedEvent.extendedProps.manufacturer && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          <strong>Manufacturer:</strong> {selectedEvent.extendedProps.manufacturer}
                        </Typography>
                      )}
                      {selectedEvent.extendedProps.recommendedAge && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          <strong>Recommended Age:</strong> {selectedEvent.extendedProps.recommendedAge}
                        </Typography>
                      )}
                      {selectedEvent.extendedProps.doseQuantity && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          <strong>Dose Quantity:</strong> {selectedEvent.extendedProps.doseQuantity}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>

                  {/* Location */}
                  <Grid item size={{ xs: 12, md: 6}}>
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
                      {selectedEvent.extendedProps.disease && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          <strong>Disease:</strong> {selectedEvent.extendedProps.disease}
                        </Typography>
                      )}
                      {selectedEvent.extendedProps.isInjected !== undefined && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          <strong>Administration:</strong> {selectedEvent.extendedProps.isInjected ? 'Injection' : 'Oral'}
                        </Typography>
                      )}
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
                  {selectedEvent.extendedProps.type === 'vaccination' && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        • Please bring your child's vaccination record
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Arrive 15 minutes before the scheduled time
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Contact the school for any questions
                      </Typography>
                    </>
                  )}
                  {selectedEvent.extendedProps.type === 'healthcheck' && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        • Bring any medical records or previous health reports
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Ensure your child has had breakfast before the examination
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Contact the school for any questions
                      </Typography>
                    </>
                  )}
                  {selectedEvent.extendedProps.notes && (
                    <Typography variant="body2" color="primary.main" sx={{ mt: 1, fontStyle: 'italic' }}>
                      • {selectedEvent.extendedProps.notes}
                    </Typography>
                  )}
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