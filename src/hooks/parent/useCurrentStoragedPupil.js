
import { Base64 } from "js-base64";
import { useState, useEffect, useCallback } from "react"

const useCurrentStoragedPupil = () => {

  const [loading, setLoading] = useState(true); // Start with loading = true
  const [currentPupil, setCurrentPupil] = useState(null);

  const getStoragedPupil = useCallback(() => { // Remove async since we're not doing async operations

    setLoading(true);
    try {
      const encodedPupilInfor = localStorage.getItem("pupilInfor");
      
      console.log("🔍 Checking localStorage for pupilInfor:");
      console.log("- Raw encoded data:", encodedPupilInfor);
      
      if (!encodedPupilInfor) {
        console.warn("❌ No pupilInfor found in localStorage");
        setCurrentPupil(null);
        setLoading(false);
        return;
      }

      console.log("📝 Attempting to decode pupilInfor...");
      const pupilInfor = Base64.decode(encodedPupilInfor);
      console.log("- Decoded data:", pupilInfor);
      
      if (!pupilInfor) {
        console.warn("❌ Failed to decode pupilInfor");
        setCurrentPupil(null);
        setLoading(false);
        return;
      }

      console.log("🔧 Attempting to parse JSON...");
      const pupilObj = JSON.parse(pupilInfor);
      console.log("- Parsed pupil object:", pupilObj);
      
      if (pupilObj && typeof pupilObj === 'object') {
        console.log("✅ Successfully set currentPupil:", pupilObj);
        setCurrentPupil(pupilObj);
      } else {
        console.warn("❌ Invalid pupil object structure");
        setCurrentPupil(null);
      }
    } catch (error) {
      console.error("💥 Error retrieving pupil from localStorage:", error);
      console.error("Stack trace:", error.stack);
      setCurrentPupil(null);
    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    // Run immediately on mount, no need for async wrapper
    getStoragedPupil();
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