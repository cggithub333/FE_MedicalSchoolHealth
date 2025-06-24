import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert } from '@mui/material';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';

import HealthCheckImg from '../../../assets/images/health_check_image.png';
import HealthCheckDialog from './HealthCheckDialog';

export default function CampaignsCard({ latestHealthCheckCampaign }) {
  return (
    <Card sx={{ maxWidth: "600px", boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.1)" }}>
      <CardMedia
        component="img"
        alt="health check image"
        height="300"
        image={HealthCheckImg}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Ongoing vaccination campaign
        </Typography>
        <Alert severity="success">
          "These efforts are made to ensure the best <br/>possible health and well-being of your children."
        </Alert>
      </CardContent>
      <CardActions>
        <Grid container justifyContent='space-between' spacing={'15px'} >
          <Grid item>
            <HealthCheckDialog latestHealthCheckCampaign={latestHealthCheckCampaign} />
          </Grid>
          <Grid item>
            <Link to={'../schedule'}>
              <Button size="small" sx={styleActionBtn}>Schedule</Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to={'../surveys'}>
              <Button size="small" sx={styleActionBtn}>Survey</Button>
            </Link>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}

const styleActionBtn = {
  fontSize: "16px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "#5e79b8",
    color: "#fff"
  }
}
