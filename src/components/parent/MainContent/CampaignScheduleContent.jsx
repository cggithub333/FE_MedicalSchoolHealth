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
  Description,
  Person,
  LocalHospital
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

  // Real data from your API
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

  const vaccinationSurveys = [
    {
      consentFormId: 26,
      respondedAt: "2025-06-30T13:38:16.438398",
      status: "APPROVED",
      formDeadline: "2025-07-01T23:59:59.999999999",
      campaignId: 4,
      campaignName: "Vaccination End Winter 2025",
      diseaseId: 1,
      diseaseName: "Measles ",
      doseNumber: 1,
      currDoseNumber: 0,
      vaccineId: 1,
      vaccineName: "Vaccine MMR",
      pupilId: "PP0006",
      pupilName: "Em",
      gradeLevel: "GRADE_1"
    },
    {
      consentFormId: 27,
      respondedAt: null,
      status: "REJECTED",
      formDeadline: "2025-07-01T23:59:59.999999999",
      campaignId: 4,
      campaignName: "Vaccination End Winter 2025",
      diseaseId: 1,
      diseaseName: "Measles ",
      doseNumber: 1,
      currDoseNumber: 0,
      vaccineId: 1,
      vaccineName: "Vaccine MMR",
      pupilId: "PP0007",
      pupilName: "Lan",
      gradeLevel: "GRADE_4"
    }
  ];

  // Helper function to calculate vaccination date based on grade
  const getVaccinationDateForGrade = (startDate, gradeId) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (gradeId - 1)); // Grade 1 = day 0, Grade 2 = day 1, etc.
    return date.toISOString().split('T')[0];
  };

  // Helper function to calculate health check date based on grade
  const getHealthCheckDateForGrade = (startDate, gradeId) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (gradeId - 1));
    return date.toISOString().split('T')[0];
  };

  // Check if current pupil has vaccination survey
  const hasPupilVaccinationSurvey = vaccinationSurveys.some(survey => survey.pupilId === pupil.pupilId);
  const pupilVaccinationSurvey = vaccinationSurveys.find(survey => survey.pupilId === pupil.pupilId);

  const generateEvents = () => {
    const events = [];

    // Add Health Check Campaign Events (always available for all pupils) - 2 sessions per day
    if (latestHealthCheckCampaign) {
      const healthCheckDate = getHealthCheckDateForGrade(
        latestHealthCheckCampaign.startExaminationDate.split('T')[0], 
        pupil.gradeId
      );
      
      // Morning Session: 8:00 AM - 11:30 AM
      events.push({
        id: `health-check-morning-${pupil.gradeId}`,
        title: `Health Check (Morning) - ${pupil.gradeName}`,
        start: `${healthCheckDate}T08:00:00`,
        end: `${healthCheckDate}T11:30:00`,
        description: latestHealthCheckCampaign.description,
        color: '#a29bfe',
        textColor: '#fff',
        extendedProps: {
          type: 'HEALTH_CHECK',
          session: 'MORNING',
          campaign: latestHealthCheckCampaign.title,
          campaignId: latestHealthCheckCampaign.campaignId,
          targetGroup: pupil.gradeName,
          location: latestHealthCheckCampaign.address,
          pupilId: pupil.pupilId,
          pupilName: `${pupil.firstName} ${pupil.lastName}`,
          status: latestHealthCheckCampaign.statusHealthCampaign,
          gradeId: pupil.gradeId,
          sessionTime: '8:00 AM - 11:30 AM'
        }
      });

      // Afternoon Session: 1:00 PM - 4:30 PM
      events.push({
        id: `health-check-afternoon-${pupil.gradeId}`,
        title: `Health Check (Afternoon) - ${pupil.gradeName}`,
        start: `${healthCheckDate}T13:00:00`,
        end: `${healthCheckDate}T16:30:00`,
        description: latestHealthCheckCampaign.description,
        color: '#74b9ff',
        textColor: '#fff',
        extendedProps: {
          type: 'HEALTH_CHECK',
          session: 'AFTERNOON',
          campaign: latestHealthCheckCampaign.title,
          campaignId: latestHealthCheckCampaign.campaignId,
          targetGroup: pupil.gradeName,
          location: latestHealthCheckCampaign.address,
          pupilId: pupil.pupilId,
          pupilName: `${pupil.firstName} ${pupil.lastName}`,
          status: latestHealthCheckCampaign.statusHealthCampaign,
          gradeId: pupil.gradeId,
          sessionTime: '1:00 PM - 4:30 PM'
        }
      });
    }

    // Add Vaccination Campaign Events (only if pupil has vaccination survey) - 2 sessions per day
    if (latestCampaign && hasPupilVaccinationSurvey) {
      const vaccinationDate = getVaccinationDateForGrade(
        latestCampaign.campaign.startDate, 
        pupil.gradeId
      );
      
      // Morning Session: 8:00 AM - 11:30 AM
      events.push({
        id: `vaccination-morning-${pupil.gradeId}`,
        title: `${latestCampaign.campaign.vaccine.name} (Morning) - ${pupil.gradeName}`,
        start: `${vaccinationDate}T08:00:00`,
        end: `${vaccinationDate}T11:30:00`,
        description: `Vaccination for ${latestCampaign.campaign.disease.name.trim()} - ${latestCampaign.campaign.disease.description}`,
        color: '#ff6b6b',
        textColor: '#fff',
        extendedProps: {
          type: 'VACCINATION',
          session: 'MORNING',
          campaign: pupilVaccinationSurvey?.campaignName || 'Vaccination Campaign',
          campaignId: latestCampaign.campaign.campaignId,
          targetGroup: pupil.gradeName,
          vaccine: latestCampaign.campaign.vaccine.name,
          disease: latestCampaign.campaign.disease.name.trim(),
          manufacturer: latestCampaign.campaign.vaccine.manufacturer,
          location: 'School Health Center',
          pupilId: pupil.pupilId,
          pupilName: `${pupil.firstName} ${pupil.lastName}`,
          status: pupilVaccinationSurvey?.status || 'PENDING',
          campaignStatus: latestCampaign.campaign.campaignStatus,
          notes: latestCampaign.campaign.notes,
          doseQuantity: latestCampaign.campaign.disease.doseQuantity,
          isInjected: latestCampaign.campaign.disease.isInjectedVaccine,
          recommendedAge: latestCampaign.campaign.vaccine.recommendedAge,
          gradeId: pupil.gradeId,
          formDeadline: pupilVaccinationSurvey?.formDeadline,
          sessionTime: '8:00 AM - 11:30 AM'
        }
      });

      // Afternoon Session: 1:00 PM - 4:30 PM
      events.push({
        id: `vaccination-afternoon-${pupil.gradeId}`,
        title: `${latestCampaign.campaign.vaccine.name} (Afternoon) - ${pupil.gradeName}`,
        start: `${vaccinationDate}T13:00:00`,
        end: `${vaccinationDate}T16:30:00`,
        description: `Vaccination for ${latestCampaign.campaign.disease.name.trim()} - ${latestCampaign.campaign.disease.description}`,
        color: '#fd79a8',
        textColor: '#fff',
        extendedProps: {
          type: 'VACCINATION',
          session: 'AFTERNOON',
          campaign: pupilVaccinationSurvey?.campaignName || 'Vaccination Campaign',
          campaignId: latestCampaign.campaign.campaignId,
          targetGroup: pupil.gradeName,
          vaccine: latestCampaign.campaign.vaccine.name,
          disease: latestCampaign.campaign.disease.name.trim(),
          manufacturer: latestCampaign.campaign.vaccine.manufacturer,
          location: 'School Health Center',
          pupilId: pupil.pupilId,
          pupilName: `${pupil.firstName} ${pupil.lastName}`,
          status: pupilVaccinationSurvey?.status || 'PENDING',
          campaignStatus: latestCampaign.campaign.campaignStatus,
          notes: latestCampaign.campaign.notes,
          doseQuantity: latestCampaign.campaign.disease.doseQuantity,
          isInjected: latestCampaign.campaign.disease.isInjectedVaccine,
          recommendedAge: latestCampaign.campaign.vaccine.recommendedAge,
          gradeId: pupil.gradeId,
          formDeadline: pupilVaccinationSurvey?.formDeadline,
          sessionTime: '1:00 PM - 4:30 PM'
        }
      });
    }

    return events;
  };

  const events = generateEvents();

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'PENDING': return 'warning';
      case 'PUBLISHED': return 'info';
      default: return 'default';
    }
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        height="auto"
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
                  {selectedEvent.extendedProps.type === 'VACCINATION' ? (
                    <Vaccines color="primary" />
                  ) : (
                    <LocalHospital color="primary" />
                  )}
                  <Typography variant="h6" component="span" fontWeight="bold">
                    {selectedEvent.extendedProps.type === 'VACCINATION' ? 'Vaccination' : 'Health Check'} Details
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
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={selectedEvent.extendedProps.campaignStatus || selectedEvent.extendedProps.status} 
                      color={getStatusColor(selectedEvent.extendedProps.campaignStatus || selectedEvent.extendedProps.status)}
                      variant="filled"
                    />
                    {selectedEvent.extendedProps.session && (
                      <Chip 
                        label={`${selectedEvent.extendedProps.session} Session`} 
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                    {selectedEvent.extendedProps.status && selectedEvent.extendedProps.type === 'VACCINATION' && (
                      <Chip 
                        label={`Consent: ${selectedEvent.extendedProps.status}`} 
                        color={getStatusColor(selectedEvent.extendedProps.status)}
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Paper>

                {/* Student Information */}
                <Paper sx={{ p: 3, mb: 3, bgcolor: 'info.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Person color="info" />
                    <Typography variant="subtitle1" fontWeight="bold" color="info.main">
                      Student Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Student Name</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedEvent.extendedProps.pupilName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Student ID</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedEvent.extendedProps.pupilId}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Grade</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedEvent.extendedProps.targetGroup}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Birth Date</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {pupil.birthDate}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Key Information Grid */}
                <Grid container spacing={3}>
                  {/* Date & Time */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%', bgcolor: 'success.50' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Schedule color="success" />
                        <Typography variant="subtitle1" fontWeight="bold" color="success.main">
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
                      <Typography variant="body1" sx={{ mb: 0.5 }}>
                        <strong>Session:</strong> {selectedEvent.extendedProps.session || 'N/A'} Session
                      </Typography>
                      <Typography variant="body1">
                        <strong>Time:</strong> {selectedEvent.extendedProps.sessionTime || 
                          `${selectedEvent.start?.toLocaleTimeString('en-US', {
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

                  {/* Vaccination-specific information */}
                  {selectedEvent.extendedProps.type === 'VACCINATION' && (
                    <>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: '100%', bgcolor: 'warning.50' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Vaccines color="warning" />
                            <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                              Vaccine Information
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ mb: 0.5 }}>
                            <strong>Vaccine:</strong> {selectedEvent.extendedProps.vaccine}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 0.5 }}>
                            <strong>Disease:</strong> {selectedEvent.extendedProps.disease}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Manufacturer:</strong> {selectedEvent.extendedProps.manufacturer}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: '100%', bgcolor: 'secondary.50' }}>
                          <Typography variant="subtitle1" fontWeight="bold" color="secondary.main" sx={{ mb: 1 }}>
                            Dosage Information
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 0.5 }}>
                            <strong>Doses Required:</strong> {selectedEvent.extendedProps.doseQuantity}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 0.5 }}>
                            <strong>Administration:</strong> {selectedEvent.extendedProps.isInjected ? 'Injection' : 'Oral'}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Recommended Age:</strong> {selectedEvent.extendedProps.recommendedAge}
                          </Typography>
                        </Paper>
                      </Grid>
                    </>
                  )}
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
                  {selectedEvent.extendedProps.type === 'VACCINATION' && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        • Please bring your child's vaccination record
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Arrive 15 minutes before the scheduled session time
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Consent forms must be submitted in advance
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Choose either morning (8:00 AM - 11:30 AM) or afternoon (1:00 PM - 4:30 PM) session
                      </Typography>
                    </>
                  )}
                  {selectedEvent.extendedProps.type === 'HEALTH_CHECK' && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        • Bring any medical records or previous health reports
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Ensure your child has had breakfast before the examination
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Arrive 15 minutes before the scheduled session time
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Choose either morning (8:00 AM - 11:30 AM) or afternoon (1:00 PM - 4:30 PM) session
                      </Typography>
                    </>
                  )}
                  {selectedEvent.extendedProps.session && (
                    <Typography variant="body2" color="primary.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                      • Current selected session: {selectedEvent.extendedProps.session} ({selectedEvent.extendedProps.sessionTime})
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