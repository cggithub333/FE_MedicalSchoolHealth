"use client"

import { useState } from "react"
import { Button, Dialog, DialogTitle, DialogContent, TextField, Box, Typography, Link, FormControl } from "@mui/material"
import OtpModal from "./otp-modal.jsx"

import { Navigate } from "react-router-dom"
import useAuth from '@hooks/auth/useAuth.js';

export default function LoginModal() {

  const [open, setOpen] = useState(false)
  const [otpOpen, setOtpOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("");

  const { loginWithPwd, success, error, isLoading, role } = useAuth();

  const handleLoginWithOtp = () => {
    if (phoneNumber.trim()) {
      setOpen(false)
      setOtpOpen(true)
    } else {
      alert("Please enter your phone number first")
    }

    // for debug:
    // console.log("OTP button clicked!");
    // console.log("phoneNumber: " + phoneNumber);
  }

  const handleLoginWithPwd = async () => {

    // check if localstorage now contains any information from last login, then remove it;
    localStorage.clear();
    localStorage.setItem("toolpad-mode", "light");
    
      
    await loginWithPwd(phoneNumber, password);

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
        variant="contained"
        sx={{ bgcolor: "success.main", "&:hover": { bgcolor: "success.dark" } }}
        onClick={() => setOpen(true)}
      >
        Login
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          Welcome back
          <Typography variant="body2" color="text.secondary">
            Enter your phone number and password to sign in
            <br/> Admin:        0848025113
            <br /> Manager:      0848025114
            <br /> Parent:       0848025146 - PR0001
            <br /> School Nurse: 0848025115 
            <br/> Password: 12345
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <TextField
              label="Phone Number"
              type="tel"
              placeholder="ex: 0848025113"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              required
            />
            <TextField label="Password" type="password" value={password} onKeyDown={(e) => handlePressEnter(e)}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" fullWidth required />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button variant="contained" size="large" fullWidth onClick={() => handleLoginWithPwd()}>
                Sign In
              </Button>
              <Button variant="outlined" size="large" fullWidth onClick={handleLoginWithOtp}>
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
