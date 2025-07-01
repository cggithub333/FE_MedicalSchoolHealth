import React from "react"
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Chip,
    Box,
    Grid,
    CircularProgress,
    Alert,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
} from "@mui/material"
import {
    Vaccines as VaccinesIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    Campaign as CampaignIcon,
    FamilyRestroom as FamilyIcon,
} from "@mui/icons-material"
import { useGetVaccinationHistoryByPupilId } from "../../../../../../hooks/manager/vaccination/campaign/useGetVaccinationHistoryByPupilId"
import "./vaccination-history-details.scss"

const VaccinationHistoryDetails = ({ pupilId }) => {
    const { vaccinationHistory, loading, error } = useGetVaccinationHistoryByPupilId(pupilId)

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getSourceIcon = (source) => {
        return source === "CAMPAIGN" ? <CampaignIcon /> : <FamilyIcon />
    }

    const getSourceColor = (source) => {
        return source === "CAMPAIGN" ? "primary" : "secondary"
    }

    const getSourceLabel = (source) => {
        return source === "CAMPAIGN" ? "Campaign" : "Parent Declaration"
    }

    if (loading) {
        return (
            <Box className="vaccination-history-loading">
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading vaccination history...
                </Typography>
            </Box>
        )
    }

    if (error) {
        return (
            <Alert severity="error" className="vaccination-history-error">
                <Typography variant="h6">Error loading vaccination history</Typography>
                <Typography variant="body2">{error.message || "An unexpected error occurred"}</Typography>
            </Alert>
        )
    }

    if (!vaccinationHistory || vaccinationHistory.length === 0) {
        return (
            <Paper className="vaccination-history-empty">
                <VaccinesIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    No vaccination history found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    This pupil has no recorded vaccinations yet.
                </Typography>
            </Paper>
        )
    }

    const pupilName = vaccinationHistory[0]?.pupilName || "Unknown"
    const totalVaccinations = vaccinationHistory.length
    const campaignVaccinations = vaccinationHistory.filter((v) => v.source === "CAMPAIGN").length
    const parentDeclarations = vaccinationHistory.filter((v) => v.source === "PARENT_DECLARATION").length

    return (
        <div className="vaccination-history-container">
            {/* Header Card */}
            <Card className="vaccination-history-header">
                <CardHeader
                    avatar={
                        <Avatar className="pupil-avatar">
                            <PersonIcon />
                        </Avatar>
                    }
                    title={
                        <Typography variant="h5" component="h1">
                            {pupilName}'s Vaccination History
                        </Typography>
                    }
                    subheader={
                        <Typography variant="subtitle1" color="text.secondary">
                            Pupil ID: {pupilId}
                        </Typography>
                    }
                />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Box className="stat-box">
                                <Typography variant="h3" color="primary">
                                    {totalVaccinations}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Vaccinations
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box className="stat-box">
                                <Typography variant="h3" color="success.main">
                                    {campaignVaccinations}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Campaign Vaccinations
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box className="stat-box">
                                <Typography variant="h3" color="info.main">
                                    {parentDeclarations}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Parent Declarations
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Vaccination History List */}
            <Card className="vaccination-history-list">
                <CardHeader title={<Typography variant="h6">Vaccination Records</Typography>} />
                <CardContent>
                    <List>
                        {vaccinationHistory.map((vaccination, index) => (
                            <React.Fragment key={vaccination.historyId}>
                                <ListItem className="vaccination-item">
                                    <ListItemAvatar>
                                        <Avatar className={`vaccine-avatar ${vaccination.source.toLowerCase()}`}>
                                            <VaccinesIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box className="vaccination-primary">
                                                <Typography variant="h6" component="span">
                                                    {vaccination.vaccineName}
                                                </Typography>
                                                <Chip
                                                    icon={getSourceIcon(vaccination.source)}
                                                    label={getSourceLabel(vaccination.source)}
                                                    color={getSourceColor(vaccination.source)}
                                                    size="small"
                                                    className="source-chip"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box className="vaccination-details">
                                                <Typography variant="body2" color="text.primary">
                                                    <strong>Disease:</strong> {vaccination.diseaseName}
                                                </Typography>

                                                {vaccination.campaignName && (
                                                    <Typography variant="body2" color="text.primary">
                                                        <strong>Campaign:</strong> {vaccination.campaignName}
                                                    </Typography>
                                                )}

                                                <Box className="vaccination-meta">
                                                    <Box className="date-info">
                                                        <CalendarIcon fontSize="small" />
                                                        <Typography variant="body2">{formatDate(vaccination.vaccinatedAt)}</Typography>
                                                    </Box>
                                                </Box>

                                                {vaccination.notes && (
                                                    <Typography variant="body2" className="vaccination-notes">
                                                        <strong>Notes:</strong> {vaccination.notes}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < vaccinationHistory.length - 1 && <Divider variant="inset" component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </div>
    )
}

export default VaccinationHistoryDetails
