
import request from "@api/request"

const changeStatusUserByIdCallback = async (userId, active) => {
  return request.patch(
    `users/active/${userId}?active=${active}`,
  )
} 

export const changeStatusUserById = async (userId, active) => {
  try {
    const response = await changeStatusUserByIdCallback(userId, active);
    return (response.status >= 200 && response.status < 300);
  } catch (err) {
    throw new Error(`Failed to change user status: ${err.message}`);
  }
}