
import { getNewestCampaignCallback } from '../../parent-requests-callback/vaccination/get-newest-campaign-callback';
import { fetchResponse} from '../../../fetch-response';

export const getNewestVaccinationCampaignAction = async () => {
  try {

    const callback = () => getNewestCampaignCallback();

    const response = await fetchResponse(callback);

    //debug:
    console.log("Newest Vaccination Campaign Response:", response);

    const newestCampaign = await response?.data?.newest_vaccination_campaign[0];

    // debug:
    // console.log("Newest Vaccination Campaign:", newestCampaign);

    return newestCampaign;

  } catch (error) {
    console.error("Error fetching newest vaccination campaign:", error);
    throw error;
  }
}