
import request from "@api/request";

export const changeStaffRole = async (userId, newRole) => {
  try {
    const response = await request.patch(
      `users/role/${userId}?role=${newRole}`
    );

    // debug:
    console.log("changeStaffRole response:", JSON.stringify(response, null, 2));

    if (response.status >= 200 && response.status < 300) {
      return true;
    }
  } catch(err) {
    throw new Error(`Failed to change staff role: ${err.message}`);
  }
}