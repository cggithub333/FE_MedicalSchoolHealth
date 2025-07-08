
//getNofityNewMedicalEventsCallback

import { useState, useEffect, useCallback } from "react";
import { getNofityNewMedicalEventsAction } from "@api/parent/parent-requests-action/medical-events/get-notify-new-medical-events-action.js";

const useNotifyNewMedicalEvents = () => {
  const [notiNewEventOfPupils, setNotiNewEventOfPupils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotiNewEventOfPupils = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const notiNewEvents = await getNofityNewMedicalEventsAction();
      //debug:
      console.log("Fetched Notifications for Pupils' New Events:", notiNewEvents);
      setNotiNewEventOfPupils(notiNewEvents);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching notifications for pupils' new events:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchNotiNewEventOfPupils();
  }, [fetchNotiNewEventOfPupils]);

  return { notiNewEventOfPupils, loading, error, refetch: fetchNotiNewEventOfPupils };
}

export default useNotifyNewMedicalEvents;