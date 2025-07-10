import { useState } from "react"
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Avatar,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Switch,
    FormControlLabel,
    Grid,
    IconButton,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
} from "@mui/material"
import {
    PhotoCamera,
    Edit,
    Save,
    Cancel,
    Person,
    Email,
    Phone,
    CalendarToday,
    Badge,
    CheckCircle,
    Cancel as CancelIcon,
    AccountCircle,
} from "@mui/icons-material"
import "./StyleProfile.scss"
import { useGetInformation } from "@hooks/schoolnurse/main-contents/useGetInformation"
import { useGetAllPupilsOfEachParent } from "@hooks/schoolnurse/main-contents/useGetAllPupilsOfEachParent"

const ProfileComponent = () => {
    const { information, loading, error } = useGetInformation();
    const { pupils } = useGetAllPupilsOfEachParent(); // Destructure pupils from the hook
    const pupil = Array.isArray(pupils) ? pupils.find(p => p.pupilId === "PP0006") : null;
    console.log("Pupils data:", pupil); // Log pupils data for debugging
    const formData = {
        userId: pupil?.pupilId || "",
        firstName: pupil?.firstName || "",
        lastName: pupil?.lastName || "",
        gender: pupil?.gender || "",
        gradeName: pupil?.gradeName || "",
        birthDate: pupil?.birthDate || "",
        role: "Pupils",
        avatar: information?.avatar || "",
        createAt: pupil?.startYear
    }

    const roles = [
        { value: "admin", label: "Administrator" },
        { value: "schoolNurse", label: "School Nurse" },
        { value: "manager", label: "Manager" },
        { value: "parent", label: "Parent" },
    ]

    const getRoleColor = (role) => {
        const colors = {
            admin: "error",
            schoolNurse: "info",
            manager: "warning",
            parent: "success",
        }
        return colors[role] || "default"
    }

    const getRoleLabel = (role) => {
        const labels = {
            admin: "Administrator",
            schoolNurse: "School Nurse",
            manager: "Manager",
            parent: "Parent",
        }
        return labels[role] || role
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        // Handle 'DD-MM-YYYY' format
        const ddmmyyyy = /^\d{2}-\d{2}-\d{4}$/;
        let dateObj;
        if (ddmmyyyy.test(dateString)) {
            const [day, month, year] = dateString.split("-");
            dateObj = new Date(`${year}-${month}-${day}`);
        } else {
            dateObj = new Date(dateString);
        }
        if (isNaN(dateObj.getTime())) return "Not specified";
        return dateObj.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const profileDetails = [
        {
            icon: <AccountCircle />,
            label: "User ID",
            value: formData.userId || "Not specified",
        },
        {
            icon: <Person />,
            label: "First Name",
            value: formData.firstName || "Not specified",
        },
        {
            icon: <Person />,
            label: "Last Name",
            value: formData.lastName || "Not specified",
        },
        {
            icon: <Email />,
            label: "Grade Name",
            value: formData.gradeName || "Not specified",
        },
        {
            icon: <Phone />,
            label: "Gender",
            value: formData.gender || "Not specified",
        },
        {
            icon: <CalendarToday />,
            label: "Birth Date",
            value: formatDate(formData.birthDate),
        },
    ]


    return (
        <Grid container className="profile-container" spacing={3}>
            {/* Header Section */}
            <Grid item size={12}>
                <Card className="profile-header">
                    <CardContent>
                        <Grid container alignItems="center" className="header-content" spacing={2} sx={{ marginX: 30 }}>
                            <Grid item className="avatar-section">
                                <Avatar src={formData.avatar} className="profile-avatar" sx={{ width: 120, height: 120, position: "relative", right: 200 }}>
                                    {formData.firstName?.[0]?.toUpperCase() || "U"}
                                </Avatar>
                            </Grid>

                            <Grid item xs sx={{ position: "relative", right: 200 }}>
                                <Box className="user-info">
                                    <Typography variant="h4" className="user-name">
                                        {formData.firstName} {formData.lastName}
                                    </Typography>
                                    <Box className="profile-badges">
                                        <Chip
                                            label={getRoleLabel(formData.role)}
                                            color={getRoleColor(formData.role)}
                                            size="medium"
                                            className="role-chip"
                                        />
                                        {/* <Chip
                                            icon={formData.isActive ? <CheckCircle /> : <CancelIcon />}
                                            label={formData.isActive ? "Active" : "Inactive"}
                                            color={formData.isActive ? "success" : "error"}
                                            size="medium"
                                            className="status-chip"
                                        /> */}
                                    </Box>
                                    <Typography variant="body2" className="member-since">
                                        Member since: {formData.createAt}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Profile Details & Account Summary */}
            <Grid item size={12}>
                <Grid container spacing={3}>
                    <Grid item size={6} md={8}>
                        <Card className="profile-details">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Profile Information
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                <List className="details-list">
                                    {profileDetails.map((detail, index) => (
                                        <ListItem key={index} className="detail-item">
                                            <ListItemIcon className="detail-icon">{detail.icon}</ListItemIcon>
                                            <ListItemText primary={detail.label} secondary={detail.value} className="detail-text" />
                                        </ListItem>
                                    ))}

                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item size={6} md={4}>
                        <Card className="summary-card">
                            <CardContent>
                                <Typography variant="h6" gutterBottom className="section-title">
                                    Parent's Contact
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box className="summary-content">
                                    <Paper className="summary-item" elevation={1}>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            Emergency Contact
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 2, background: '#fafafa' }}>
                                            <Grid container spacing={5}>
                                                <Grid item size={12}>
                                                    <Typography variant="body1" fontWeight={600}>Name : {information.firstName} {information.lastName}</Typography>
                                                </Grid>
                                                <Grid item size={12}>
                                                    <Typography variant="body1" fontWeight={600}>Phone Number : {information.phoneNumber}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>

                                    </Paper>
                                </Box>
                            </CardContent>
                        </Card>

                    </Grid>
                </Grid>
            </Grid>
        </Grid >
    )
}

export default ProfileComponent
