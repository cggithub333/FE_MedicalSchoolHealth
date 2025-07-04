
import { fetchResponse } from "@api/fetch-response";
import { getAllDiseasesVaccinesCallback } from "@api/parent/parent-requests-callback/vaccination/get-all-diseases-vaccines-callback";

export const getAllDiseasesVaccinesAction = async () => {

  try {
    const callback = () => getAllDiseasesVaccinesCallback();

    const response = await fetchResponse(callback);

    // debug:
    console.log("getAllDiseasesVaccinesAction response:", response);

    const diseaseVaccineMap = await response.data;

    return diseaseVaccineMap || {};

  } catch (error) {
    console.error("Error in getAllDiseasesVaccinesAction:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}