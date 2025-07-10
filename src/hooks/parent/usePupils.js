import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";

import { fetchAllPupils } from '../../api/parent/parent-requests-action/pupil-request-action';

const usePupils = () => {

  const [pupils, setPupils] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPupils = useCallback(async () => {

    // fetching data..
    setIsLoading(true);

    try {
      const data = await fetchAllPupils();

      // debug:
      // console.log("Pupils: " + JSON.stringify(data, null, 2));

      if (!data) {
        // empty, null, undefined;
        throw new Error("usePupils.js: pupils are (empty, null, undefined)");
      }

      //else:
      setPupils(data);
    } catch (error) {
      console.error("usePupils.js: error happened!");
      console.error("details: " + error);
    } finally {
      setIsLoading(false); // stop loading even errors happened or not;
    }
  }, []); // useCallback ensures that the function is not recreated on every render

  useEffect(() => {

    const fetcher = async () => {
      await fetchPupils();
    }

    fetcher();

  }, []); // empty dependency for running once;

  return {
    pupils: pupils,
    isLoading: isLoading,
    refetchPupils: fetchPupils, // Allows manual refetching
  }
}

export default usePupils;