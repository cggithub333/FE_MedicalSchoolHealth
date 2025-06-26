import { useEffect } from "react";
import { useState } from "react";

import { authorizeAction } from '../../api/auth/login-acttion';

//parent login:
const parentPhonenumber = "0848025116";
const parentPassword = "12345";

const useAuth = () => {

  //parent login:
  // const [ phoneNumber, setPhoneNumber ] = useState('');
  // const [ password, setPassword ] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    const authorize = async () => {

      setIsLoading(true);

      try {

        // authorize:
        authorizeAction(parentPhonenumber, parentPassword);

        // no errors:
        setSuccess(true);

      } catch (error) {
        console.error("useAuth.js: ", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    authorize();

  }, []);

  return {
    success: success,
    error: error,
    isLoading: isLoading
  }
}

export default useAuth;