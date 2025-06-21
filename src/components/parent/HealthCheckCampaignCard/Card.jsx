//https://mui.com/material-ui/react-card/
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { Link } from 'react-router-dom';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HealthCheckImage from '../../../assets/images/health_check.jpg';

import { styleActionBtn, styleTitleDetail } from './style-card';

import ManagerAvatarImg from '../../../assets/images/manager_avatar.jpg';
import { Grid, TableBody, TableContainer, TableHead, TableRow, Table, TableCell } from '@mui/material';

import { convertSQLDateToUserDate } from '../../../utils/DateUtils/DateFormatter';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export default function HealthCheckCampaignCard({ latestHealthCheckCampaign, isLoading }) {

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (isLoading) {
    return <>Loading health check campaign ...</>
  }
  return (
    <Card sx={{ maxWidth: 800, boxShadow: "0px 2px 3px 3px rgba(0, 0, 0, 0.2)"}}>
      {/* <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Manager"
        subheader="September 14, 2016"
      /> */}
      <CardMedia
        component="img"
        height="400"
        image={HealthCheckImage}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: "Open Sans", fontSize: "17px" }}>
          <span style={{ marginRight: "15px"}}></span>This campaign is designed to promote early detection and prevention by offering free health screenings and consultations to the community. 
          By participating, you'll gain valuable insights into your well-being and receive personalized advice from healthcare professionals. 
          Take this opportunity to prioritize your health and build a stronger, healthier future."
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Link to={`../schedule`}>
          <IconButton aria-label="add to favorites"
            sx={styleActionBtn}>
            <CalendarMonthIcon />
            <span style={{ fontSize: "18px", marginLeft: "10px" }}>Schedule</span>
          </IconButton>
        </Link>
        {/* <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          sx={styleActionBtn}
        >
          {
            !expanded ? 
              <span style={{ fontSize: "16px"}}>Show details</span> : 
              <span style={{ transform: "rotate(180deg)", fontSize: "16px" }}>Hide details</span> 
          }
          <ExpandMoreIcon />

        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ fontFamily: "Open Sans" }}>
        <CardContent>
          <Typography sx={styleTitleDetail}
          >
            Health check campaign detail
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableCell sx={{ fontSize: "19px" }}>Title</TableCell>
                <TableCell sx={{ fontSize: "19px" }}>Description</TableCell>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontSize: "17px" }}>Address</TableCell>
                  <TableCell sx={{ fontSize: "17px" }}>{latestHealthCheckCampaign.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontSize: "17px" }}>Start Date</TableCell>
                  <TableCell sx={{ fontSize: "17px" }}>{convertSQLDateToUserDate(latestHealthCheckCampaign.startExaminationDate)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontSize: "17px" }}>End Date</TableCell>
                  <TableCell sx={{ fontSize: "17px" }}>{convertSQLDateToUserDate(latestHealthCheckCampaign.endExaminationDate)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontSize: "17px" }}>Description</TableCell>
                  <TableCell sx={{ fontSize: "17px" }}>{latestHealthCheckCampaign.description}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Collapse>
    </Card>
  );
}