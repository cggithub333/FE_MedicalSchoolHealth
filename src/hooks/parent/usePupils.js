import { useEffect } from "react";
import { useState } from "react";

import { fetchAllPupils } from '../../api/parent/parent-requests-action/pupil-request-action';

const usePupils = () => {

  const [pupils, setPupils] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    const fetchPupils = async () => {

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
    }

    // run the above function fot setting states:
    fetchPupils();

  }, []); // empty dependency for running once;

  return {
    pupils: pupils,
    isLoading: isLoading
  }
}

export default usePupils;