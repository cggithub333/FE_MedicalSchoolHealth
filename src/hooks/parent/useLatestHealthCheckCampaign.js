
import { useState, useEffect } from 'react';
import { fetchLatestHealthCheckCampaign } from '../../api/parent/parent-requests-action/parent-request-action';

const useLatestHealthCheckCampaign = () => {

  const [ latestHealthCheckCampaign, setLatestHealthCheckCampaign ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {

    const campaignFetcher = async () => {

      setIsLoading(true);
      try {
        const latestCampaign = await fetchLatestHealthCheckCampaign();

        // console.log("hihi - " + latestCampaign.address);
        
        setLatestHealthCheckCampaign(latestCampaign);
      
      } catch(error) {
        console.error("useLatestHealthCheckCampaign.js: " + error);
      } finally {
        setIsLoading(false);
      }
    }

    campaignFetcher(); //

  }, []);

  return {
    latestHealthCheckCampaign: latestHealthCheckCampaign,
    isLoading: isLoading
  };
}

export default useLatestHealthCheckCampaign;