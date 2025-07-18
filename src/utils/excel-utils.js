import * as XLSX from "xlsx";

import { getCurrentDateFormatted } from "./date-utils";

export const downloadExcel = (data, prefixFileName) => {

  const hashValueByDate = Date.now() % 111111;

  // make sure the name will not be duplicated with the right name
  const fileName = `${prefixFileName}_${getCurrentDateFormatted("dd_mm_yyyy")}_${hashValueByDate}.xlsx`;

  // convert data to worksheet:
  const worksheet = XLSX.utils.json_to_sheet(data);

  // create a new workbook:
  const workbook = XLSX.utils.book_new();

  // append the worksheet to the workbook:
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // write the file and trigger download:
  XLSX.writeFile(workbook, fileName);
}

export const excelDateToJSDate = (serial) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split("T")[0]; // "yyyy-mm-dd"
};

export const importExcel = (file) => {
  if (!file) {
    throw new Error("No file provided for import.");
  }

  if (!file.name.endsWith(".xlsx")) {
    throw new Error("Invalid file type. Please upload an Excel file.");
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Process the workbook as needed
  };
  reader.readAsArrayBuffer(file);
  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      resolve(jsonData);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}