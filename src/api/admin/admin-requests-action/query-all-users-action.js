
import { queryAllUsersCallback } from "../admin-requests-callback/query-all-users-callback";
import { fetchResponse } from "@api/fetch-response";

export const queryAllUsersAction = async () => {
  try {
    const response = await fetchResponse(queryAllUsersCallback);
    const userList = await response.data || [];
    return userList;
  } catch (err) {
    throw new Error(`Error fetching users: ${err.message}`);
  }
}