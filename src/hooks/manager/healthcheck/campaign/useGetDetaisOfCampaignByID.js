import { useState, useEffect } from "react";
import { getDetailsOfHealthCheckCampaignAction } from "../../../../api/manager/manager-requests-action/healthcheck/get-details-of-health-check-campaign-action";

export const useGetDetailsOfCampaignByID = (campaignId) => {
    const [campaignDetails, setCampaignDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCampaignDetails = async () => {
        console.log("HOOK: Starting fetch for campaign ID:", campaignId);

        if (!campaignId) {
            console.warn("HOOK: No campaign ID provided");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const details = await getDetailsOfHealthCheckCampaignAction(campaignId);
            console.log("HOOK: Campaign details received:", details);

            // Check if details is the expected structure
            if (!details) {
                console.warn("HOOK: Details is null/undefined");
            } else if (typeof details !== 'object') {
                console.warn("HOOK: Details is not an object:", typeof details);
            }

            setCampaignDetails(details);
        } catch (err) {
            console.error("HOOK: Error fetching campaign details:", err);
            setError(err.message || 'Failed to fetch campaign details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("HOOK: useEffect triggered with campaignId:", campaignId);
        if (campaignId) {
            fetchCampaignDetails();
        } else {
            setIsLoading(false);
        }
    }, [campaignId]);

    return { campaignDetails, isLoading, error, refetch: fetchCampaignDetails };
}