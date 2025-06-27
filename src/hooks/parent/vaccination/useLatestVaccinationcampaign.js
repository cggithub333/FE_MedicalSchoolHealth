import { getNewestVaccinationCampaignAction } from '../../../api/parent/parent-requests-action/vaccination/get-newest-campaign-action';
import { useEffect, useState, useCallback } from 'react';

const useLatestVaccinationCampaign = () => {
  // Keep all useState hooks at the top level
  const [latestCampaign, setLatestCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Define useCallback next
  const fetchLatestCampaign = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const campaign = await getNewestVaccinationCampaignAction();
      setLatestCampaign(campaign);
    } catch (err) {
      setError(err);
      console.error("Error fetching latest vaccination campaign:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use useEffect last
  useEffect(() => {
    fetchLatestCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependencies array is empty to avoid infinite loop

  // Return values
  return {
    latestCampaign,
    loading,
    error,
    refetch: fetchLatestCampaign
  };
};

export default useLatestVaccinationCampaign;