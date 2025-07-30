
import request from "@api/request"

export const queryAllUsersCallback = async () => {
  return await request.get("users/all");
}