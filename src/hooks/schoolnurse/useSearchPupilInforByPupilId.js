
import { searchPupilInformationByPupilIdAction } from "@api/schoolnurse/schoolnurse-requests-action/search-pupil-infor-by-pupilid-action";

import { useState, useEffect, useCallback } from "react";

const useSearchPupilInforByPupilId = (pupilId) => {
  const [pupilInfo, setPupilInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const pupilFetcher = useCallback(async (searchPupilId) => {

    if (!searchPupilId) {
      searchPupilId = pupilId;
    }

    if (!searchPupilId) {
      setPupilInfo(null);
      return;
    }

    // adjust searchValue:
    searchPupilId = searchPupilId.trim();
    searchPupilId = searchPupilId.toUpperCase();
    
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching pupil with ID:", searchPupilId);
      const pupilInfo = await searchPupilInformationByPupilIdAction(searchPupilId);
      console.log("Fetched pupil info:", pupilInfo);
      setPupilInfo(pupilInfo);
    } catch (err) {
      setError(err);
      setPupilInfo(null);
      console.error("Error fetching pupil information:", err);
    } finally {
      setIsLoading(false);
    }
  }, [pupilId]);

  useEffect(() => {
    const fetchPupil = async () => {
      if (pupilId && pupilId.trim()) {
        await pupilFetcher(pupilId);
      } else {
        setPupilInfo(null);
      }
    }
    fetchPupil();
  }, [pupilId, pupilFetcher]);

  return { pupilInfo, isLoading, error, refetch: pupilFetcher };
}

export default useSearchPupilInforByPupilId;