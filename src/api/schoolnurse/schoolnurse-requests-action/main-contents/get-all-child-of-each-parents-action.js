import { fetchResponse } from "@api/fetch-response";
import { getAllChildOfEachParentsCallback } from "@api/schoolnurse/schoolnurse-requests-callback/main-contents/get-all-child-of-each-parents-callback";

export const getAllChildOfEachParentsAction = async () => {
    try {
        const resp = await fetchResponse(getAllChildOfEachParentsCallback);
        if (resp.status === false)
            throw new Error("pupilRequestAction.js: Can't fetch pupils!");

        const pupils = await resp.data;
        return pupils;

    } catch (error) {
        console.error("pupilRequestAction.js: Can't fetch pupils!");
        console.error("details: " + error);
        throw error; // throw for far processing in other components;
    }
}