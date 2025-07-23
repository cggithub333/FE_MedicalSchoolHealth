"use client"
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Link,
  Divider,
  Paper,
} from "@mui/material"
import {
  Dashboard,
  HealthAndSafety,
  Vaccines,
  LocalHospital,
  Medication,
  Person,
  Send,
  Assessment,
  Warning,
  Error,
  Info,
} from "@mui/icons-material"

import { Link as RouterLink } from "react-router-dom";
import { FaChild as Child } from "react-icons/fa6";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import { useState, useEffect } from 'react';
import { Base64 } from "js-base64"; // Temporary for testing

/*
const latestHealthCheckCampaign = {
  title: "Health Check Exam Winter 2025",
  description: "This is description",
  deadlineDate: "2025-07-21",
  diseases: [
    {
      name: "Genital Checkup",
    },
  ],
}

const latestVaccinationCampaign = {
  campaign: {
    disease: {
      name: "Measles",
    },
    vaccine: {
      name: "MMR Vaccine - VN Pharma",
    },
    notes: "this is notes for version 2",
    consentFormDeadline: "2025-07-19",
  },
}
  */

/*
const injectedNoteObjs = [
  {
    diseaseInfor: {
      disease: "Diphenhydramine",
      medication: "honey syrup",
      unitUsage: "5ml to soothe dry throat and suppress coug",
      schedule: "Before lunch: 10h30-11h00",
      given: "Yes",
      givenTime: "7:09:01 PM",
    },
    nurseName: "Thủy Vy",
  },
]
  */

/*
const simplifiedMedicalEventArr = [
  {
    status: "MEDIUM",
    dateTime: "17/07/2025 19:37:01",
    schoolNurse: {
      name: "Thủy Vy",
    },
  },
]
  */

import useAllNotifications from "@hooks/parent/health-check/useAllNotifications";
import usePersonalInformation from "@hooks/common/useMyInformation";
import useCurrentStoragedPupil from "@hooks/parent/useCurrentStoragedPupil";
import useLatestHealthCheckCampaign from "@hooks/parent/useLatestHealthCheckCampaign";
import useLatestVaccinationCampaign from "@hooks/parent/vaccination/useLatestVaccinationcampaign";
import usePrescriptionByPupil from "@hooks/parent/send-medication/usePrescriptionByPupil";
import useNotifyNewMedicalEvents from "@hooks/parent/medical-events/useNotifyNewMedicalEvents"

const MainDashboardContent = () => {
  const { countNotificationsByType, loading: notificationLoading} = useAllNotifications();
  const { personalInforState } = usePersonalInformation();
  const { currentPupil, filterPupilInforWithCurrentParent, loading: currentPupilLoading, refetch: refetchCurrPupil} = useCurrentStoragedPupil();
  const { latestHealthCheckCampaign, isLoading: latestHealthCheckLoading } = useLatestHealthCheckCampaign();
  const { latestCampaign: latestVaccinationCampaign, loading: latestVaccinationLoading } = useLatestVaccinationCampaign();
  const { prescriptionArr, injectedNoteObjs, loading: injectedNoteLoading } = usePrescriptionByPupil(localStorage.getItem("pupilId"));
  const { getSimplifiedEventsByPupilId, loading: simplifiedEventsLoading, refetch: notiNewEventRefetch } = useNotifyNewMedicalEvents();

  // Initialize with null instead of calling the function immediately
  // const [pupilInfo, setPupilInfo] = useState(null);
  const [simplifiedMedicalEventArr, setSimplifiedMedicalEventArr] = useState([]);

  // debug:
  console.log("Current pupil info:", JSON.stringify(currentPupil, null, 2));
  console.log("User information:", JSON.stringify(personalInforState, null, 2));
  console.log("currentPupilLoading:", currentPupilLoading);
  console.log("localStorage pupilInfor exists:", !!localStorage.getItem("pupilInfor"));
  console.log("localStorage pupilId:", localStorage.getItem("pupilId"));

  // Add useEffect to update simplified medical events
  useEffect(() => {
    if (currentPupil?.pupilId) {
      const events = getSimplifiedEventsByPupilId(currentPupil.pupilId);
      setSimplifiedMedicalEventArr(events || []);
    }
  }, [currentPupil?.pupilId]);

  // Add useEffect to refetch pupil information when the component mounts
  useEffect(() => {
    console.log("Dashboard mounted, pupil state:");
    console.log("- currentPupil:", currentPupil);
    console.log("- currentPupilLoading:", currentPupilLoading);
    
    // Only refetch if we don't have pupil data and we're not currently loading
    if (!currentPupil && !currentPupilLoading) {
      console.log("No pupil found and not loading, attempting refetch...");
      refetchCurrPupil();
    }
  }, []); // Run only on mount

  // Separate effect to handle delayed localStorage population
  useEffect(() => {
    if (!currentPupil && !currentPupilLoading) {
      const checkTimer = setTimeout(() => {
        console.log("⏰ Delayed check for pupil data...");
        if (localStorage.getItem("pupilInfor") && !currentPupil) {
          console.log("📦 Found pupilInfor in localStorage, refetching...");
          refetchCurrPupil();
        }
      }, 1000); // Check after 1 second

      return () => clearTimeout(checkTimer);
    }
  }, [currentPupil, currentPupilLoading, refetchCurrPupil]);

  const formatDate = (dateString) => {

    if (!dateString) return "";

    const [year, month, day] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "LOW":
        return "success"
      case "MEDIUM":
        return "warning"
      case "HIGH":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "LOW":
        return <Info />
      case "MEDIUM":
        return <Warning />
      case "HIGH":
        return <Error />
      default:
        return <Info />
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
          <Dashboard sx={{ fontSize: 32 }} />
        </Avatar>
        <Typography variant="h3" fontWeight="bold" color="primary.main">
          Parent Dashboard
        </Typography>
      </Box>

      {/* Notification Count Boxes */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item size={{xs: 12, md:3}} sx={styleNoficationBoxItem}>
          <Box component={RouterLink} to="/parent/notification#health-check-campaign" sx={{ textDecoration: "none" }}>
            <Card sx={{ bgcolor: "info.50", borderColor: "info.200" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }} >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                  <HealthAndSafety color="info" sx={{ fontSize: 28 }} />
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {countNotificationsByType.HEALTH_CHECK_CAMPAIGN || 0}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" color="info.dark">
                  Health Check Campaign
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item size={{xs: 12, md:3}}  sx={styleNoficationBoxItem}>
          <Box component={RouterLink} to="/parent/notification#vaccination-campaign" sx={{ textDecoration: "none" }}>
            <Card sx={{ bgcolor: "success.50", borderColor: "success.200" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                  <Vaccines color="success" sx={{ fontSize: 28 }} />
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {countNotificationsByType.VACCINATION_CAMPAIGN || 0}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" color="success.dark">
                  Vaccination Campaign
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item size={{xs: 12, md:3}}  sx={styleNoficationBoxItem}>
          <Box component={RouterLink} to="/parent/notification#medical-events" sx={{ textDecoration: "none" }}>
            <Card sx={{ bgcolor: "error.50", borderColor: "error.200" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                  <LocalHospital color="error" sx={{ fontSize: 28 }} />
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {countNotificationsByType.MED_EVENT || 0}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" color="error.dark">
                  Medical Event
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item size={{xs: 12, md:3}}  sx={styleNoficationBoxItem}>
          <Box component={RouterLink} to="/parent/notification#send-medication" sx={{ textDecoration: "none" }}>
            <Card sx={{ bgcolor: "warning.50", borderColor: "warning.200" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                  <Medication color="warning" sx={{ fontSize: 28 }} />
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {countNotificationsByType.SEND_MEDICAL || 0}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" color="warning.dark">
                  Medication Taking
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Parent and Pupil Information Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item size={{xs: 12, md:6}}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Person color="primary" />
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  Parent Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Parent ID
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {personalInforState?.userId}
                  </Typography>
                </Grid>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {personalInforState?.lastName} {personalInforState?.firstName}
                  </Typography>
                </Grid>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {personalInforState?.email}
                  </Typography>
                </Grid>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {personalInforState?.phoneNumber}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{xs: 12, md:6}}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Child color="success" />
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  Pupil Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Pupil ID
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {currentPupilLoading ? "Loading..." : (currentPupil?.pupilId || "Not Available")}
                  </Typography>
                </Grid>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {currentPupilLoading ? "Loading..." : (currentPupil ? `${currentPupil.lastName} ${currentPupil.firstName}` : "Not Available")}
                  </Typography>
                </Grid>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Class
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {currentPupilLoading ? "Loading..." : (currentPupil?.gradeName || "Not Available")}
                  </Typography>
                </Grid>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Birth Date
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {currentPupilLoading ? "Loading..." : (currentPupil?.birthDate || "Not Available")}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Row */}
      <Grid container spacing={3}>
        {/* Left Box - 70% width */}
        <Grid item size={{xs: 12, md: 8}}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              {/* Latest Campaigns Row */}
              <Grid container spacing={2} sx={{ mb: 3, height: "200px" }}>
                <Grid item size={{xs: 12, md:6}}>
                  <Paper sx={{ p: 2, bgcolor: "info.50", borderColor: "info.200", height: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <HealthAndSafety color="info" fontSize="small" />
                      <Typography variant="subtitle1" fontWeight="bold" color="info.main">
                        Latest Health Check Campaign
                      </Typography>
                    </Box>
                    {latestHealthCheckCampaign ? (
                      <Box>
                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                          {latestHealthCheckCampaign.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Deadline: {formatDate(latestHealthCheckCampaign.deadlineDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {latestHealthCheckCampaign.description}
                        </Typography>
                        <Box component={RouterLink} to="/parent/health-check-campaign/campaigns" sx={{ textDecoration: "none" }}>
                          <Button variant="outlined" size="small" color="info" sx={{ marginLeft: "35%", marginBottom: "0px" }}>
                            Details
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          No campaign is on-going
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                <Grid item size={{xs: 12, md:6}} sx={{height: "200px"}}>
                  <Paper sx={{ p: 2, bgcolor: "success.50", borderColor: "success.200", height: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Vaccines color="success" fontSize="small" />
                      <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                        Latest Vaccination Campaign
                      </Typography>
                    </Box>
                    {latestVaccinationCampaign ? (
                      <Box>
                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                          {latestVaccinationCampaign.campaign.disease.name} Vaccination
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Vaccine: {latestVaccinationCampaign.campaign.vaccine.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Deadline: {formatDate(latestVaccinationCampaign.campaign.consentFormDeadline)}
                        </Typography>
                        <Box component={RouterLink} to="/parent/vaccination-campaign/campaigns" sx={{ textDecoration: "none" }}>
                          <Button variant="outlined" size="small" color="success" sx={{ marginLeft: "35%", marginBottom: "0px" }}>
                            Details
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          No campaign is on-going
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Quick Actions */}
              <Box sx={{ mb: 2 }}>
                <Box display={'flex'} alignItems="center" gap={1} mb={2}>
                  <RocketLaunchIcon color="action" />
                  <Typography variant="h6" fontWeight="bold" color="default.main">
                    Quick Actions
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item size={{xs: 12, sm: 6}} sx={styleQuickActionItem}>
                    <Box component={RouterLink} to="/parent/health-check-campaign/campaigns" sx={{ textDecoration: "none" }}>
                      <Card
                        sx={{
                          textAlign: "center",
                          p: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "info.50" },
                          transition: "all 0.3s",
                        }}
                      >
                        <HealthAndSafety color="info" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="body2" fontWeight="bold">
                          Health Check Campaign
                        </Typography>
                      </Card>
                    </Box>
                  </Grid>

                  <Grid item size={{xs: 12, sm: 6}}  sx={styleQuickActionItem}>
                    <Box component={RouterLink} to="/parent/vaccination-campaign/campaigns" sx={{ textDecoration: "none" }}>
                      <Card
                        sx={{
                          textAlign: "center",
                          p: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "success.50" },
                          transition: "all 0.3s",
                        }}
                      >
                        <Vaccines color="success" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="body2" fontWeight="bold">
                          Vaccination Campaign
                        </Typography>
                      </Card>
                    </Box>
                  </Grid>

                  <Grid item size={{xs: 12, sm: 6}}  sx={styleQuickActionItem}>
                    <Box component={RouterLink} to="/parent/medical-events" sx={{ textDecoration: "none" }}>
                      <Card
                        sx={{
                          textAlign: "center",
                          p: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "error.50" },
                          transition: "all 0.3s",
                        }}
                      >
                        <LocalHospital color="error" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="body2" fontWeight="bold">
                          Medical Events
                        </Typography>
                      </Card>
                    </Box>
                  </Grid>

                  <Grid item size={{xs: 12, sm: 6}}  sx={styleQuickActionItem}>
                    <Box component={RouterLink} to="/parent/prescription/new-prescription" sx={{ textDecoration: "none" }}>
                      <Card
                        sx={{
                          textAlign: "center",
                          p: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "warning.50" },
                          transition: "all 0.3s",
                        }}
                      >
                        <Send color="warning" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="body2" fontWeight="bold">
                          Send Medication
                        </Typography>
                      </Card>
                    </Box>
                  </Grid>

                  <Grid item size={{xs: 12, sm: 6}}  sx={styleQuickActionItem}>
                    <Link href="#" underline="none">
                      <Card
                        sx={{
                          textAlign: "center",
                          p: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "primary.50" },
                          transition: "all 0.3s",
                        }}
                      >
                        <Assessment color="primary" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="body2" fontWeight="bold">
                          Child Report
                        </Typography>
                      </Card>
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Box - 30% width */}
        <Grid item size={{xs: 12, md: 4}}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "100%" }}>
            {/* New Medication Taking */}
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Medication color="warning" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                    New Medication Taking
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="caption" fontWeight="bold">
                            Disease
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight="bold">
                            Medication
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight="bold">
                            Status
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight="bold">
                            Given Time
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(injectedNoteObjs || []).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="caption">{item.diseaseInfor.disease}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{item.diseaseInfor.medication}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.diseaseInfor.given === "Yes" ? "Given" : "Not Given"}
                              color={item.diseaseInfor.given === "Yes" ? "success" : "error"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{item.diseaseInfor.givenTime}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!injectedNoteObjs || (Array.isArray(injectedNoteObjs) && injectedNoteObjs.length === 0)) ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <Typography variant="caption" color="text.secondary" mb={2}>
                              No new medication taking records
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : null                        
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Box component={RouterLink} to="/parent/prescription/prescription-logs" sx={{ textDecoration: "none" }}>
                    <Button variant="outlined" size="small" color="warning">
                      Details
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* New Medical Events */}
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <LocalHospital color="error" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                    New Medical Events
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="caption" fontWeight="bold">
                            School Nurse
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight="bold">
                            Event Time
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight="bold">
                            Status
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {simplifiedMedicalEventArr.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="caption">{event.schoolNurse.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{event.dateTime}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={event.status}
                              color={getStatusColor(event.status)}
                              size="small"
                              icon={getStatusIcon(event.status)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!simplifiedMedicalEventArr || (Array.isArray(simplifiedMedicalEventArr) && simplifiedMedicalEventArr.length === 0)) ? (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography variant="caption" color="text.secondary">
                              No new medical events
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Box component={RouterLink} to="/parent/medical-events" sx={{ textDecoration: "none" }}>
                    <Button variant="outlined" size="small" color="error">
                      Details
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

const styleQuickActionItem = {
  "&:hover": {
    bgcolor: "primary.50",
    transform: "scale(1.05)",
    transition: "all 0.3s ease-in-out",
  },
}

const styleNoficationBoxItem = {
  "&:hover": {
    transform: "translate(5px, 3px)",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
}

export default MainDashboardContent