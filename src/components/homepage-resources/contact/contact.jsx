import { Box, Button, TextField, Typography, Grid, Paper } from "@mui/material"
import {
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    DirectionsRun as DirectionsRunIcon,
} from "@mui/icons-material"
import YouTubeIcon from '@mui/icons-material/YouTube';
import "./StyleContact.scss" // Import SCSS for side effects only
import { useRef, useState } from "react"
import emailjs from "emailjs-com"

export default function ContactForm() {
    const formRef = useRef(null)
    const [form, setForm] = useState({
        email: "",
        name: "",
        subject: "",
        message: ""
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        emailjs.send(
            "service_mgq09iu", // replace with your EmailJS service ID
            "template_0e3f5dm", // replace with your EmailJS template ID
            {
                from_email: form.email,
                from_name: form.name,
                subject: form.subject,
                message: form.message
            },
            "4jTZyKUhEyNiQGb5H" // replace with your EmailJS user/public key
        ).then(
            (result) => {
                alert("Message sent successfully!")
                setForm({ email: "", name: "", subject: "", message: "" })
                setLoading(false)
            },
            (error) => {
                alert("Failed to send message. Please try again later.")
                setLoading(false)
            }
        )
    }

    return (
        <section className="contact-section">
            <div className="container">
                <div className="header">
                    <Typography variant="h2" component="h2" className="title">
                        Contact Us
                    </Typography>

                </div>

                <Paper elevation={3} className="form-paper">
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid item size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    placeholder="Enter a valid email address"
                                    variant="outlined"
                                    className="contact-form-input"
                                    value={form.email}
                                    onChange={handleChange}
                                    InputProps={{
                                        className: "input-base",
                                    }}
                                    InputLabelProps={{
                                        className: "input-label",
                                    }}
                                    required
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    name="name"
                                    label="Name"
                                    placeholder="Enter your Name"
                                    variant="outlined"
                                    className="contact-form-input"
                                    value={form.name}
                                    onChange={handleChange}
                                    InputProps={{
                                        className: "input-base",
                                    }}
                                    InputLabelProps={{
                                        className: "input-label",
                                    }}
                                    required
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    id="subject"
                                    name="subject"
                                    label="Subject"
                                    placeholder="Enter the subject"
                                    variant="outlined"
                                    className="contact-form-input"
                                    value={form.subject}
                                    onChange={handleChange}
                                    InputProps={{
                                        className: "input-base",
                                    }}
                                    InputLabelProps={{
                                        className: "input-label",
                                    }}
                                    required
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    id="message"
                                    name="message"
                                    label="Message"
                                    placeholder="Enter your message"
                                    multiline
                                    rows={5}
                                    variant="outlined"
                                    className="contact-form-input"
                                    value={form.message}
                                    onChange={handleChange}
                                    InputProps={{
                                        className: "textarea-base",
                                    }}
                                    InputLabelProps={{
                                        className: "input-label",
                                    }}
                                    required
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <Button type="submit" variant="contained" className="submit-button" disabled={loading}>
                                    {loading ? "Sending..." : "SUBMIT"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </div>

            <div className="info-section">
                <div className="container">
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item size={{ xs: 12, md: 4 }}>
                            <Box className="info-card">
                                <div className="icon-circle">
                                    <YouTubeIcon className="icon" />
                                </div>
                                <Typography variant="h6" component="h4" className="info-title">
                                    ABOUT US
                                </Typography>
                                <Typography variant="body1" className="info-text">
                                    Education Health
                                </Typography>

                            </Box>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 4 }}>
                            <Box className="info-card">
                                <div className="icon-circle">
                                    <PhoneIcon className="icon" />
                                </div>
                                <Typography variant="h6" component="h4" className="info-title">
                                    PHONE (LANDLINE)
                                </Typography>
                                <Typography variant="body1" className="info-text">
                                    +84 812 922 999
                                </Typography>
                                <Typography variant="body1" className="info-text">
                                    +84 812 922 998
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 4 }}>
                            <Box className="info-card">
                                <div className="icon-circle">
                                    <LocationOnIcon className="icon" />
                                </div>
                                <Typography variant="h6" component="h4" className="info-title">
                                    OUR OFFICE LOCATION
                                </Typography>
                                <Typography variant="body1" className="info-text">
                                    123 School Street, Education City, EC 12345
                                </Typography>

                            </Box>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </section>
    )
}
