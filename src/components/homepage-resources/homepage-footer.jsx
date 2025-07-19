import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@mui/material"
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Facebook,
  Twitter,
  Instagram,
} from "@mui/icons-material"
import SchoolHealthIcon from '@mui/icons-material/School'

export default function HomepageFooter() {
  return (
    <Box sx={{ bgcolor: "grey.900", color: "white", py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
              <SchoolHealthIcon sx={{ color: "#fff", mr: 1, fontSize: 25}} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Medical Health
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "grey.300", mb: 3 }}>
              Dedicated to providing comprehensive healthcare services and promoting wellness in our school community.
              Your health is our priority.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton sx={{ color: "white", border: 1, borderColor: "white" }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: "white", border: 1, borderColor: "white" }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: "white", border: 1, borderColor: "white" }}>
                <Instagram />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button sx={{ color: "grey.300", justifyContent: "flex-start", p: 0 }}>Health Services</Button>
              <Button sx={{ color: "grey.300", justifyContent: "flex-start", p: 0 }}>Book Appointment</Button>
              <Button sx={{ color: "grey.300", justifyContent: "flex-start", p: 0 }}>Health Records</Button>
              <Button sx={{ color: "grey.300", justifyContent: "flex-start", p: 0 }}>Emergency Contacts</Button>
              <Button sx={{ color: "grey.300", justifyContent: "flex-start", p: 0 }}>Vaccination Schedule</Button>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOn sx={{ color: "grey.400", mr: 1, fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "grey.300" }}>
                  123 School Street, Education City, EC 12345
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Phone sx={{ color: "grey.400", mr: 1, fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "grey.300" }}>
                  +84 234 123 567
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Email sx={{ color: "grey.400", mr: 1, fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "grey.300" }}>
                  health@schoolhealth.edu
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTime sx={{ color: "grey.400", mr: 1, fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "grey.300" }}>
                  Mon-Fri: 8AM-5PM
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Footer */}
        <Divider sx={{ my: 4, borderColor: "grey.700" }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <Typography variant="body2" sx={{ color: "grey.400" }}>
            © {(new Date().getFullYear())} Medical Health. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3, mt: { xs: 2, md: 0 } }}>
            <Button sx={{ color: "grey.400", p: 0 }}>Privacy Policy</Button>
            <Button sx={{ color: "grey.400", p: 0 }}>Terms of Service</Button>
            <Button sx={{ color: "grey.400", p: 0 }}>Cookie Policy</Button>
            <Button sx={{ color: "grey.400", p: 0 }}>Accessibility</Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
