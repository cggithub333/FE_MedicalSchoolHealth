
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
      // console.log("Fetched Notifications for Pupils' New Events:", notiNewEvents);
      setNotiNewEventOfPupils(notiNewEvents);
    } catch (err) {
      setError(err.message);
      // console.error("Error fetching notifications for pupils' new events:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchNotiNewEventOfPupils();
  }, [fetchNotiNewEventOfPupils]);

  return { 
    notiNewEventOfPupils, loading, 
    error, refetch: fetchNotiNewEventOfPupils,
    getSimplifiedEventsByPupilId: (pupilId) => getSimplifiedEventsByPupilId(pupilId, notiNewEventOfPupils)
  };
}

const getSimplifiedEventsByPupilId = (pupilId, notiNewEventOfPupils) => {

  if (!pupilId) {
    console.error("Pupil ID is not provided.");
    return [];
  };
  if (!notiNewEventOfPupils || notiNewEventOfPupils.length === 0) {
    console.error("No new medical events found for the pupil.");
    return [];
  }


  // debug:
  console.log("getSimplifiedEventsByPupilId called with pupilId:", pupilId);
  console.log("notiNewEventOfPupils:", notiNewEventOfPupils);

  const convertedRes = notiNewEventOfPupils
    .filter(event => event.pupil?.pupilId === pupilId)
    .map(event => ({
      status: event.status,
      dateTime: event.dateTime,
      schoolNurse: {
        name: `${event.schoolNurse?.lastName} ${event.schoolNurse?.firstName}`,
      }
    }));

  return convertedRes;
}


export default useNotifyNewMedicalEvents;