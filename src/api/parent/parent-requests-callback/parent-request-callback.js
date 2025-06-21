
import Request from '../../request';

// health check campaign:
export const getLatestHealthCheckCampaign = async () => {

  return Request.get('latest_campaign');
}