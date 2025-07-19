import {
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material"

export default function HomepageBlogsUpdates() {
  return (
    <Box sx={{ py: 8, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            Latest Health Blogs & Updates
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Stay informed about health initiatives and important announcements
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  New Vaccination Schedule Released
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                  March 15, 2024
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Updated immunization requirements for the upcoming school year. All students must complete...
                </Typography>
                <Button size="small">Read More</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Mental Health Awareness Week
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                  March 10, 2024
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Join us for a week of activities focused on mental wellness and emotional health support...
                </Typography>
                <Button size="small">Read More</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Healthy Eating Initiative Launch
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                  March 5, 2024
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  New nutrition program aims to promote healthy eating habits among students and staff...
                </Typography>
                <Button size="small">Read More</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
