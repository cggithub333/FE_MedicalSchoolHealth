import { fetchResponse } from "../../../fetch-response";
import { getAllVaccinationDiseases } from "../../manager-request-callback/vaccination/get-all-vaccination-disease-request.callback";

export const fetchAllVaccinationDiseases = async () => {
    try {
        const response = await fetchResponse(() => getAllVaccinationDiseases());

        if (response.status === false)
            throw new Error("Can't fetch all vaccination diseases");

        const vaccinationDiseases = response.data;
        return vaccinationDiseases;

    } catch (error) {
        console.error("Error : " + error);
        throw error; // Re-throw the error to handle it in the component
    }
};

