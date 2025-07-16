
import { useState, useEffect, useCallback } from 'react';
import { fetchLatestHealthCheckCampaign } from '../../api/parent/parent-requests-action/parent-request-action';

const useLatestHealthCheckCampaign = () => {

  const [ latestHealthCheckCampaign, setLatestHealthCheckCampaign ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);


  const campaignFetcher = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const latestCampaign = await fetchLatestHealthCheckCampaign();

      setLatestHealthCheckCampaign(latestCampaign);

    } catch (error) {
      console.error("useLatestHealthCheckCampaign.js: " + error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch the latest health check campaign when the component mounts
    campaignFetcher(); //

  }, []);

  return {
    latestHealthCheckCampaign,
    isLoading,
    error,
    refetch: campaignFetcher // Function to refetch the latest campaign
  };
}

export default useLatestHealthCheckCampaign;