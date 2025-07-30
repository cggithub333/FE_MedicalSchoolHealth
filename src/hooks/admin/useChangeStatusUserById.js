
import { changeStatusUserById } from "@api/admin/admin-requests-action/change-status-user-by-id";

const useChangeStatusUserById = () => {
  const changeStatus = async (userId, active) => {
    try {
      const result = await changeStatusUserById(userId, active);
      return result;
    } catch (err) {
      throw new Error(`Failed to change user status: ${err.message}`);
    }
  }

  return { changeStatus };
}

export default useChangeStatusUserById;