import { fetchResponse } from "../../fetch-response.js";
import { getAllPupils } from "./pupils-request-action.js";

export const fetchAllPupils = async () => {
    const response = await fetchResponse(getAllPupils);
    if (response.status) {
        return response.data;
    } else {
        throw new Error(response.error || "Failed to fetch pupils");
    }
}