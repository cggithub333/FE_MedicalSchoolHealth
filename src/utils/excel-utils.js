import * as XLSX from "xlsx";

import { getCurrentDateFormatted } from "./date-utils";

const downloadExcel = (data, fileName) => {

  fileName = fileName || `data_${getCurrentDateFormatted("dd_mm_yyyy")}.xlsx`;

  // convert data to worksheet:
  const worksheet = XLSX.utils.json_to_sheet(data);

  // create a new workbook:
  const workbook = XLSX.utils.book_new();

  // append the worksheet to the workbook:
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // write the file and trigger download:
  XLSX.writeFile(workbook, fileName);
}