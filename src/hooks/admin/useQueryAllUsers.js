
import { queryAllUsersAction } from "@api/admin/admin-requests-action/query-all-users-action";

import { useState, useEffect, useCallback } from "react";

const useQueryAllUsers = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedUsers = await queryAllUsersAction();
      setUsers(fetchedUsers);
    } catch(err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return {
    error, loading, users, refetchAllUsers: fetchAllUsers
  }
}

export default useQueryAllUsers;