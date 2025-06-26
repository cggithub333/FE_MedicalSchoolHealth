import { fetchResponse } from "../../../fetch-response";
import { getPupilsByGradeAndStatus } from "../../schoolnurse-requests-callback/vaccination/get-all-pupils-approved-by-grade-request-callback";

export const fetchPupilsByGradeAndStatus = async (campaignId, gradeLevel) => {
    try {
        const response = await fetchResponse(() =>
            getPupilsByGradeAndStatus(campaignId, gradeLevel)
        );

        if (response.status === false)
            throw new Error("Can't fetch pupils");

        return response.data;

    } catch (error) {
        console.error("Error : " + error);
        throw error;
    }
};
