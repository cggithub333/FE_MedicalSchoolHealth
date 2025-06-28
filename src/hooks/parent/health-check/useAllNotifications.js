
import { getAllNotificationAction } from '@api/parent/parent-requests-action/health-check/get-all-notification-action';

import { useState, useEffect, useCallback } from 'react';

export const useAllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllNotificationAction();

      // debug:
      console.log("Fetched notifications:", data);

      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, loading, error, refetch: fetchNotifications  };
}

export default useAllNotifications;