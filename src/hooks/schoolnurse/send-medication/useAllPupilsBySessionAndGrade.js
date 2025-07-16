
import { getAllPupilsBySessionAndGradeAction } from "@api/schoolnurse/schoolnurse-requests-action/send-medication/get-all-pupils-by-session-and-grade-action";
import {useState, useEffect, useCallback} from "react";

const useAllPupilsBySessionAndGrade = () => {

  const [pupilsInfor, setPupilsInfor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPupils = useCallback(async (sessionId, gradeId) => {

    if (!sessionId || !gradeId) {
      return;
    }

    try {
      setLoading(true);
      const pupils = await getAllPupilsBySessionAndGradeAction(sessionId, gradeId);
      setPupilsInfor(pupils);
    } catch (err) {
      console.error("Error fetching pupils information:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { pupilsInfor, loading, error, refetch: fetchPupils };
}

export default useAllPupilsBySessionAndGrade;