import Request from "@api/request";

import { getYYYYMMDDFromISOString } from "@utils/date-utils";

export const getAllLogsByMedicationIdAndDateCallback = async (sendMedicationId, dateObj) => {

  let sentDate = dateObj ? getYYYYMMDDFromISOString(dateObj) : getYYYYMMDDFromISOString(new Date());

  if (!sendMedicationId) {
    throw new Error("Medication ID is required to fetch logs.");
  }

  //debug:
  const url = `send-medication/medicationLogs/${sendMedicationId}?givenTime=${sentDate}`; 
  console.log("---> Fetching logs from URL:", url);

  return Request.get(`send-medication/medicationLogs/${sendMedicationId}?givenTime=${sentDate}`);
}