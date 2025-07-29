import request from "@api/request";
import { fetchResponse } from "@api/fetch-response";

const callback = async () => {
    return request.get(`dashboard/statistics`);
}

export const getReportForCurrentYear = async () => {
    try {
        const response = await fetchResponse(() => callback());

        // debug:
        // console.log("getReportForCurrentYear response:", response);

        const reportData = await response.data;

        return reportData;

    } catch (error) {
        throw new Error(`Error fetching report for current year: ${error.message}`);
    }
}