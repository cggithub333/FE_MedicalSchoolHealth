
import { fetchResponse } from "../../fetch-response.js";
import {
    getAllPupils
} from "../requests/parentRequests";

export const fetchAllPupils = async () => {

    try {
        const response = await fetchResponse(getAllPupils);

        if (response.status === false) {
            throw new Error("Can't request all pupils");
        }

        //else:
        const pupils = await response.data;
        console.log(pupils); // test in console log;
        return pupils;

    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to handle it in the component
    }
}

