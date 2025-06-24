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
import { Alert, Box, Button, FormControl } from '@mui/material';
import WarningIcon from '@mui/icons-material/ReportGmailerrorred';
import { RiInformation2Line as InformationIcon } from "react-icons/ri";
import ListItemIcon from '@mui/icons-material/IndeterminateCheckBox';
import { TableBody, TableContainer, TableHead, TableRow, Table, TableCell } from '@mui/material';
import { Checkbox } from '@mui/material';
import useLatestVaccinationCampaign from '../../../hooks/parent/useLatestVaccinationCampaign';

import { useState } from 'react';

import { updateVaccinationConsentFormStatus } from '../../../api/parent/parent-requests-action/parent-request-action';

import { formatDateToDDMMYYYY } from '../../../utils/date-utils';

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

export default function SurveysCard({ survey }) {
  const [expanded, setExpanded] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { latestVaccinationCampaign, isLoading } = useLatestVaccinationCampaign();

  // Extract campaign data from latestVaccinationCampaign
  let campaignData = null;
  if (latestVaccinationCampaign) {
    campaignData = (latestVaccinationCampaign.campaign) ? latestVaccinationCampaign.campaign : null;    
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleFormSubmit = (e) => {
    // Update vaccination consent form status:
    try {
      if (survey) {
        const newStatus = "Approved"
        updateVaccinationConsentFormStatus(survey.id, newStatus);
        alert("Approved vaccination campaign!")
      } 
      else {
        throw new Error("SurveysCard.jsx: Can't found `survey`!");
      }
    }
    catch(error) {
      console.error("Can't update vaccination consent form status:", error);
      alert("Survey submitted failed!")
    }

    // close survey:
    setExpanded(false);
  };

  // Stub for reject button click handler
  const handleRejectButtonClick = (e) => {

    try {
      
      if (survey) {
        const newStatus = "Rejected";
        updateVaccinationConsentFormStatus(survey.id, newStatus);
        alert("Rejected vaccination campaign!");
        location.reload();
      }
      else {
        throw new Error("SurveysCard.jsx: Can't found `survey`!");
      }
    } catch(error) {
      console.error("Can't update vaccination consent form status:", error);
      alert("Survey submitted failed!")
    }

    // close survey:
    setExpanded(false);
  }

  if (isLoading) {
    return <div>Loading campaign information...</div>;
  }

  if (!campaignData) {
    return <div>No vaccination campaign data available.</div>;
  }

  return (
    <Card sx={styleCard}>
      {/* <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      /> */}
      {/* <CardMedia
        component="img"
        height="400"
        image={HealthCheckSurveyImage}
        alt="Paella dish"
      /> */}
      <CardContent>
        <Typography variant="h1" sx={styleHealthCheckSurveyTitle(survey)}>
          <span>Vaccination Survey Required</span>
          <span><InformationIcon /></span>
        </Typography>
        <Typography variant="p" sx={{ color: 'text.secondary', display: "flex", gap: "10px", alignItems: "center" }}>
          <ListItemIcon />
          <span>
            We need your confirmation for an upcoming vaccination campaign {campaignData.name && <span>({campaignData.name})</span>}.
          </span>
        </Typography>
        <br />
        <Typography variant="p" sx={{ color: 'text.secondary', display: "flex", gap: "10px", alignItems: "center" }}>
          <ListItemIcon />
          <span>
            Please complete the survey before the deadline to ensure the best case for your child.
          </span>
        </Typography>
        <Alert
          sx={styleWarningMsg}
          severity="warning"
        >Form Deadline: {formatDateToDDMMYYYY(campaignData.consentFormDeadline)}</Alert>
      </CardContent>
      <CardActions disableSpacing>
        {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>*/}
        {
          survey && survey.status && (
            <IconButton aria-label="share" sx={{
              borderRadius: "8px",
              boxShadow: "0 2px 2px 2px rgba(0, 0, 0, 0.1)",
              fontSize: "17px",
              background: (survey.status === "Approved") ? "green" : "red",
              "&:hover": {
                background: "orange"
              }
            }}
            >
                <span style={{ color: "#fff" }}>{survey.status}</span>
            </IconButton>
          )
        }

        
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{
            borderRadius: "8px",
            boxShadow: "0 2px 2px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          <span style={{
            fontSize: "17px",
            transform: expanded ? "rotate(180deg)" : ""
          }}>
            {expanded ? <>Hide Details</> : <>Show Details</>}
          </span>
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ background: "#a7c5d2", color: "#fff", margin: "10px", borderRadius: "10px" }}>
          {/* Campaign information */}
          <Typography sx={styleTitleDetail}>Campaign Information</Typography>
          <TableContainer sx={styleTableCampaignInfor}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Disease</TableCell>
                  <TableCell>{campaignData.disease?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Vaccine</TableCell>
                  <TableCell>{campaignData.vaccine?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Manufacturer</TableCell>
                  <TableCell>{campaignData.vaccine?.manufacturer}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>From Date</TableCell>
                  <TableCell>{formatDateToDDMMYYYY(campaignData.startDate)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>To Date</TableCell>
                  <TableCell>{formatDateToDDMMYYYY(campaignData.endDate)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>{campaignData.campaignStatus}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Notes</TableCell>
                  <TableCell>{campaignData.notes}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Checkbox and warning alert */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
            <Checkbox
              checked={!!showWarning}
              onChange={e => setShowWarning(e.target.checked)}
              color="primary"
              id="consent-checkbox"
            />
            <label htmlFor="consent-checkbox" style={{ color: '#fff', fontSize: '16px', cursor: 'pointer' }}>
              {survey?.status === "Approved"
                ? "I want to reject vaccination form"
                : "I confirm I have read and understood the vaccination information"
              }
            </label>
          </Box>
          {showWarning && (
            <>
              {survey?.status === "Approved" ? (
                <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
                  By clicking Reject, you are withdrawing your consent for your child to receive this vaccination. Please ensure you understand the implications before proceeding.
                </Alert>
              ) : (
                <>
                  <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
                    If you do not have sufficient information about the vaccine, please ensure you understand it clearly before submitting.
                  </Alert>
                  <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
                    By confirming, you consent to your child receiving the vaccination.
                  </Alert>
                </>
              )}
            </>
          )}

          {/* Form with Submit button only visible if checkbox is checked */}
          <FormControl component={'form'} onSubmit={handleFormSubmit} sx={{ width: '100%', marginTop: '30px' }}>
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "25px", gap: "20px" }}>
              {showWarning && (
                survey?.status === "Approved" ? (
                  <Button variant="contained" color="error" sx={{ width: "20%" }} onClick={handleRejectButtonClick}>Reject</Button>
                ) : (
                  <Button type={'submit'} variant="contained" color="primary" sx={{ width: "20%" }}>Confirm</Button>
                )
              )}
            </Box>
          </FormControl>
        </CardContent>
      </Collapse>
    </Card>
  );
}

// style entire card:
const styleCard = {
  maxWidth: "100vh",
  width: "100%",
  boxShadow: "0px 3px 3px 3px rgba(0, 0,0,0.2)",
  marginTop: "30px",
  marginBottom: "100px",
  borderRadius: "10px"
}

// style for the biggest detail title:
const styleHealthCheckSurveyTitle = (survey) => {
  const colorStr = (survey?.status ? (survey.status === "Approved" ? "green" : "red") : "black");
  return {
    color: colorStr,
    fontSize: "35px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    fontStyle: "normal",
    fontWeight: "600",
    fontFamily: "Open Sans",
    marginBottom: "20px",
    "& span:nth-of-type(2)": {
      paddingTop: "7px"
    }
  }
}

// style for table:
const styleTableCampaignInfor = {
  border: "0.5px solid #ddd",
  borderRadius: "10px",
  boxShadow: "0px 1px 2px 2px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  overflowX: "hidden",

  // .MuiTable-root, 	.MuiTableHead-root, .MuiTableBody-root, .MuiTableRow-root, 	.MuiTableCell-root
  "& .MuiTable-root": {
  },
  "& .MuiTableCell-root": {
    fontStyle: "normal",
    fontSize: "16px",

    "&:hover": {
    }
  },
  "& .MuiTableHead-root": {

    "&:hover": {
      background: "#2398f1",
    },
    "& .MuiTableCell-root": {
      color: "#fff",
      fontStyle: "normal",
      textTransform: "uppercase",
      fontSize: "17px"
    }
  },
  "& .MuiTableBody-root": {

    "& .MuiTableRow-root": {

      transition: "all 0.5s ease-in-out",
      "&:hover": {
        background: "#e3eefa",
        transform: "scale(1.03)"
      }
    },
  },
}

// style for detail title:
const styleTitleDetail = {
  marginBottom: 2,
  fontStyle: "normal",
  fontSize: "25px",
  display: "flex",
  fontFamily: "Open Sans",
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
  textTransform: "uppercase"
}

// Warning message:
const styleWarningMsg = {
  marginTop: "20px",
  padding: "15px",
  fontSize: "19px",
  fontStyle: "normal",
  display: "flex",
  justifyContent: "center",
  fontFamily: "Open Sans"
}

const styleCheckedWarningMsg = {
  margin: "10px 0px"
}

const styleDiseaseCheckBox = {
  margin: "15px 0px",
  transition: "all 0.5s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
  },
  cursor: "pointer"
}

// submit button, clear button:
const styleSubmitButton = {
}