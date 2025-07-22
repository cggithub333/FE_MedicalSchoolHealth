
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
    refetch: getStoragedPupil,
    filterPupilInforWithCurrentParent: (pupilInfo, parentId) => filterCurrentPupilWithCurrentParent(pupilInfo, parentId)
  };
}

const filterCurrentPupilWithCurrentParent = (pupilInfo, parentId) => {

  if (!pupilInfo || !parentId) {
    return null; // Return null if no data is available
  }
  const result =  {
    pupilId: pupilInfo.pupilId,
    lastName: pupilInfo.lastName,
    firstName: pupilInfo.firstName,
    birthDate: pupilInfo.birthDate,
    gender: pupilInfo.gender,
    gradeId: pupilInfo.gradeId,
    startYear: pupilInfo.startYear,
    gradeLevel: pupilInfo.gradeLevel,
    gradeName: pupilInfo.gradeName,
    currentParent: pupilInfo.parents.find(parent => parent.userId === parentId) || null,
  }
  return result.currentParent ? result : null; // Return the pupil info if the parent is found, otherwise return null
}


export default useCurrentStoragedPupil