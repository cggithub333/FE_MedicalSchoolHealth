"use client"

import { useState } from "react"
import { Button, Dialog, DialogTitle, DialogContent, TextField, Box, Typography, Link } from "@mui/material"

export default function OtpModal({ open, onClose, phoneNumber }) {
  const [otp, setOtp] = useState("")
  const [isResending, setIsResending] = useState(false)

  const handleResendCode = () => {
    setIsResending(true)
    // Simulate API call
    setTimeout(() => {
      setIsResending(false)
    }, 2000)
  }

  const handleVerifyOtp = () => {
    // Handle OTP verification logic here
    console.log("Verifying OTP:", otp)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        Enter OTP Code
        <Typography variant="body2" color="text.secondary">
          We've sent a verification code to {phoneNumber || "your phone number"}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <TextField
            label="Verification Code"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 6 }}
            sx={{
              "& input": {
                textAlign: "center",
                fontSize: "1.2rem",
                letterSpacing: "0.5rem",
              },
            }}
            fullWidth
            required
          />

          <Button variant="contained" size="large" fullWidth onClick={handleVerifyOtp} disabled={otp.length !== 6}>
            Verify Code
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" component="span">
              Didn't receive the code?{" "}
            </Typography>
            <Link
              component="button"
              variant="body2"
              onClick={handleResendCode}
              disabled={isResending}
              sx={{ color: "success.main" }}
            >
              {isResending ? "Sending..." : "Resend Code"}
            </Link>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Button variant="text" onClick={onClose}>
              Back to Login
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
