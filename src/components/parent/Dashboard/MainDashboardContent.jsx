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

import { FaChild as Child } from "react-icons/fa6";

const countNotificationsByType = {
  VACCINATION_CAMPAIGN: 1,
  HEALTH_CHECK_CAMPAIGN: 0,
  MED_EVENT: 1,
  SEND_MEDICAL: 4,
}

const pupilInfo = {
  pupilId: "PP0001",
  lastName: "Nguyễn",
  firstName: "Minh",
  birthDate: "01-09-2019",
  gender: "M",
  gradeId: 1,
  startYear: 2025,
  gradeLevel: "GRADE_1",
  gradeName: "Class 1A",
  currentParent: {
    userId: "PR0001",
    lastName: "Anh",
    firstName: "Ngọc",
    birthDate: "10-05-1985",
    email: "ngoc.anh@gmail.com",
    phoneNumber: "0848025116",
    createdAt: "08-07-2025",
    role: "PARENT",
  },
}

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

const simplifiedMedicalEventArr = [
  {
    status: "MEDIUM",
    dateTime: "17/07/2025 19:37:01",
    schoolNurse: {
      name: "Thủy Vy",
    },
  },
]

const MainDashboardContent = () => {
  const formatDate = (dateString) => {
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
        <Grid item size={{xs: 12, md:3}}>
          <Card sx={{ bgcolor: "success.50", border: "1px solid", borderColor: "success.200" }}>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                <HealthAndSafety color="success" sx={{ fontSize: 28 }} />
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {countNotificationsByType.HEALTH_CHECK_CAMPAIGN || 0}
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight="bold" color="success.dark">
                Health Check Campaign
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{xs: 12, md:3}}>
          <Card sx={{ bgcolor: "info.50", border: "1px solid", borderColor: "info.200" }}>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                <Vaccines color="info" sx={{ fontSize: 28 }} />
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {countNotificationsByType.VACCINATION_CAMPAIGN || 0}
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight="bold" color="info.dark">
                Vaccination Campaign
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{xs: 12, md:3}}>
          <Card sx={{ bgcolor: "warning.50", border: "1px solid", borderColor: "warning.200" }}>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                <LocalHospital color="warning" sx={{ fontSize: 28 }} />
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {countNotificationsByType.MED_EVENT || 0}
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight="bold" color="warning.dark">
                Medical Event
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{xs: 12, md:3}}>
          <Card sx={{ bgcolor: "error.50", border: "1px solid", borderColor: "error.200" }}>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                <Medication color="error" sx={{ fontSize: 28 }} />
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {countNotificationsByType.SEND_MEDICAL || 0}
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight="bold" color="error.dark">
                Medication Taking
              </Typography>
            </CardContent>
          </Card>
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
                    {pupilInfo.currentParent.userId}
                  </Typography>
                </Grid>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {pupilInfo.currentParent.lastName} {pupilInfo.currentParent.firstName}
                  </Typography>
                </Grid>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {pupilInfo.currentParent.email}
                  </Typography>
                </Grid>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {pupilInfo.currentParent.phoneNumber}
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
                    {pupilInfo.pupilId}
                  </Typography>
                </Grid>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {pupilInfo.lastName} {pupilInfo.firstName}
                  </Typography>
                </Grid>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Class
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {pupilInfo.gradeName}
                  </Typography>
                </Grid>
                <Grid item size={{xs: 6}}>
                  <Typography variant="body2" color="text.secondary">
                    Birth Date
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {pupilInfo.birthDate}
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
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item size={{xs: 12, md:6}}>
                  <Paper sx={{ p: 2, bgcolor: "success.50", border: "1px solid", borderColor: "success.200" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <HealthAndSafety color="success" fontSize="small" />
                      <Typography variant="subtitle1" fontWeight="bold" color="success.main">
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
                        <Button variant="outlined" size="small" color="success">
                          Details
                        </Button>
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

                <Grid item size={{xs: 12, md:6}}>
                  <Paper sx={{ p: 2, bgcolor: "info.50", border: "1px solid", borderColor: "info.200" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Vaccines color="info" fontSize="small" />
                      <Typography variant="subtitle1" fontWeight="bold" color="info.main">
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
                        <Button variant="outlined" size="small" color="info">
                          Details
                        </Button>
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
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{xs: 12, sm: 6, md: 2.4}}>
                    <Link href="#" underline="none">
                      <Card
                        sx={{
                          textAlign: "center",
                          p: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "success.50" },
                          transition: "all 0.3s",
                        }}
                      >
                        <HealthAndSafety color="success" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="body2" fontWeight="bold">
                          Health Check Campaign
                        </Typography>
                      </Card>
                    </Link>
                  </Grid>

                  <Grid item size={{xs: 12, sm: 6, md: 2.4}}>
                    <Link href="#" underline="none">
                      <Card
                        sx={{
                          textAlign: "center",
                          p: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "info.50" },
                          transition: "all 0.3s",
                        }}
                      >
                        <Vaccines color="info" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="body2" fontWeight="bold">
                          Vaccination Campaign
                        </Typography>
                      </Card>
                    </Link>
                  </Grid>

                  <Grid item size={{xs: 12, sm: 6, md: 2.4}}>
                    <Link href="#" underline="none">
                      <Card
                        sx={{
                          textAlign: "center",
                          p: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "warning.50" },
                          transition: "all 0.3s",
                        }}
                      >
                        <LocalHospital color="warning" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="body2" fontWeight="bold">
                          Medical Events
                        </Typography>
                      </Card>
                    </Link>
                  </Grid>

                  <Grid item size={{xs: 12, sm: 6, md: 2.4}}>
                    <Link href="#" underline="none">
                      <Card
                        sx={{
                          textAlign: "center",
                          p: 2,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "error.50" },
                          transition: "all 0.3s",
                        }}
                      >
                        <Send color="error" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="body2" fontWeight="bold">
                          Send Medication
                        </Typography>
                      </Card>
                    </Link>
                  </Grid>

                  <Grid item size={{xs: 12, sm: 6, md: 2.4}}>
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
                  <Medication color="error" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight="bold" color="error.main">
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
                      {injectedNoteObjs.map((item, index) => (
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
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Link href="#" underline="none">
                    <Button variant="outlined" size="small" color="error">
                      Details
                    </Button>
                  </Link>
                </Box>
              </CardContent>
            </Card>

            {/* New Medical Events */}
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <LocalHospital color="warning" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
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
                            Date Time
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
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Link href="#" underline="none">
                    <Button variant="outlined" size="small" color="warning">
                      Details
                    </Button>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default MainDashboardContent