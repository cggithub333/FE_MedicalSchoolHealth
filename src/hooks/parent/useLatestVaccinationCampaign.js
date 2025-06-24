import { useState, useEffect } from 'react';
import { fetchLatestVaccinationCampaign } from '../../api/parent/parent-requests-action/parent-request-action';

const useLatestVaccinationCampaign = () => {
  const [latestVaccinationCampaign, setLatestVaccinationCampaign] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const campaignFetcher = async () => {
      setIsLoading(true);
      try {
        const latestCampaign = await fetchLatestVaccinationCampaign();

        console.log("useLatestVaccinationCampaign:");
        console.log(latestCampaign);

        setLatestVaccinationCampaign(latestCampaign);
      } catch (error) {
        console.error("useLatestVaccinationCampaign.js: " + error);
      } finally {
        setIsLoading(false);
      }
    };
    campaignFetcher();
  }, []);

  return {
    latestVaccinationCampaign: latestVaccinationCampaign,
    isLoading: isLoading
  };
}

export default useLatestVaccinationCampaign;