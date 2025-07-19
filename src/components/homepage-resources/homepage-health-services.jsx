import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material"
import {
  LocalHospital,
  Shield,
  Psychology,
  Phone,
  Assignment,
  Group,
  MedicalInformation
} from "@mui/icons-material"

export default function HomepageHealthServices() {
  return (
    <Box sx={{ py: 8, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            Our Health Services
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Comprehensive healthcare solutions for your school community.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card sx={{ height: "100%", p: 2 }}>
              <CardContent>
                <LocalHospital sx={{ fontSize: 40, color: "success.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Regular Health Checkups
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive health screenings and medical examinations for all students.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card sx={{ height: "100%", p: 2 }}>
              <CardContent>
                <Shield sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Vaccination Programs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Up-to-date immunization schedules and vaccination tracking.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card sx={{ height: "100%", p: 2 }}>
              <CardContent>
                <Psychology sx={{ fontSize: 40, color: "error.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Mental Health Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Through blogs, we provide counseling services and mental wellness programs for students.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card sx={{ height: "100%", p: 2 }}>
              <CardContent>
                <MedicalInformation sx={{ fontSize: 40, color: "warning.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Prescriptions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Allow parents to send prescriptions and medication requests.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card sx={{ height: "100%", p: 2 }}>
              <CardContent>
                <Assignment sx={{ fontSize: 40, color: "secondary.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Health Records
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Secure digital health records and medical history tracking.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card sx={{ height: "100%", p: 2 }}>
              <CardContent>
                <Group sx={{ fontSize: 40, color: "info.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Health Education
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Educational programs on nutrition, hygiene, and healthy lifestyle through blogs.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
