
import { getTodayTakeMedicationSessionAction } from "@api/schoolnurse/schoolnurse-requests-action/send-medication/get-today-take-medication-session-action";
import { useState, useEffect} from "react";

const useTodayTakeMedicationSessions = () => {

  const [sessionsInfor, setSessionsInfor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      
      setLoading(true);
      setError(null);

      try {
        const infor = await getTodayTakeMedicationSessionAction();
        setSessionsInfor(infor);

      } catch (err) {
        console.error("Error fetching today's take medication sessions:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return {
    sessionsInfor,
    loading,
    error
  };
}

export default useTodayTakeMedicationSessions;