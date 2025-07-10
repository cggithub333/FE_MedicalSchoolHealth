import { Box, Typography, Paper, Grid } from "@mui/material"
import AccountMenu from "./account-menu"

const DemoVariations = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Menu Variations
      </Typography>

      <Grid container spacing={3}>
        <Grid  size={{xs:12, md:6}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Male User (Default)
            </Typography>
            <AccountMenu username="John Smith" gender="male" />
          </Paper>
        </Grid>

        <Grid  size={{xs:12, md:6}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Female User
            </Typography>
            <AccountMenu username="Emma Wilson" gender="female" />
          </Paper>
        </Grid>

        <Grid  size={{xs:12, md:6}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              With Custom Avatar
            </Typography>
            <AccountMenu username="Alex Johnson" avatarSrc="/placeholder.svg?height=40&width=40" gender="male" />
          </Paper>
        </Grid>

        <Grid  size={{xs:12, md:6}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Long Username
            </Typography>
            <AccountMenu username="Maria Gonzalez Rodriguez" gender="female" />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DemoVariations