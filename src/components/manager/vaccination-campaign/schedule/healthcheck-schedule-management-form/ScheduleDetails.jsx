import { useState } from "react"
import "./StyleScheduleDetails.scss"
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    LinearProgress,
    Fade,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material"
import {
    ArrowBack,
    ExpandMore,
    CheckCircle,
    Warning,
    Height,
    RemoveRedEye,
    Hearing,
    MedicalServices,
    Favorite,
    Psychology,
    Person,
    Assignment,
    MonitorWeight,
    Visibility,
    LocalHospital,
    SelfImprovement,
} from "@mui/icons-material"
import { useGetVaccinationHistoryByPupilId } from "../../../../../hooks/manager/vaccination/campaign/useGetVaccinationHistoryByPupilId"
import { useNavigate } from "react-router-dom"

const ScheduleDetails = ({ consentFormId, pupilData, pupilId, onBack }) => {
    // Debug: log incoming props
    const navigate = useNavigate();
    const { vaccinationHistory, loading: vaccinationLoading, error: vaccinationError } = useGetVaccinationHistoryByPupilId(pupilData?.pupilId || pupilId);

    // Show loading spinner if fetching
    if (vaccinationLoading) {
        return (
            <div className=" loading-container">
                <LinearProgress />
                <Typography variant="h6" sx={{ mt: 2, color: "#666" }}>
                    Loading student vaccination details...
                </Typography>
            </div>
        )
    }

    // Render vaccination history and pupil info only
    return (
        <div className="enhanced-ui" style={{
            background: 'linear-gradient(135deg, #fafdff 0%, #e3f0ff 100%)',
            minHeight: '100vh',
            padding: '24px 0',
        }}>
            <Fade in={true} timeout={400}>
                <Card elevation={0} sx={{
                    maxWidth: 1000,
                    mx: 'auto',
                    borderRadius: 4,
                    boxShadow: '0 2px 16px 0 rgba(33, 150, 243, 0.08)',
                    border: 'none',
                    background: 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(6px)',
                    p: { xs: 1.5, md: 3 },
                    position: 'relative',
                    overflow: 'visible',
                }}>
                    <CardContent sx={{ p: 0 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Box sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1976d2 60%, #64b5f6 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 1px 6px 0 #1976d233',
                            }}>
                                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800, fontFamily: 'inherit', fontSize: 20 }}>
                                    {pupilData?.lastName?.[0] || ''}{pupilData?.firstName?.[0] || ''}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 0.5, mb: 0.5, color: '#1976d2', fontFamily: 'inherit', fontSize: 22 }}>
                                    Vaccination Details
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#333', fontWeight: 500, fontSize: 15 }}>
                                    <span style={{ fontWeight: 700 }}>{pupilData?.lastName} {pupilData?.firstName}</span> <span style={{ color: '#1976d2', fontWeight: 700 }}>(ID: {pupilData?.pupilId || pupilId})</span>
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                    {/* Vaccination History Section */}
                    <Box mt={4}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2', mb: 2 }}>
                            Vaccination History
                        </Typography>
                        {vaccinationLoading ? (
                            <LinearProgress />
                        ) : vaccinationError ? (
                            <Typography color="error">Error loading vaccination history</Typography>
                        ) : vaccinationHistory && vaccinationHistory.length > 0 ? (
                            <TableContainer component={Paper} sx={{ mb: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Pupil ID</TableCell>
                                            <TableCell>Pupil Name</TableCell>
                                            <TableCell>Vaccine Name</TableCell>
                                            <TableCell>Disease Name</TableCell>
                                            <TableCell>Source</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Notes</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {vaccinationHistory.map((row, idx) => (
                                            <TableRow key={row.historyId || idx}>
                                                <TableCell>{row.pupilId}</TableCell>
                                                <TableCell>{row.pupilName}</TableCell>
                                                <TableCell>{row.vaccineName}</TableCell>
                                                <TableCell>{row.diseaseName}</TableCell>
                                                <TableCell>{row.source}</TableCell>
                                                <TableCell>{row.vaccinatedAt ? new Date(row.vaccinatedAt).toLocaleDateString() : '-'}</TableCell>
                                                <TableCell>{row.notes}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography color="text.secondary">No vaccination history found.</Typography>
                        )}
                    </Box>
                    <Box display="flex" justifyContent="flex-start" mt={3} mb={1} sx={{ pl: { xs: 0, md: 3 } }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={onBack}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                color: '#1976d2',
                                borderColor: '#b3d1fa',
                                boxShadow: '0 1px 4px 0 #1976d233',
                                textTransform: 'none',
                                background: 'rgba(255,255,255,0.85)',
                                '&:hover': {
                                    background: '#e3f0ff',
                                    borderColor: '#1976d2',
                                },
                                minWidth: 180,
                                fontSize: 16,
                            }}
                        >
                            Back to List
                        </Button>
                    </Box>
                </Card>
            </Fade>
        </div>
    );
}

export default ScheduleDetails
