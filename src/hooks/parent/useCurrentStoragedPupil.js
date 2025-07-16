
import { Base64 } from "js-base64";
import { useState, useEffect, useCallback } from "react"

const useCurrentStoragedPupil = () => {

  const [loading, setLoading] = useState(false);
  const [currentPupil, setCurrentPupil] = useState(null);

  const getStoragedPupil = useCallback(async () => {

    setLoading(true);
    try {
      const encodedPupilInfor = localStorage.getItem("pupilInfor");
      const pupilInfor = Base64.decode(encodedPupilInfor);
      const pupilObj = JSON.parse(pupilInfor);
      if (pupilObj) {
        setCurrentPupil(pupilObj);
      } else {
        setCurrentPupil(null);
      }
    } catch (error) {
      console.error("Error retrieving pupil from localStorage:", error);
      setCurrentPupil(null);
    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    const fetchPupil = async () => {
      await getStoragedPupil();
    };

    fetchPupil();
  }, [getStoragedPupil]);
  

  return {
    loading,
    currentPupil,
    refetch: getStoragedPupil
  };
}

export default useCurrentStoragedPupil