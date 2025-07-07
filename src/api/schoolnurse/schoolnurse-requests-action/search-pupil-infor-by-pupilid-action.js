
import { fetchResponse } from "@api/fetch-response";
import { searchPupilInformationByPupilIdCallback } from "@api/schoolnurse/schoolnurse-requests-callback/search-pupil-infor-by-pupilid-callback";

export const searchPupilInformationByPupilIdAction = async (pupilId) => {
  try {

    const callback = () => searchPupilInformationByPupilIdCallback(pupilId);

    const response = await fetchResponse(callback);

    // debug:
    console.log("Response from searchPupilInformationByPupilIdAction:", response);

    const pupil = await response.data;
    return pupil;

  } catch (error) {
    console.error("Error in fetching pupil information:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}