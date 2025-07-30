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
  Facebook,
  Twitter,
  Instagram,
} from "@mui/icons-material"
import SchoolHealthIcon from '@mui/icons-material/School'

export default function BasicHomepageFooter() {
  return (
    <Box sx={{ bgcolor: "grey.900", color: "white", py: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Logo + Desc + Social */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <SchoolHealthIcon sx={{ color: "#fff", mr: 1, fontSize: 22 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Medical Health
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "grey.300", mb: 2 }}>
              Promoting wellness across our school.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <IconButton key={i} sx={{ color: "white", border: 1, borderColor: "white", p: 0.5 }}>
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Quick Links
            </Typography>
            {["Health Services", "Appointments", "Records"].map((text, i) => (
              <Button key={i} sx={{ color: "grey.300", justifyContent: "flex-start", p: 0, minHeight: 28 }}>
                {text}
              </Button>
            ))}
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Contact
            </Typography>
            {[
              [LocationOn, "123 School St, Education City"],
              [Phone, "+84 234 123 567"],
              [Email, "health@school.edu"]
            ].map(([Icon, text], i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Icon sx={{ color: "grey.400", mr: 1, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: "grey.300" }}>{text}</Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        {/* Bottom */}
        <Divider sx={{ my: 2, borderColor: "grey.700" }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <Typography variant="body2" sx={{ color: "grey.400" }}>
            © {new Date().getFullYear()} Medical Health
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: { xs: 1, md: 0 } }}>
            <Button sx={{ color: "grey.400", p: 0, minWidth: "auto", fontSize: "0.75rem" }}>Privacy</Button>
            <Button sx={{ color: "grey.400", p: 0, minWidth: "auto", fontSize: "0.75rem" }}>Terms</Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
