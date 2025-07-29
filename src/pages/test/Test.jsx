import AccountMenu from "./account-menu/account-menu";
import DemoVariations from "./account-menu/account-menu-variations";

import { Dialog, Grid, Typography, DialogTitle, DialogActions, DialogContent } from "@mui/material";
import useMyInformation from "@hooks/common/useMyInformation";

import { importExcel, excelDateToJSDate } from "@utils/excel-utils";
import BlogEditor from "@components/magic/TextEditor/BlogsEditor";

import React, { useState } from "react";

const Test = () => {
  const { personalInforState, error } = useMyInformation();
  const [openBlogEditor, setOpenBlogEditor] = useState(false);

  // Enhanced debugging:
  console.log("personalInforState:", personalInforState);
  console.log("error:", error);
  console.log("error exists:", !!error);
  console.log("personalInforState exists:", !!personalInforState);

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".xlsx")) {
      console.error("Invalid file type. Please upload an Excel file.");
      return;
    }

    const data = importExcel(file);
    data.then((result) => {
      return result.map((item) => ({
        ...item,
        birth_date: excelDateToJSDate(item.birth_date), // Convert Excel date to JS date
        phone_number: item.phone_number || "N/A", // Handle missing phone numbers
        first_name: item.first_name || "Unknown", // Handle missing first names
        last_name: item.last_name || "Unknown", // Handle missing last names
        email: item.email || "N/A", // Handle missing emails
        role: item.role || "Unknown", // Handle missing roles
      }))
      // You can handle the imported data here, e.g., update state or send to server
    })
    .then ((processedData) => {
      console.log("Processed data:", processedData);
    })
    .catch((err) => {
      console.error("Error importing Excel file:", err);
    });
  }

  return (
    <div>
      <Grid container>
        <Grid size={{ xs: 12 }} alignItems="center">
          <DemoVariations />
        </Grid>
      </Grid>

      {/* Add this debug section to see what's happening */}
      <Grid container pl={2}>
        <Grid size={{xs:12}}>
          <p>Debug: error = {error ? "true" : "false"}</p>
          <p>Debug: personalInforState = {personalInforState ? "true" : "false"}</p>
        </Grid>
      </Grid>

      <Grid container pl={2}>
        {error && (
          <Grid size={{xs:12}}>
            <p>Error fetching personal information: {error.message}</p>
            <p>Please login first before using this features</p>
          </Grid>
        )}
        {!error && personalInforState && (
          <Grid size={{xs:12}}>
            <AccountMenu
              username={(`${personalInforState.lastName} ${personalInforState.firstName}`) || "User"}
              gender="male"
            />
          </Grid>
        )}
      </Grid>
      <Grid container pl={2} pt={2}>
        <Typography fontSize={'20px'}>Import xlsx file:</Typography>
        <span>
          <input onChange={handleUploadFile} type="file" accept=".xlsx" name="xlsx_file" title="Import Accounts"/>
        </span>
      </Grid>
      <Grid container p={"60px 0px"} justifyContent={'center'} bgcolor={'#E6F8F9'}>
        <button onClick={() => setOpenBlogEditor(true)}>Open Blog Editor</button>
      </Grid>

      <Dialog open={openBlogEditor} onClose={() => setOpenBlogEditor(false)} maxWidth={"md"} fullWidth>
        {/* <DialogTitle>Blog Editor</DialogTitle> */}
        <DialogContent>
          <BlogEditor />
        </DialogContent>
        <DialogActions>
          <button onClick={() => setOpenBlogEditor(false)}>Close</button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Test;

/* 
  test schema:
  (
    birth_date   date                                                not null,
    phone_number varchar(12)                                         not null,
    first_name   varchar(50)                                         not null,
    last_name    varchar(50)                                         not null,
    email        varchar(255)                                        null,
    role         enum ('ADMIN', 'MANAGER', 'PARENT', 'SCHOOL_NURSE') null
);
*/