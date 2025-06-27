
import { fetchResponse } from '../../fetch-response';
import { getLatestHealthCheckCampaign } from "../parent-requests-callback/parent-request-callback";

import { getLatestVaccinationCampaign } from "../parent-requests-callback/parent-request-callback";
import { editVaccinationConsentFormStatus } from "../parent-requests-callback/parent-request-callback";


export const fetchLatestHealthCheckCampaign = async () => {

  console.log("fetchLatestHealthCheckCampaign run");

  try {
    
    const response = await fetchResponse(getLatestHealthCheckCampaign);

    if (response.status === false)
      throw new Error("parent-request-actions.js: Can't fetch health check campaign!");

    const latestHealthCheckCampaign = await response.data;

    // for debug:
    // console.log("---");
    // console.log("(1) >>", latestHealthCheckCampaign);

    return latestHealthCheckCampaign;
  
  } catch(error) {
    console.error("parent-request-actions.js: Can't fetch health check campaign!");
    console.error("details: " + error);
    throw error;
  }
}

export const fetchLatestVaccinationCampaign = async () => {
  try {
    const response = await fetchResponse(getLatestVaccinationCampaign);
    if (response.status === false)
      throw new Error("parent-request-actions.js: Can't fetch vaccination campaign!");

    const latestVaccinationCampaign = await response.data[0];
    console.log("(2) >> " + latestVaccinationCampaign);
    return latestVaccinationCampaign;

  } catch (error) {
    console.error("parent-request-actions.js: Can't fetch vaccination campaign!");
    console.error("details: " + error);
    throw error;
  }
}

export const updateVaccinationConsentFormStatus = async (consentFormId, status) => {

  try {
    const response = await fetchResponse(() => editVaccinationConsentFormStatus(consentFormId, status));

    if (response.status === false)
      throw new Error("parent-request-actions.js: Can't update form status!");

    console.log(`Successfully update consentForm has id=${consentFormId} with status=${status}`);
  }
  catch(error) {
    console.error("parent-request-actions.js: Can't update form status!");
    console.error("details: " + error);
    throw error;
  }
}