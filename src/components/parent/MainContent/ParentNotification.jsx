"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  Chip,
  Divider,
  Alert,
  Skeleton,
  Badge,
  Paper,
  Grid,
  Pagination,
} from "@mui/material"
import {
  Notifications,
  Vaccines,
  LocalHospital,
  AccessTime,
  ArrowForwardIos,
  NotificationsNone,
} from "@mui/icons-material"
import { Link } from "react-router-dom"

import { GiMedicinePills as SendMedicationIcon } from "react-icons/gi";
import { LuBriefcaseMedical as MedicalEventIcon } from "react-icons/lu";

import useAllNotifications from "@hooks/parent/health-check/useAllNotifications"

const ITEMS_PER_PAGE = 5;

const ParentNotifications = () => {

  const { notifications, loading, error, refetch } = useAllNotifications()

  const location = useLocation();

  useEffect(() => {

   // oncly scroll after notifications are loadted and not loading:
    if (!loading && notifications && notifications.length > 0) {
      
      // small delay to ensure the page is fully rendered
      const timer = setTimeout(() => {
        // get the hash value from the URL:
        const hashVal = location.hash;

        if (hashVal === "#vaccination-campaign") {

          // get the element with id get is the type of notification
          const element = document.getElementById("VACCINATION_CAMPAIGN");
          if (element) {
            // scroll to the element with id "VACCINATION_CAMPAIGN"
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
        else if (hashVal === "#health-check-campaign") {
          // get the element with id get is the type of notification
          const element = document.getElementById("HEALTH_CHECK_CAMPAIGN");
          if (element) {
            // scroll to the element with id "HEALTH_CHECK_CAMPAIGN"
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
        else if (hashVal === "#medical-events") {
          // get the element with id get is the type of notification
          const element = document.getElementById("MED_EVENT");
          if (element) {
            // scroll to the element with id "MED_EVENT"
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
        else if (hashVal === "#send-medication") {
          // get the element with id get is the type of notification
          const element = document.getElementById("SEND_MEDICAL");
          if (element) {
            // scroll to the element with id "SEND_MEDICAL"
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, 250) // 250ms delay to ensure the page is fully rendered

      // cleanup function to clear the timer
      // this is important to avoid memory leaks
      return () => { clearTimeout(timer)}
    }

  }, [location.hash, loading, notifications])

  {
    const [pageIndex, setPageIndex] = useState(
      {
        "VACCINATION_CAMPAIGN": 1,
        "HEALTH_CHECK_CAMPAIGN": 1,
        "SEND_MEDICAL": 1,
        "MED_EVENT": 1,
      }
    );

    // Debug log
    // console.log("Notifications:\n", JSON.stringify(notifications))

    const getNotificationIcon = (type) => {
      switch (type) {
        case "VACCINATION_CAMPAIGN":
          return <Vaccines />
        case "HEALTH_CHECK_CAMPAIGN":
          return <LocalHospital />
        case "SEND_MEDICAL":
          return <SendMedicationIcon/>
        case "MED_EVENT":
          return <MedicalEventIcon />
        default:
          return <Notifications />
      }
    }

    const getNotificationColor = (type) => {
      switch (type) {
        case "VACCINATION_CAMPAIGN":
          return "success"
        case "HEALTH_CHECK_CAMPAIGN":
          return "primary"
        case "SEND_MEDICAL":
          return "warning"
        case "MED_EVENT":
          return "error"
        default:
          return "default"
      }
    }

    const getPaginationBtnColor = (type) => {

      //debug log:
      // console.log("getPaginationColor called with type:", type);

      switch (type) {
        case "VACCINATION_CAMPAIGN":
          return "success"
        case "HEALTH_CHECK_CAMPAIGN":
          return "primary"
        case "SEND_MEDICAL":
          return "warning"
        case "MED_EVENT":
          return "error"
        default:
          return "default"
      }
    }

    const getNotificationRoute = (type) => {
      switch (type) {
        case "VACCINATION_CAMPAIGN": 
          return "../vaccination-campaign/surveys"
        case "HEALTH_CHECK_CAMPAIGN":
          return "../health-check-campaign/surveys"
        case "SEND_MEDICAL":
          return "../prescription/prescription-logs"
        case "MED_EVENT":
          return "../medical-events"
        default:
          return "#"
      }
    }

    const getNotificationTypeText = (type) => {
      switch (type) {
        case "VACCINATION_CAMPAIGN":
          return "Vaccination Campaign"
        case "HEALTH_CHECK_CAMPAIGN":
          return "Health Check Campaign"
        case "SEND_MEDICAL":
          return "Medication Taking"
        case "MED_EVENT":
          return "Medical Event"
        default:
          return "Notification"
      }
    }

    const formatDate = (dateString) => {
      return dateString
    }

    // group notifications by type (e.g., VACCINATION_CAMPAIGN group, HEALTH_CHECK_CAMPAIGN group)
    const groupNotificationsByType = (notifications) => {
      const notificationByType = notifications.reduce((groups, notification) => {
        const type = notification.typeNotification
        if (!groups[type]) {
          groups[type] = [] // Initialize the array for this type if it doesn't exist
        }
        groups[type].push(notification) // Add the notification to the appropriate type group
        return groups
      }, {})

      // sort each group by createdAt date in descending order
      Object.keys(notificationByType) // get all keys (types) of the grouped notifications
            .forEach(type => {
              notificationByType[type].sort((a, b) => b.notificationId - a.notificationId);
            })
      return notificationByType
    }

    const renderLoadingSkeleton = () => (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={200} height={40} />
        </Box>

        {[1, 2, 3, 4].map((index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="60%" height={20} />
                </Box>
                <Skeleton variant="rectangular" width={80} height={32} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Container>
    )

    if (loading) {
      return renderLoadingSkeleton()
    }

    if (error) {
      return (
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Alert severity="error">Có lỗi xảy ra khi tải thông báo: {error}</Alert>
        </Container>
      )
    }

    const groupedNotifications = groupNotificationsByType(notifications)

    return (
      <Container
        maxWidth={false} // Override the default maxWidth
        sx={{
          py: 3,
          maxWidth: "1000px", // Set your custom maxWidth
          '@media (min-width: 600px)': {
            maxWidth: "1000px",
          }
        }}
      >
        {/* Header */}
        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Link to="#vaccination-campaign" style={{ textDecoration: "none" }}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "success.50", ...hoverPaper, cursor: "pointer" }}>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {groupedNotifications.VACCINATION_CAMPAIGN?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vaccination
                </Typography>
              </Paper>
            </Link>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Link to="#health-check-campaign" style={{ textDecoration: "none" }}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "primary.50", ...hoverPaper, cursor: "pointer" }}>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {groupedNotifications.HEALTH_CHECK_CAMPAIGN?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Health Check
                </Typography> 
              </Paper>
            </Link>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Link to="#medical-events" style={{ textDecoration: "none" }}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "primary.50", ...hoverPaper, cursor: "pointer" }}>
                <Typography variant="h4" fontWeight="bold" color="red">
                  {groupedNotifications.MED_EVENT?.length || 0}
                </Typography>
                <Typography variant="body2" color="red">
                  Medical Events
                </Typography>
              </Paper>
            </Link>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Link to="#send-medication" style={{ textDecoration: "none" }}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "primary.50", ...hoverPaper, cursor: "pointer" }}>
                <Typography variant="h4" fontWeight="bold" color="orange">
                  {groupedNotifications.SEND_MEDICAL?.length || 0}
                </Typography>
                <Typography variant="body2" color="orange">
                  Medication Taking
                </Typography>
              </Paper>
            </Link>
          </Grid>
        </Grid>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <NotificationsNone sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                No Notifications
              </Typography>
              <Typography color="text.secondary">No notifications for current</Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Object.entries(groupedNotifications).map(([type, typeNotifications], idx) => (
              <Box key={type} sx={{ marginBottom: 10 }}>
                {/* Section Header */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                  <Avatar sx={{ bgcolor: `${getNotificationColor(type)}.main`, width: 32, height: 32 }}>
                    {getNotificationIcon(type)}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" id={type}>
                    {getNotificationTypeText(type)}
                  </Typography>
                  <Chip
                    label={typeNotifications.length}
                    size="small"
                    color={getNotificationColor(type)}
                    variant="outlined"
                  />
                </Box>

                {/* Notifications in this category */}
                {typeNotifications.map((notification, idx) => {

                  // find skip index:
                  const pageIndexByType = pageIndex[type] || 1;
                  const startIndex = (pageIndexByType - 1) * ITEMS_PER_PAGE;
                  const endIndex = startIndex + ITEMS_PER_PAGE;

                  if (idx < startIndex || idx >= endIndex) { // get each items per page [startIndex, endIndex)
                    return null; // Skip rendering this notification
                  }

                  let isApprovedOrRejectedSendMedicationNoti = false;
                  const markedMsg = ['has been approved', 'has been rejected'];
                  if (type === "SEND_MEDICAL" && notification.message) {
                    isApprovedOrRejectedSendMedicationNoti = markedMsg.some(msg => notification.message.includes(msg));
                  }

                  return (
                    <Link
                      key={notification.notificationId}
                      to={isApprovedOrRejectedSendMedicationNoti ? "/parent/prescription" : getNotificationRoute(notification.typeNotification)}
                      style={{ textDecoration: "none" }}
                    >
                      <Card
                        sx={{
                          width: "100%",
                          mb: 1,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateX(8px)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                            bgcolor: `${getNotificationColor(notification.typeNotification)}.50`,
                          },
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {/* Notification Icon */}
                            <Avatar
                              sx={{
                                bgcolor: `${getNotificationColor(notification.typeNotification)}.main`,
                                width: 48,
                                height: 48,
                              }}
                            >
                              {getNotificationIcon(notification.typeNotification)}
                            </Avatar>

                            {/* Notification Content */}
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" fontWeight="500" sx={{ mb: 0.5, lineHeight: 1.4 }}>
                                {notification.message}
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <AccessTime fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(notification.createdAt)}
                                </Typography>
                                <Chip
                                  label={getNotificationTypeText(notification.typeNotification)}
                                  size="small"
                                  color={getNotificationColor(notification.typeNotification)}
                                  variant="outlined"
                                />
                              </Box>
                            </Box>

                            {/* Arrow Icon */}
                            <ArrowForwardIos color="action" fontSize="small" />
                          </Box>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}

                {/* Divider between sections */}
                {Object.keys(groupedNotifications).indexOf(type) < Object.keys(groupedNotifications).length - 1 && (
                  <Divider sx={{ my: 3 }} />
                )}

                <Grid container justifyContent={'center'} py={1}>
                  <Grid size={{ xs: 10, md: 10 }} sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Pagination
                      count={typeNotifications.length > 0 ? Math.ceil(typeNotifications.length / 5) : 1}
                      size={'large'}
                      variant="outlined"
                      color={getPaginationBtnColor(type)}
                      onChange={(e) => {
                        //debug log:
                        setPageIndex((prev) => ({
                          // first, clone previous state
                          ...prev,

                          // then update the specific type's page index based on the button clicked
                          // e.target.textContent will be "Next", "Previous", or the page number
                          [type]: e.target.textContent === "Next" ? 
                                      (prev[type] + 1) 
                                      : 
                                      (
                                        e.target.textContent === "Previous" ? prev[type] - 1 : parseInt(e.target.textContent)
                                      )

                        }))
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    )
  }
}
const hoverPaper = {
  transition: "all 0.9s ease",
  "&:hover": {
    boxShadow: 3,
    transform: "translateY(-10px)",
  },
}

export default ParentNotifications;