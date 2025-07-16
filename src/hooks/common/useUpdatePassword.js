
import { updateNewPassword } from "@api/common/update-new-password";
import { useState, useCallback } from "react";

const useUpdatePassword = () => {

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const updatePassword = useCallback(async (requestData) => {

    setIsSuccess(false);
    setError(null);

    try {
      await updateNewPassword(requestData);
      setIsSuccess(true);
    } catch(err) {
      setError(err.message || "An error occurred while updating password");
      throw new Error(err.message || "An error occurred while updating password");
    }
  }, []);

  return {
    isSuccess,
    error,
    updatePassword
  };
}

export default useUpdatePassword;