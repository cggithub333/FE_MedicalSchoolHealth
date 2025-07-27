import { useEffect, useState } from "react"
import "./StyleScheduleInjectedList.scss"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    TextField,
    Button,
    LinearProgress,
    Chip,
    Avatar,
    IconButton,
    Fade,
    Grow,
    Snackbar,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Typography,
    Box,
    Divider,
    Tabs,
    Tab,
    Badge,
    Slide,
} from "@mui/material"
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    FileDownload as FileDownloadIcon,
    Visibility as VisibilityIcon,
    Schedule as ScheduleIcon,
    Groups as GroupsIcon,
    CheckCircle as CheckCircleIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    PendingActions as PendingActionsIcon,
    Download as DownloadIcon,
    SelectAll as SelectAllIcon,
} from "@mui/icons-material"
import AlertMui from '@mui/material/Alert';
import InfoIcon from '@mui/icons-material/Info';
import { useSaveResultOfVaccinationCampaign } from "../../../../../hooks/schoolnurse/vaccination/vaccination/useSaveResultOfVaccinationCampaign"
import ScheduleDetails from "../healthcheck-schedule-management-form/ScheduleDetails.jsx"
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { useGetAllConsentFormByStatus } from "../../../../../hooks/schoolnurse/vaccination/vaccination/useGetAllConsentFormByStatus";
import { showSuccessToast, showErrorToast } from '../../../../../utils/toast-utils';

const ScheduleInjectedList = ({ shift, campaign, onBack }) => {
    const injectedResult = useGetAllConsentFormByStatus(campaign.campaignId, "INJECTED");
    const noShowResult = useGetAllConsentFormByStatus(campaign.campaignId, "NO_SHOW");
    const notYetResult = useGetAllConsentFormByStatus(campaign.campaignId, "APPROVED");
    const allResult = useGetAllConsentFormByStatus(campaign.campaignId, "APPROVED");

    console.log("Injected Result:", injectedResult);
    console.log("No Show Result:", noShowResult);
    console.log("Not Yet Result:", notYetResult);
    console.log("All Result:", allResult);


    const isLoading = injectedResult.isLoading || noShowResult.isLoading || allResult.isLoading;

    const [selectedPupil, setSelectedPupil] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [animateRows, setAnimateRows] = useState(false)
    const [savingIndex, setSavingIndex] = useState(null)
    const [confirmDialog, setConfirmDialog] = useState({ open: false, idx: null, status: null, label: '', notes: '' });
    const { saveResultOfVaccinationCampaign, isSaving } = useSaveResultOfVaccinationCampaign();
    const [selectedTab, setSelectedTab] = useState(0);
    // Add missing students state
    const [students, setStudents] = useState([]);

    // Trigger animations when data loads
    useEffect(() => {
        if (!isLoading) {
            setAnimateRows(true);
        }
    }, [isLoading]);

    const grade = Number(shift.grade);

    // Helper function to extract grade number from various formats
    const extractGradeNumber = (gradeValue) => {
        if (!gradeValue) return 0;
        if (typeof gradeValue === 'number') return gradeValue;
        if (typeof gradeValue === 'string') {
            if (gradeValue.startsWith('GRADE_')) {
                return Number(gradeValue.replace('GRADE_', ''));
            }
            const num = Number(gradeValue);
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };

    const pupilsByGrade = (allResult.consentForms || []).filter(p => {
        const pupilGrade = extractGradeNumber(p.gradeLevel || p.grade || p.Grade);
        return pupilGrade === grade;
    });

    const injectedByGrade = (injectedResult.consentForms || []).filter(p => {
        const pupilGrade = extractGradeNumber(p.gradeLevel || p.grade || p.Grade);
        return pupilGrade === grade;
    });

    const noShowByGrade = (noShowResult.consentForms || []).filter(p => {
        const pupilGrade = extractGradeNumber(p.gradeLevel || p.grade || p.Grade);
        return pupilGrade === grade;
    });

    // Calculate NOT_YET students (those who are not INJECTED or NO_SHOW)
    const injectedIds = new Set(injectedByGrade.map(p => p.pupilId));
    const noShowIds = new Set(noShowByGrade.map(p => p.pupilId));
    const notYetByGrade = pupilsByGrade.filter(p => !injectedIds.has(p.pupilId) && !noShowIds.has(p.pupilId));

    const statusCounts = {
        INJECTED: injectedByGrade.length,
        NO_SHOW: noShowByGrade.length,
        NOT_YET: notYetByGrade.length,
    };

    const statusTabs = [
        { key: "INJECTED", label: "Injected" },
        { key: "NO_SHOW", label: "Absent" },
        { key: "NOT_YET", label: "Not Yet" },
    ]

    const normalize = (p) => {
        // Parse name from pupilName field (API response shows "Le Van" format)
        let firstName = '';
        let lastName = '';

        if (p.firstName && p.lastName) {
            firstName = p.firstName;
            lastName = p.lastName;
        } else if (p.pupilName) {
            // Based on API response: "pupilName": "Le Van"
            // Assuming format is "LastName FirstName" or "FirstName LastName"
            const parts = p.pupilName.trim().split(' ');
            if (parts.length >= 2) {
                // Assuming "Le Van" means "Le" is last name, "Van" is first name
                lastName = parts[0];
                firstName = parts.slice(1).join(' ');
            } else {
                firstName = parts[0] || '';
            }
        }

        const gradeNumber = extractGradeNumber(p.gradeLevel || p.grade || p.Grade);

        return {
            pupilId: p.pupilId,
            consentFormId: p.consentFormId,
            firstName: firstName,
            lastName: lastName,
            Grade: gradeNumber,
            avatar: p.avatar || `/placeholder.svg?height=40&width=40`,
            completed: p.status === 'INJECTED',
            time: p.respondedAt ? (new Date(p.respondedAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            notes: p.notes || '',
            status: p.status || '',
        }
    }

    let filteredStudents = [];
    if (selectedTab === 0) filteredStudents = injectedByGrade.map(normalize);
    else if (selectedTab === 1) filteredStudents = noShowByGrade.map(normalize);
    else filteredStudents = notYetByGrade.map(normalize);

    // Update students state when filteredStudents changes
    useEffect(() => {
        setStudents(filteredStudents);
    }, [selectedTab, injectedResult.consentForms, noShowResult.consentForms, allResult.consentForms]);

    // Progress calculation
    const total = pupilsByGrade.length;
    const injectedCount = injectedByGrade.length;
    const progressPercentage = total > 0 ? (injectedCount / total) * 100 : 0;
    const remaining = total - injectedCount;

    const handleCheck = (index) => {
        if (index >= students.length) return;

        const student = students[index];
        const newStatus = !student.completed ? 'INJECTED' : 'NO_SHOW';
        setConfirmDialog({
            open: true,
            idx: index,
            status: newStatus,
            label: newStatus === 'INJECTED'
                ? `mark ${student.firstName} ${student.lastName} as INJECTED`
                : `mark ${student.firstName} ${student.lastName} as NO_SHOW`,
            notes: student.notes || ''
        });
    };

    const handleNO_SHOW = (idx) => {
        if (idx >= students.length) return;

        const student = students[idx];
        setConfirmDialog({
            open: true,
            idx,
            status: 'NO_SHOW',
            label: `mark ${student.firstName} ${student.lastName} as NO_SHOW`,
            notes: student.notes || ''
        });
    };

    const handleConfirmSave = async () => {
        const { idx, status, notes } = confirmDialog;
        setSavingIndex(idx);
        setConfirmDialog({ ...confirmDialog, open: false });

        if (idx >= students.length) {
            setSavingIndex(null);
            return;
        }

        const student = students[idx];
        const consentFormId = student.consentFormId;

        if (!consentFormId) {
            showErrorToast("Consent Form ID missing!");
            setSnackbar({ open: true, message: "Consent Form ID missing!", severity: "error" });
            setSavingIndex(null);
            return;
        }

        try {
            const success = await saveResultOfVaccinationCampaign(consentFormId, status, notes);

            if (success) {
                showSuccessToast(`Status saved as ${status} for ${student.firstName} ${student.lastName}.`);
                // Update local state optimistically
                const updated = [...students];
                if (status === 'INJECTED') {
                    updated[idx].completed = true;
                    const now = new Date();
                    const hours = String(now.getHours()).padStart(2, "0");
                    const minutes = String(now.getMinutes()).padStart(2, "0");
                    updated[idx].time = `${hours}:${minutes}`;
                } else {
                    updated[idx].completed = false;
                    updated[idx].time = '';
                }
                updated[idx].status = status;
                setStudents(updated);

                setSnackbar({
                    open: true,
                    message: `Status saved as ${status} for ${student.firstName} ${student.lastName}.`,
                    severity: "success"
                });

                // Refresh data from API to ensure consistency
                setTimeout(() => {
                    // The useEffect hooks will automatically refetch data
                    injectedResult.refetch?.();
                    noShowResult.refetch?.();
                    allResult.refetch?.();
                }, 500);
            } else {
                showErrorToast("Failed to save status.");
                setSnackbar({ open: true, message: "Failed to save status.", severity: "error" });
            }
        } catch (error) {
            console.error("Error saving vaccination result:", error);
            showErrorToast("Error saving status.");
            setSnackbar({ open: true, message: "Error saving status.", severity: "error" });
        } finally {
            setSavingIndex(null);
        }
    };

    const handleNoteChange = (index, newValue) => {
        if (index >= students.length) return;

        const updated = [...students];
        updated[index].notes = newValue;
        setStudents(updated);
    }

    const handleExport = () => {
        setSnackbar({
            open: true,
            message: "Export functionality coming soon!",
            severity: "info",
        })
    }

    if (isLoading) {
        return (
            <div className="schedule-list-root loading-container">
                <CircularProgress size={60} sx={{ color: "#1976d2" }} />
                <Typography variant="h6" sx={{ mt: 2, color: "#666" }}>
                    Loading Grade {shift.grade} students...
                </Typography>
            </div>
        )
    }

    if (selectedPupil) {
        return (
            <ScheduleDetails
                pupilId={selectedPupil.pupilId}
                pupilData={selectedPupil}
                onBack={() => setSelectedPupil(null)}
            />
        )
    }

    return (
        <div>
            <Fade in={true} timeout={500}>
                <Card className="schedule-list-header" elevation={0}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <IconButton
                                    onClick={onBack}
                                    className="back-button"
                                    sx={{
                                        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                                        color: "white",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #1565c0, #1976d2)",
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                                <Box>
                                    <Typography variant="h4" className="header-title">
                                        {campaign.titleCampaign}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={2} mt={1}>
                                        <Chip
                                            icon={<ScheduleIcon />}
                                            label={shift.time}
                                            color="primary"
                                            variant="outlined"
                                        />
                                        <Chip icon={<GroupsIcon />} label={`Grade ${shift.grade} Only`} color="secondary" variant="filled" />
                                        <Chip label={campaign.vaccineName} color="success" variant="outlined" />
                                    </Box>
                                </Box>
                            </Box>
                            <Box display="flex" gap={1}>
                                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport} className="action-button">
                                    Export
                                </Button>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        {/* Progress Section */}
                        <Box className="progress-section">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h6" className="progress-title">
                                    Vaccination Progress - Grade {shift.grade}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={progressPercentage}
                                className="progress-bar"
                                sx={{
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: "#e3f2fd",
                                    "& .MuiLinearProgress-bar": {
                                        borderRadius: 6,
                                        background: "linear-gradient(90deg, #43a047, #66bb6a)",
                                    },
                                }}
                            />
                            <Box display="flex" justifyContent="space-between" mt={1}>
                                <Chip
                                    icon={<CheckCircleIcon />}
                                    label={`${injectedCount} Completed`}
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                />
                                <Chip
                                    icon={<PendingActionsIcon />}
                                    label={`${remaining} Remaining`}
                                    color="warning"
                                    variant="outlined"
                                    size="small"
                                />
                                <Typography variant="body2" color="primary" fontWeight={600}>
                                    {progressPercentage.toFixed(1)}% Complete
                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        {/* Status Tabs UI */}
                        <Slide direction="down" in timeout={600}>
                            <Paper sx={{ mb: 2, borderRadius: 2, boxShadow: 1, background: '#f8fafc' }}>
                                <Tabs
                                    value={selectedTab}
                                    onChange={(_, v) => setSelectedTab(v)}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    sx={{
                                        '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: '1rem' },
                                        '& .Mui-selected': { background: 'linear-gradient(135deg, #43a047, #66bb6a)', color: 'white', borderRadius: '8px 8px 0 0' },
                                    }}
                                >
                                    {statusTabs.map((tab, idx) => (
                                        <Tab
                                            key={tab.key}
                                            label={
                                                <Badge badgeContent={statusCounts[tab.key]} color="primary">
                                                    {tab.label}
                                                </Badge>
                                            }
                                        />
                                    ))}
                                </Tabs>
                            </Paper>
                        </Slide>
                    </CardContent>
                </Card>
            </Fade>
            <Fade in={true} timeout={700}>
                <Card className="students-table-container" elevation={0}>
                    <TableContainer component={Paper} elevation={0}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="table-header" align="center">
                                        Status
                                    </TableCell>
                                    <TableCell className="table-header">Student Information</TableCell>
                                    <TableCell className="table-header" align="center">
                                        Grade
                                    </TableCell>
                                    <TableCell className="table-header" align="center">
                                        Time Completed
                                    </TableCell>
                                    {/* <TableCell className="table-header">Notes</TableCell> */}
                                    <TableCell className="table-header" align="center">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student, idx) => (
                                    <Grow in={animateRows} timeout={300 + idx * 50} key={student.pupilId}>
                                        <TableRow
                                            className={`student-row ${student.completed ? "completed-row" : ""}`}
                                            hover
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor: student.completed ? "#e8f5e9" : "#f5f5f5",
                                                },
                                            }}
                                        >
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={student.completed}
                                                    onChange={selectedTab === 2 ? () => handleCheck(idx) : undefined}
                                                    color="success"
                                                    icon={<CheckCircleOutlineIcon />}
                                                    checkedIcon={<CheckCircleIcon />}
                                                    sx={{
                                                        transform: "scale(1.2)",
                                                        "&.Mui-checked": {
                                                            color: "#43a047",
                                                        },
                                                    }}
                                                    disabled={savingIndex === idx || isSaving || selectedTab !== 2}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Avatar
                                                        src={student.avatar}
                                                        alt={`${student.lastName} ${student.firstName}`}
                                                        sx={{ width: 48, height: 48, border: "2px solid #e3f2fd" }}
                                                    >
                                                        {student.lastName?.[0]}
                                                        {student.firstName?.[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight={600} className="student-name">
                                                            {student.lastName} {student.firstName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" className="student-id">
                                                            ID: {student.pupilId}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={student.Grade}
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {savingIndex === idx ? (
                                                    <Typography variant="body2" color="primary">Saving...</Typography>
                                                ) : student.completed ? (
                                                    <Chip
                                                        icon={<CheckCircleIcon />}
                                                        label={student.time}
                                                        color="success"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        —
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            {/* <TableCell>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    value={student.notes}
                                                    onChange={(e) => handleNoteChange(idx, e.target.value)}
                                                    placeholder="Add notes..."
                                                    className="notes-field"
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 2,
                                                            "&:hover fieldset": {
                                                                borderColor: "#1976d2",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </TableCell> */}
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => setSelectedPupil(student)}
                                                    className="details-button"
                                                    sx={{
                                                        background: "linear-gradient(135deg, #43a047, #66bb6a)",
                                                        "&:hover": {
                                                            background: "linear-gradient(135deg, #388e3c, #43a047)",
                                                            transform: "translateY(-1px)",
                                                        },
                                                    }}
                                                >
                                                    Details
                                                </Button>
                                                {selectedTab === 2 && (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => handleNO_SHOW(idx)}
                                                        className="details-button"
                                                        sx={{
                                                            background: "linear-gradient(135deg,rgb(165, 53, 61),rgb(187, 77, 77))",
                                                            "&:hover": {
                                                                background: "linear-gradient(135deg,rgb(168, 69, 69),rgb(142, 54, 54))",
                                                                transform: "translateY(-1px)",
                                                            },
                                                            marginLeft: 3,
                                                        }}
                                                        disabled={savingIndex === idx || isSaving}
                                                    >
                                                        Absent
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </Grow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Fade>
            <Fade in={true} timeout={900}>
                <Box className="action-footer">
                    <Button variant="outlined" size="large" startIcon={<ArrowBackIcon />} onClick={onBack} className="footer-button">
                        Back to Schedule
                    </Button>
                </Box>
            </Fade>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <AlertMui onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </AlertMui>
            </Snackbar>
            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}>
                <DialogTitle>Confirm Save</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to {confirmDialog.label}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })} color="inherit">Cancel</Button>
                    <Button onClick={handleConfirmSave} color="primary" variant="contained">Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ScheduleInjectedList