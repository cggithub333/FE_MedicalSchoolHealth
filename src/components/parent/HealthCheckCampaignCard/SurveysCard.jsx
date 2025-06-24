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

// import HealthCheckSurveyImage from '../../../assets/images/health_check_survey_image.png';
import WarningIcon from '@mui/icons-material/ReportGmailerrorred';
import { RiInformation2Line as InformationIcon } from "react-icons/ri";
import ListItemIcon from '@mui/icons-material/IndeterminateCheckBox';

// material UI table, checkbox:
import { TableBody, TableContainer, TableHead, TableRow, Table, TableCell } from '@mui/material';
import { Checkbox } from '@mui/material';

// date utils;
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
  const [expanded, setExpanded] = React.useState(false);
  const diseaseList = survey.healthCheckDisease || [];
  const [checkedStates, setCheckedStates] = React.useState(
    diseaseList.map(disease => ({
      diseaseId: disease.diseaseId,
      status: disease.status // 'Rejected` or `Approved`
    }))
  );

  React.useEffect(() => {
    setCheckedStates(
      diseaseList.map(disease => ({
        diseaseId: disease.diseaseId,
        status: disease.status // 'Rejected` or `Approved`
      }))
    );
  }, [diseaseList.length]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Handler for clicking the parent Box (excluding clicks on the Checkbox itself)
  const handleDiseaseCheckBoxClick = (e, idx) => {
    // If the actual target of the click was a checkbox, do nothing to prevent double toggling
    if (e.target.type === 'checkbox') return;

    // Update the checkedStates array
    setCheckedStates(prev => {
      const updated = [...prev]; // Create a shallow copy of the previous state array

      // Toggle the status at the specific index between 'Approved' and 'Rejected'
      updated[idx] = {
        ...updated[idx], // Copy the existing object at this index `idx`
        status: updated[idx].status === 'Approved' ? 'Rejected' : 'Approved'
      };

      return updated; // Return the new array to update the state
    });
  };

  // Handler for clicking directly on the Checkbox itself
  const handleCheckBoxClick = (idx) => {
    // Update the checkedStates array in the same way as above
    setCheckedStates(prev => {
      const updated = [...prev]; // Clone the previous array

      // Toggle the status field for the item at index 'idx'
      updated[idx] = {
        ...updated[idx], // use spread operator -> Copy the existing object at this index `idx`
        status: updated[idx].status === 'Approved' ? 'Rejected' : 'Approved' // override/edit/toggle the value of the property 'status';
      };

      return updated; // Return the modified array
    });
  };


  const handleFormSubmit = (e) => {
    e.preventDefault();
    // checkedStates now contains [{diseaseId, status}, ...] for DB update
    console.log(checkedStates);
    // submit checkedStates to API here

    // Alert:
    alert('Form submitted successfully!');

    // hide the form:
    setExpanded(false);
  };

  const handleClearClick = (e) => {
    // clear all checked checkbox:
    setCheckedStates(prev => {
      const updated = [...prev]; // clone to updated array;
      updated.forEach((_, idx, updated) => { // traverse the cloned array
        updated[idx].status = 'Rejected';
      })

      return updated;
    })

    // hide the form:
    setExpanded(false);
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
        <Typography variant="h1" sx={styleHealthCheckSurveyTitle}>
          <span>Health Check Survey Required</span>
          <span><InformationIcon /></span>
        </Typography>
        <Typography variant="p" sx={{ color: 'text.secondary', display: "flex", gap: "10px", alignItems: "center" }}>
          <ListItemIcon />
          <span>
            We need your confirmation for an upcomming health check campaign
            {survey.healthCheckCampaignAddress && <span>at {survey.healthCheckCampaignAddress}</span>}.
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
        >Form Deadline: {survey.deadlineDate}</Alert>
      </CardContent>
      <CardActions disableSpacing>
        {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
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

          {/* Campaign infromation */}
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
                  <TableCell>Address</TableCell>
                  <TableCell>{survey.healthCheckCampaignAddress}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>From date</TableCell>
                  <TableCell>{formatDateToDDMMYYYY(survey.startExaminationDate)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>To date</TableCell>
                  <TableCell>{formatDateToDDMMYYYY(survey.endExaminationDate)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>School year</TableCell>
                  <TableCell>{survey.schoolYear}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Confirmation infromation */}
          {
            survey.healthCheckDisease && (
              <>
                <Typography sx={styleTitleDetail}>Disease Confirmation</Typography>
                <Typography sx={{ display: "flex", gap: "6px", alignItems: "center", marginLeft: "10px", color: "yellow", marginBottom: "15px" }}>
                  <ListItemIcon />
                  <span>We need your confirmation for sensitive disease!</span>
                </Typography>

                <FormControl component={'form'} onSubmit={handleFormSubmit}>
                  <Box component={'ul'}>
                    {diseaseList.map((disease, idx) => (
                      <Box
                        component={'li'}
                        key={idx}
                        sx={styleDiseaseCheckBox}
                        onClick={(e) => handleDiseaseCheckBoxClick(e, idx)}
                      >
                        <Checkbox
                          // The Checkbox is checked if the status at index 'idx' exists (checkedStates[idx]?) and is equal to 'Approved'
                          checked={checkedStates[idx]?.status === 'Approved'}
                          onClick={() => handleCheckBoxClick(idx)}
                          color="success"
                        />
                        <span style={{ fontStyle: "normal" }} >
                          {disease.diseaseName}
                        </span>
                        <Typography>
                          Discription: {disease.diseaseDescription}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  {
                    // at least 1 box is checked:
                    checkedStates.filter(state => state.status === 'Approved').length > 0
                    && (
                      <>
                        {/* Warning messages  */}
                        <Box component={'div'}>
                          <Alert severity="warning" sx={styleCheckedWarningMsg}>
                            <Typography sx={{ display: "flex", alignItems: 'center', gap: "10px" }}>
                              <span>By checking this box, you consent to your child receiving the vaccination administered by the school health team as part of the official vaccination campaign.</span>
                            </Typography>
                          </Alert>
                          <Alert severity="warning" sx={styleCheckedWarningMsg}>
                            <Typography>
                              <span>Please ensure you have read and understood all the relevant information about the vaccine, including its benefits, possible side effects, and contraindications.</span>
                            </Typography>
                          </Alert>
                          <Alert severity="warning" sx={styleCheckedWarningMsg}>
                            <Typography>
                              <span>If you have any concerns or your child has a known allergy or medical condition, please consult your healthcare provider before confirming.</span>
                            </Typography>
                          </Alert>
                        </Box>

                        {/* Submit button: */}
                        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "25px", gap: "20px" }}>
                          <Button type={'reset'} onClick={handleClearClick} variant="outlined" color="error" sx={{ width: "20%", background: "white" }}>Clear</Button>
                          <Button type={'submit'} variant="contained" color="primary" sx={{ width: "20%" }}>Submit</Button>
                        </Box>
                      </>
                    )
                  }
                </FormControl>
              </>
            )
          }

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
const styleHealthCheckSurveyTitle = {
  color: 'text.secondary',
  fontSize: "35px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  fontStyle: "normal",
  color: "orangered",
  fontWeight: "600",
  fontFamily: "Open Sans",
  marginBottom: "20px",
  "& span:nth-of-type(2)": {
    paddingTop: "7px"
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

const styleClearButton = {

}