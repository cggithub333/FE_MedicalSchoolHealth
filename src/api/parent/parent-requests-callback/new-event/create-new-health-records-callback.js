import request from "@api/request";

export const createNewHealthRecordsCallback = async (formData) => {
    try {
        const response = await request.post("parent-health-records", formData);
        return response;
    } catch (error) {
        console.error("Error creating new health records:", error);
        throw error;
    }
}