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


const ProfileComponent = () => {
    const { information, loading, error } = useGetInformation();

    const formData = {
        userId: information?.userId || "",
        firstName: information?.firstName || "",
        lastName: information?.lastName || "",
        email: information?.email || "", // Not present in API, fallback to empty
        phone: information?.phoneNumber || "",
        birthDate: information?.birthDate || "",
        role: information?.role ? information.role.toLowerCase() : "parent",
        isActive: true, // Not present in API, default to true
        avatar: information?.avatar || "",
        createAt: information?.createdAt || new Date().toISOString().split("T")[0],
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
            field: "userId",
        },
        {
            icon: <Person />,
            label: "First Name",
            value: formData.firstName || "Not specified",
            field: "firstName",
        },
        {
            icon: <Person />,
            label: "Last Name",
            value: formData.lastName || "Not specified",
            field: "lastName",
        },
        {
            icon: <Email />,
            label: "Email",
            value: formData.email || "Not specified",
            field: "email",
            type: "email",
        },
        {
            icon: <Phone />,
            label: "Phone",
            value: formData.phone || "Not specified",
            field: "phone",
            type: "tel",
        },
        {
            icon: <CalendarToday />,
            label: "Birth Date",
            value: formatDate(formData.birthDate),
            field: "birthDate",
            type: "date",
        },
    ]

    return (
        <Grid container className="profile-container" spacing={3}>
            {/* Header Section */}
            <Grid size={12}>
                <Card className="profile-header">
                    <CardContent>
                        <Grid container alignItems="center" className="header-content" spacing={2} sx={{ marginX: 30 }}>
                            <Grid className="avatar-section">
                                <Avatar src={formData.avatar} className="profile-avatar" sx={{ width: 120, height: 120, position: "relative", right: 200 }}>
                                    {formData.firstName?.[0]?.toUpperCase() || "U"}
                                </Avatar>
                            </Grid>

                            <Grid sx={{ position: "relative", right: 200 }}>
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
                                        <Chip
                                            icon={formData.isActive ? <CheckCircle /> : <CancelIcon />}
                                            label={formData.isActive ? "Active" : "Inactive"}
                                            color={formData.isActive ? "success" : "error"}
                                            size="medium"
                                            className="status-chip"
                                        />
                                    </Box>
                                    <Typography variant="body2" className="member-since">
                                        Member since: {formatDate(formData.createAt)}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Profile Details & Account Summary */}
            <Grid size={12}>
                <Grid container spacing={3}>
                    <Grid size={6} >
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

                    {/* Account Summary */}
                    <Grid size={6} >
                        <Card className="summary-card">
                            <CardContent>
                                <Typography variant="h6" gutterBottom className="section-title">
                                    Account Summary
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box className="summary-content">
                                    <Paper className="summary-item" elevation={1}>
                                        <Typography variant="body2" color="textSecondary">
                                            Account Status
                                        </Typography>
                                        <Typography variant="h6" className={formData.isActive ? "status-active" : "status-inactive"}>
                                            {formData.isActive ? "Active" : "Inactive"}
                                        </Typography>
                                    </Paper>

                                    <Paper className="summary-item" elevation={1}>
                                        <Typography variant="body2" color="textSecondary">
                                            User Role
                                        </Typography>
                                        <Typography variant="h6" className="role-text">
                                            {getRoleLabel(formData.role)}
                                        </Typography>
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
