import { useState } from "react";
import { authorizeAction } from '../../api/auth/login-acttion';

const useAuth = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(null);

  const loginWithPwd = async (phoneNumber, password) => {
    setIsLoading(true);
    try {
      await authorizeAction(phoneNumber, password);
      setSuccess(true);
      setRole(localStorage.getItem('userRole'));
    } catch (error) {
      setError(error);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginWithPwd,
    success,
    error,
    isLoading,
    role,
  };
};

export default useAuth;