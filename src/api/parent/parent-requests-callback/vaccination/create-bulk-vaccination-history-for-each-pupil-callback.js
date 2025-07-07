
import Request from "@api/request";

export const createBulkVaccinationHistoryForEachPupilCallback = async (vaccinationHistoryData) => {

  return Request.post(`vaccination-history/declare/bulk`, vaccinationHistoryData);
}