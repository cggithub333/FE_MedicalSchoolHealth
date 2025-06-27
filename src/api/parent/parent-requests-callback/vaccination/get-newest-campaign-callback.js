
import Request from '../../../request';

export const getNewestCampaignCallback = async () => {
  return Request.get("vaccination-campaigns/newest");
}