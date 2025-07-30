
import { changeStaffRole } from "@api/admin/admin-requests-action/change-staff-role";

const useChangeStaffRole = () => {
  const changeRole = async (userId, newRole) => {
    try {
      const result = await changeStaffRole(userId, newRole);
      return result;
    } catch (error) {
      throw error; // re-throw the error for further handling if needed
    }
  };

  return { changeRole };
}

export default useChangeStaffRole;