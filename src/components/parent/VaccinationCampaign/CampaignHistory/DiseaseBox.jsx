import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { borderRadius, display, fontSize, width } from '@mui/system';

import { FaDisease as DiseaseIcon } from "react-icons/fa6";
import { MdVaccines as VaccinatedIcon } from "react-icons/md";

import DiseaseBoxInfor from './DiseaseBoxInfor';


export default function DiseaseBox({ diseaseHistory }) {

  const vaccineList = diseaseHistory.vaccinations;
  // console.log("Vaccine List: ");
  // console.log(vaccineList);
  // console.log("--");

  console.log('test');
  console.log(diseaseHistory?.doseQuantity);
  console.log(diseaseHistory?.currDoseQuantity);

  return (
    <Card sx={styleDiseaseCard}>
      {/* <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image="/static/images/cards/contemplative-reptile.jpg"
      /> */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={styleCardHeader}>
          <span style={styleDiseaseName}>
            <span><DiseaseIcon className='icon' /></span>
            {diseaseHistory?.disease_name}
          </span>
          <span style={styleDiseaseTimes}>
            <span><VaccinatedIcon className='icon' /></span>
            <span className='fraction' style={{ color: "yellowgreen" }}>
              Vaccinated: {diseaseHistory?.doseQuantity}/{diseaseHistory?.currDoseQuantity}
            </span>
          </span>
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {diseaseHistory?.disease_description}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        <DiseaseBoxInfor vaccineList={vaccineList}/>
      </CardActions>
    </Card>
  );
}

const styleDiseaseCard = { 
  maxWidth: "100%", 
  width: "1000px",
  boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.1)",
  borderRadius: "15px",
  transition: "all 0.9s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.2)",
  }
}

const styleCardHeader = {
  display: "flex",
  justifyContent: "space-between"
}

const styleCardHeaderItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: "19px"
}

const styleDiseaseName = { 
  ...styleCardHeaderItem,
  color: "#9c27b0"
};

const styleDiseaseTimes = { 
  ...styleCardHeaderItem,
  color: "orangered"
};
