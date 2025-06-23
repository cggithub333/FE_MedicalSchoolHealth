
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert, Grid } from '@mui/material';

import VaccinationDialog from './VaccinationDialogButton';

import VaccinationCampaignImg from '../../../assets/images/vaccination_campaign.jpg'
import { Link } from 'react-router-dom';

export default function VaccinationCampaignCard({campaign}) {

  return (
    <Card sx={{ maxWidth: "600px", boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.1)" }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="300"
        image={VaccinationCampaignImg}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Ongoing vaccination campaign
        </Typography>
        <Alert severity="success">
          "The Power of a Shot: Why Vaccination Matters."
        </Alert>
      </CardContent>
      <CardActions>
        <Grid container justifyContent='space-between'spacing={'15px'} >
          <Grid item>
            <VaccinationDialog campaign={campaign}/>
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
    background:"#5e79b8",
    color: "#fff"
  }
}
