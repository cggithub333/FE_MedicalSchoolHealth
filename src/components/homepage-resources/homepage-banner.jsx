import {
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material"
import { Link } from "react-router-dom"

export default function HomepageBanner({ currentUser }) {
  return (
    <Box
      sx={{
        background: "#ccdde5",
        py: 10,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.75rem" },
            }}
          >
            Your School's Health & Wellness Hub
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: 4,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Comprehensive healthcare services, health education, and wellness resources for students, parents, and
            staff.
          </Typography>
          <Box component={Link} to={currentUser.role === "guest" ? "/news" : "/dashboard"}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#5ba8e5",
                "&:hover": { bgcolor: "#0189f4" },
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              {currentUser.role === "guest" ? "Watching blogs" : "Explore Health Services"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
