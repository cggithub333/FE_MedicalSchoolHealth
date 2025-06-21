import useNewestCampaign from './useNewestCampaign';

const PupilsByGradeList = () => {
    const { newestCampaign, isLoading } = useNewestCampaign();

    return (
        <div>
            <h1>Campaign</h1>

            {isLoading ? (
                <p>Loading campaign...</p>
            ) : (
                <ul>
                    {newestCampaign.map((campaign) => (
                        <li key={campaign.id}>{campaign.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PupilsByGradeList;
