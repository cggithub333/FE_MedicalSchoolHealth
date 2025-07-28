import { useState, useEffect } from "react";
import { getReportForCurrentYear } from "@api/common/get-report-for-current-year";

export const useGetReportForCurrentYear = () => {
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setIsLoading(true);
                const data = await getReportForCurrentYear();
                // debug:
                setReportData(data);
            } catch (err) {
                setError(err.message || "An error occurred while fetching the report");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, []);

    return { reportData, error, isLoading };
}