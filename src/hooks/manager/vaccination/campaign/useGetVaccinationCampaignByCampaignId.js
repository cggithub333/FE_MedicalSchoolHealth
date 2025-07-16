import { useState, useEffect } from "react";
import { getVaccinationCampaignByCampaignIdAction } from "../../../../api/manager/manager-requests-action/vaccination/get-vaccination-campaign-by-campaignid-action";

export const useGetVaccinationCampaignByCampaignId = (campaignId) => {
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await getVaccinationCampaignByCampaignIdAction(campaignId);
                console.log("Fetched campaign:", response);
                setCampaign(response);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [campaignId]);

    return { campaign, loading, error };
}