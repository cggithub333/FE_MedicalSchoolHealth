import React, { useState } from "react";
import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material';


export default function DiseaseBoxInfor({ vaccineList }) {

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen} style={styleDetailsBtn}>Details</Button>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography style={ styleDiseaseTitle } id="modal-title" variant="h5" mb={2}>
              Measles Vaccines Campaign
            </Typography>
            {vaccineList.map((item, idx) => (
              <Box 
                key={item.historyId}
                sx={{
                  marginBottom: 3,
                  padding: 3,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid #e0e0e0",
                  transition: "all 0.9s ease",
                  "&:hover": {
                    transform: "scale(1.01)",
                    boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.2)",
                  },
                  background: colors[idx],
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="primary" mb={1}>
                  {item.vaccine.name}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  <strong>Manufacturer:</strong> {item.vaccine.manufacturer}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  <strong>Recommended Age:</strong> {item.vaccine.recommendedAge}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  <strong>Description:</strong> {item.vaccine.description}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  <strong>Campaign Notes:</strong> {item.campaign.notes}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  <strong>Campaign Status:</strong> {item.campaign.status}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  <strong>Date Vaccinated:</strong> {new Date(item.vaccinatedAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  <strong>Vaccination Notes:</strong> {item.notes}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  <strong>Source:</strong> {item.source}
                </Typography>
              </Box>
            ))}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

const colors = ["#c1d3fe", "#f8edeb", "#a7c5d2","#e3f2fd","#fde4cf","#ffe5d9"]

const styleDetailsBtn = {
  background: "#65aee7",
  color: "#fff",
  padding: "5px 10px",
};


const styleDiseaseTitle = {
  textAlign: "center",
  color: "#282a36"
}

const style = {
  borderRadius: "10px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70vw",
  height: "80vh",
  overflow: "scroll",
  overflowX: "hidden",
  bgcolor: "background.paper",
  boxShadow: "0px 3px 3px 3px rgba(0, 0, 0, 0.2)",
  p: 4,
};