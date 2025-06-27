
import { getHealthCheckHistoryByPupilIdSchoolYear} from '../../../api/parent/parent-requests-action/health-check/get-health-check-history-action';

import { useState, useEffect } from 'react';
import { useCallback } from 'react';

const useHealthCheckHistoryByPupilIdSchoolYear = (pupilId, schoolYear) => {

    const [ historyRecords, setHistoryRecords ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const fetchHealthCheckHistory = useCallback(async (localPupilId, localSchoolYear) => {
        try {
            setIsLoading(true);
            const record = await getHealthCheckHistoryByPupilIdSchoolYear(localPupilId, localSchoolYear);

            setHistoryRecords([].push(record));
        } catch (err) {
            console.error('Error fetching health check history:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
        // run the fetch function with the provided pupilId and schoolYear once;
        fetchHealthCheckHistory(pupilId, schoolYear);
    }, []);


    return {
        fetchHealthCheckHistory,
        historyRecords,
        isLoading,
        error
    };
} 

export default useHealthCheckHistoryByPupilIdSchoolYear;