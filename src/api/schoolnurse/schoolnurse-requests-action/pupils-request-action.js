import { fetchResponse } from "../../fetch-response.js";
import { getPupilsByGrade } from "../schoolnurse-requests-callback/pupils-request-callback.js";

export const fetchPupilsByGrade = async (grade) => {
    try {
        const response = await fetchResponse(() => getPupilsByGrade(grade));

        if (response.status === false)
            throw new Error("Can't fetch pupil with grade =" + grade);

        const PupilsByGrade = response.data;
        return PupilsByGrade;

    } catch (error) {
        console.error("Error at parentHelpers.js: " + error);
        throw error; // Re-throw the error to handle it in the component
    }
};
