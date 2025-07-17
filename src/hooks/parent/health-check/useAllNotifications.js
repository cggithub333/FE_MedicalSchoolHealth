
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
      // console.log("Fetched notifications:", data);

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

  return { 
    notifications, loading, error, 
    refetch: fetchNotifications, quantity: (notifications.length || 0),
    countNotificationsByType: countNotificationCountByType(notifications || [])
  };
}


const countNotificationCountByType = (notifications) => {

  if (!notifications || !Array.isArray(notifications)) {
    return {};
  }

  //else:
  const notificationTypeCount = notifications.reduce((acc, item) => {

    if (!item || !item.typeNotification) {
      return acc; // skip if item or typeNotification is not defined
    }

    const type = item.typeNotification;
    if (!acc[type]) {
      acc[type] = 1; // initialize count for new type, avoid 0 as initial value
    } else {
      acc[type] += 1; // increment count for existing type
    }
    return acc;

  }, {});

  return notificationTypeCount;
}


export default useAllNotifications;