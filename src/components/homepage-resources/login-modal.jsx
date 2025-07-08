"use client"

import { useState } from "react"
import { Button, Dialog, DialogTitle, DialogContent, TextField, Box, Typography, Link, FormControl } from "@mui/material"
import OtpModal from "./otp-modal.jsx"

import { Navigate } from "react-router-dom"
import useAuth from '@hooks/auth/useAuth.js';

import { showSuccessToast, showErrorToast } from "@utils/toast-utils.js"

export default function LoginModal() {

  const [open, setOpen] = useState(false)
  const [otpOpen, setOtpOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const { loginWithPwd, success, error: loginError, isLoading, role } = useAuth();

  // Validate phone number (10 digits starting with 0)
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setPhoneError("");
    setPasswordError("");
    
    // Validate phone number
    if (!phoneNumber.trim()) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else if (!validatePhoneNumber(phoneNumber.trim())) {
      setPhoneError("Phone number must be 10 digits starting with 0");
      isValid = false;
    }
    
    // Validate password
    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    }
    
    return isValid;
  };

  // Handle phone number input change
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 10 characters
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(digitsOnly);
    
    // Clear error when user starts typing
    if (phoneError) {
      setPhoneError("");
    }
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    
    // Clear error when user starts typing
    if (passwordError) {
      setPasswordError("");
    }
  };

  const handleLoginWithOtp = () => {
    if (!validatePhoneNumber(phoneNumber.trim())) {
      setPhoneError("Please enter a valid 10-digit phone number starting with 0");
      return;
    }
    
    setOpen(false)
    setOtpOpen(true)

    // for debug:
    // console.log("OTP button clicked!");
    // console.log("phoneNumber: " + phoneNumber);
  }

  const handleLoginWithPwd = async () => {
    // Validate form before proceeding
    if (!validateForm()) {
      showErrorToast("Invalid input. Please check your phone number and password.");
      return;
    }

    // check if localstorage now contains any information from last login, then remove it;
    localStorage.clear();
    localStorage.setItem("toolpad-mode", "light");
    
    try {
      await loginWithPwd(phoneNumber, password);
      
      // Check if login was successful by checking localStorage or other indicators
      const userFullName = localStorage.getItem("userFullName");
      
      if (userFullName) {
        showSuccessToast("Login successfully. Welcome back " + userFullName + "!");
      } else {
        showErrorToast("Login failed. Please check your phone number and password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      showErrorToast("Login failed. Please check your phone number and password.");
    }

    // for debug:
    // console.log("Login password button clicked!");
    // console.log("phoneNumber: " + phoneNumber);
    // console.log("password: " + password);
  }

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      console.log("Debug: Enter is pressed!");
      handleLoginWithPwd();
    }
  }

  if (success && role) {
    const adjustRole = (role === "SCHOOL_NURSE") ? "schoolnurse" : role.toLowerCase();
    return <Navigate to={`/${adjustRole}/dashboard`}  replace/>
  }
  return (
    <>
      <Button
        variant="contained" //5ba8e5 0189f4
        sx={{ bgcolor: "#5ba8e5", "&:hover": { bgcolor: "#0189f4" } }}
        onClick={() => setOpen(true)}
      >
        Login
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          Welcome back
          {/* <Typography variant="body2" color="text.secondary">
            Enter your phone number and password to sign in
            <br/> Admin:        0848025113
            <br /> Manager:      0848025114
            <br /> Parent:       0848025116
            <br /> School Nurse: 0848025115 
            <br/> Password: 12345
          </Typography> */}
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <TextField
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number (e.g., 0848025113)"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              error={!!phoneError}
              helperText={phoneError || "Must be 10 digits starting with 0"}
              fullWidth
              required
              inputProps={{
                maxLength: 10,
                pattern: "[0-9]*"
              }}
            />
            <TextField 
              label="Password" 
              type="password" 
              value={password} 
              onKeyDown={(e) => handlePressEnter(e)}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
              placeholder="Enter your password" 
              fullWidth 
              required 
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button 
                variant="contained" 
                size="large" 
                fullWidth 
                onClick={() => handleLoginWithPwd()}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                fullWidth 
                onClick={handleLoginWithOtp}
                disabled={isLoading}
              >
                Login with OTP
              </Button>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Link href="#" variant="body2" color="text.secondary">
                Forgot your password?
              </Link>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <OtpModal open={otpOpen} onClose={() => setOtpOpen(false)} phoneNumber={phoneNumber} />
    </>
  )
}