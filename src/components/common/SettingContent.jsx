
"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material"
import {
  Language,
  Phone,
  Edit,
  Visibility,
  ChevronRight,
  Settings,
  Shield,
  AccountCircle,
  Public,
  VpnKey,
  RestoreFromTrash,
  Security as SecurityIcon
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import { passwordValidation } from "@utils/validate-utils"
import { showErrorToast, showSuccessToast } from "@utils/toast-utils"

import useUpdatePassword from "@hooks/common/useUpdatePassword"

const SettingContent = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [recoveryPasswordOpen, setRecoveryPasswordOpen] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")

  const { updatePassword, isSuccess: updateSuccess, error: updateError } = useUpdatePassword()

  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")

  // const [currentPwdValidateMssg, setCurrentPwdValidateMssg] = useState("")
  const [newPwdValidateMssg, setNewPwdValidateMssg] = useState("")
  const [confirmPwdValidateMssg, setConfirmPwdValidateMssg] = useState("")

  useEffect(() => {

    // Reset states when dialogs are closed
    if (!changePasswordOpen) {
      setCurrentPwd("")
      setNewPwd("")
      setConfirmPwd("")
      // setCurrentPwdValidateMssg("")
      setNewPwdValidateMssg("")
      setConfirmPwdValidateMssg("")
    }

    if (!recoveryPasswordOpen) {
      setPhoneNumber("")
      setOtp("")
      setOtpSent(false)
    }

  }, [changePasswordOpen, recoveryPasswordOpen, otpSent])


  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value)
  }

  const handleSendOTP = () => {
    // Simulate OTP sending
    setOtpSent(true)
  }

  const handleRecoverySubmit = () => {
    // Handle password recovery
    setRecoveryPasswordOpen(false)
    setOtpSent(false)
  }

  const handleCurrentPasswordChange = (e) => {
    // debug:
    const currentPassword = e.target.value;
    setCurrentPwd(currentPassword); // always set the current password value
    // console.log("Current Password 2:", currentPassword);

    // if (!currentPassword) {
    //   setCurrentPwdValidateMssg("");
    //   return;
    // }

    // const validatedResult = passwordValidation(currentPassword);
    // if (!validatedResult.isValid) {
    //   setCurrentPwdValidateMssg(validatedResult.message);
    // } else {
    //   // reset validation message
    //   setCurrentPwdValidateMssg(""); //reset
    // }
  }

  const handleNewPasswordChange = (e) => {
    // debug:
    const newPassword = e.target.value;
    setNewPwd(newPassword); // always set the new password value
    // console.log("New Password 2:", newPassword);

    if (!newPassword) {
      setNewPwdValidateMssg("");
      return;
    }

    // for test:
    if (newPassword === "123456" || newPassword === "1234567") {
      setNewPwdValidateMssg("");
      return;
    }

    const validatedResult = passwordValidation(newPassword);
    if (!validatedResult.isValid) {
      setNewPwdValidateMssg(validatedResult.message);
    } else {
      // reset validation message
      setNewPwdValidateMssg(""); //reset
    }
  }
  
  const handleConfirmPwdChange = (e) => {
    
    // debug:
    const confirmPassword = e.target.value;
    setConfirmPwd(confirmPassword); // always set the confirm password value
    // console.log("Confirm Password 2:", confirmPassword);

    if (!confirmPassword) {
      setConfirmPwdValidateMssg("");
      return;
    }

    if (newPwdValidateMssg) {
      setConfirmPwdValidateMssg("New password must be valid to continue");
      return;
    } 

    if (confirmPassword !== newPwd) {
      setConfirmPwdValidateMssg("Passwords do not match");
    } else {
      // reset validation message
      setConfirmPwdValidateMssg(""); //reset
    }
  }

  const allowChangePassword = () => {
    // no error and all fields are filled
    // return !currentPwdValidateMssg && !newPwdValidateMssg && !confirmPwdValidateMssg && currentPwd && newPwd && confirmPwd;
    return !newPwdValidateMssg && !confirmPwdValidateMssg && currentPwd && newPwd && confirmPwd;
  }

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault(); // harmless, defensive code
    if (!allowChangePassword()) {
      // debug:
      showErrorToast("Please fill in all fields correctly before submitting.");
      return;
    }

    // debug:
    console.log("requestData:", {
      currentPassword: currentPwd,
      newPassword: newPwd,
      confirmPassword: confirmPwd,
    })

    // else:
    try {

      if (currentPwd === newPwd) {
        throw new Error("New password must be different from current password");
      }

      await updatePassword({
        currentPassword: currentPwd,
        newPassword: newPwd,
        confirmPassword: confirmPwd,
      });

      showSuccessToast("Password updated successfully!");
      setChangePasswordOpen(false);
    } catch (error) {
      showErrorToast(error.message || "An error occurred while updating password");
    }
  }

  return (
    <Box sx={{ maxWidth: "100%", margin: "0 auto", padding: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 1,
          }}
        >
          <Settings sx={{ fontSize: 32 }} />
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Security Section */}
        <Grid item size={{xs:12}}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <SecurityIcon sx={{ color: "#d32f2f", mr: 2, fontSize: 28 }} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  Security
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                <ListItem
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    cursor: "pointer",
                  }}
                  onClick={() => setChangePasswordOpen(true)}
                >
                  <ListItemIcon>
                    <VpnKey sx={{ color: "#1976d2" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Change Password"
                    secondary="Update your account password for better security"
                  />
                  <IconButton edge="end">
                    <ChevronRight />
                  </IconButton>
                </ListItem>

                <Divider sx={{ my: 1 }} />

                {/* <ListItem
                  sx={{
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    cursor: "pointer",
                  }}
                  onClick={() => setRecoveryPasswordOpen(true)}
                >
                  <ListItemIcon>
                    <RestoreFromTrash sx={{ color: "#ff9800" }} />
                  </ListItemIcon>
                  <ListItemText primary="Password Recovery" secondary="Reset your password using phone verification" />
                  <IconButton edge="end">
                    <ChevronRight />
                  </IconButton>
                </ListItem> */}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Section */}
        <Grid item size={{xs:12}}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <AccountCircle sx={{ color: "#2e7d32", mr: 2, fontSize: 28 }} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  Profile
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                <ListItem
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    cursor: "pointer",
                  }}
                >
                  <ListItemIcon>
                    <Visibility sx={{ color: "#1976d2" }} />
                  </ListItemIcon>
                  <ListItemText primary="View Profile" secondary="See your personal information and details" />
                  
                  <Box component={Link} to="/profile" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                      View
                    </Button>
                  </Box>
                </ListItem>

                <Divider sx={{ my: 1 }} />

                <ListItem
                  sx={{
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    cursor: "pointer",
                  }}
                >
                  <ListItemIcon>
                    <Edit sx={{ color: "#ff9800" }} />
                  </ListItemIcon>
                  <ListItemText primary="Update Profile" secondary="Edit your personal information and preferences" />
                  <Button variant="contained" size="small" sx={{ borderRadius: 2 }}>
                    Edit
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Language Section */}
        <Grid item size={{xs:12}}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Public sx={{ color: "#7b1fa2", mr: 2, fontSize: 28 }} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  Language
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Language sx={{ color: "#666" }} />
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Select Language</InputLabel>
                  <Select
                    value={selectedLanguage}
                    label="Select Language"
                    onChange={handleLanguageChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="english">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        English
                        <Chip label="Main" size="small" color="primary" />
                      </Box>
                    </MenuItem>
                    <MenuItem value="vietnamese">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        Tiếng Việt
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, ml: 5 }}>
                Choose your preferred language for the application interface
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <VpnKey sx={{ color: "#1976d2" }} />
            Change Password
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField fullWidth label="Current Password" onChange={handleCurrentPasswordChange} type="password" variant="outlined" sx={{ mb: 2 }} />
            {/* {currentPwdValidateMssg && (<Alert style={{marginBottom: 10}} severity="error">{currentPwdValidateMssg}</Alert>)} */}
            <TextField fullWidth label="New Password" onChange={handleNewPasswordChange} type="password" variant="outlined" sx={{ mb: 2 }} />
            {newPwdValidateMssg && (<Alert style={{ marginBottom: 10 }} severity="error">{newPwdValidateMssg}</Alert>)}
            <TextField fullWidth label="Confirm New Password" onChange={handleConfirmPwdChange} type="password" variant="outlined" sx={{ mb: 2 }} />
            {confirmPwdValidateMssg && (<Alert severity="error">{confirmPwdValidateMssg}</Alert>)}
            {!allowChangePassword() && <Alert severity="info" sx={{ mt: 2 }}>
              Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special
              characters (@$!%*?&).
            </Alert>}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setChangePasswordOpen(false)}>Cancel</Button>
          <Button variant="contained"
                  onClick={handleSubmitNewPassword}
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: (allowChangePassword()) ? "#1976d2" : "#ccc",
                    cursor: (allowChangePassword()) ? "pointer" : "no-drop",
                  }}>
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Recovery Dialog */}
      <Dialog open={recoveryPasswordOpen} onClose={() => setRecoveryPasswordOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RestoreFromTrash sx={{ color: "#ff9800" }} />
            Password Recovery
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {!otpSent ? (
              <>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <Phone sx={{ color: "#666", mr: 1 }} />,
                  }}
                />
                <Alert severity="info">We'll send a verification code to your registered phone number.</Alert>
              </>
            ) : (
              <>
                <Alert severity="success" sx={{ mb: 2 }}>
                  OTP sent to {phoneNumber}
                </Alert>
                <TextField
                  fullWidth
                  label="Enter OTP Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField fullWidth label="New Password" type="password" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Confirm New Password" type="password" variant="outlined" />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => {
              setRecoveryPasswordOpen(false)
              setOtpSent(false)
            }}
          >
            Cancel
          </Button>
          {!otpSent ? (
            <Button variant="contained" onClick={handleSendOTP} sx={{ borderRadius: 2 }}>
              Send OTP
            </Button>
          ) : (
            <Button variant="contained" onClick={handleRecoverySubmit} sx={{ borderRadius: 2 }}>
              Reset Password
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SettingContent