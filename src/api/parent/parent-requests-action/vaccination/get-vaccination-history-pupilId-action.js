import { getVaccinationHistoryPupilIdCallback } from "../../parent-requests-callback/vaccination/get-vaccination-history-pupilId-callback";
import { fetchResponse } from "@api/fetch-response";

export const getVaccinationHistoryPupilIdAction = async (pupilId) => {
  try {

    const callback = () => getVaccinationHistoryPupilIdCallback(pupilId);

    const response = await fetchResponse(callback);
    //debug:
    console.log(`Vaccination history response - pupilId = ${pupilId}`, response);

    const historyArr = await response.data || [];
    //debug:
    console.log(`Vaccination history array - pupilId = ${pupilId}`, historyArr);

    return historyArr;

  } catch (error) {
    console.error(`Error fetching vaccination history for pupil with id = ${pupilId}`, error);
    throw error;
  }
}
