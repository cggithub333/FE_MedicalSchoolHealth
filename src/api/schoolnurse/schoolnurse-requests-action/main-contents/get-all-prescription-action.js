import { fetchResponse } from "@api/fetch-response";
import { getAllPrescriptionCallback } from "@api/schoolnurse/schoolnurse-requests-callback/main-contents/get-all-prescription-callback.js";

export const getAllPrescriptionAction = async () => {
    try {
        const response = await fetchResponse(() => getAllPrescriptionCallback());
        return response;
    } catch (error) {
        console.error("Error fetching all prescriptions:", error);
        throw error;
    }
}