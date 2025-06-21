
import { fetchResponse } from '../../fetch-response';
import { getLatestHealthCheckCampaign } from "../parent-requests-callback/parent-request-callback";

export const fetchLatestHealthCheckCampaign = async () => {

  try {
    
    const response = await fetchResponse(getLatestHealthCheckCampaign);

    if (response.status === false)
      throw new Error("parent-request-actions.js: Can't fetch health check campaign!");

    const latestHealthCheckCampaign = response.data[0];

    return latestHealthCheckCampaign;
  
  } catch(error) {
    console.error("parent-request-actions.js: Can't fetch health check campaign!");
    console.error("details: " + error);
    throw error;
  }
}