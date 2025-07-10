import { getMyInformation } from "@api/common/get-my-information";
import { useDispatch, useSelector } from "react-redux";
import {
  setPersonalInfo,
  clearPersonalInfo,
  isEmptyPersonalInfo,
} from "@store/slices/personalInforSlice";
import { useEffect, useState } from "react";

// Custom hook to manage personal user information
const useMyInformation = () => {
  const dispatch = useDispatch();

  // Local state to hold user information for immediate access in component
  const [personalInforState, setPersonalInforState] = useState(null);

  // Local state for error and loading status
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Select personal information from Redux store
  const personalInformation = useSelector((state) => state.personalInfor.information);

  // Selector to check if stored information is empty
  const isEmptyInfor = useSelector(isEmptyPersonalInfo);

  /**
   * Effect 1: Sync Redux state to local state
   * If Redux has data and it's not empty, copy it to local state.
   * This avoids using useSelector directly in deep component trees and gives local control.
   */
  useEffect(() => {
    if (!isEmptyInfor) {
      setPersonalInforState(personalInformation);
    }
  }, [isEmptyInfor, personalInformation]);

  /**
   * Effect 2: Fetch personal information from API only if not already in Redux store
   * On first mount or when Redux store is empty (e.g., on logout or refresh),
   * this hook triggers a network request to fetch user info.
   */
  useEffect(() => {
    if (isEmptyInfor) {
      const fetchInfor = async () => {
        setLoading(true);      // Start loading
        setError(null);        // Reset error state

        try {
          const personalInfor = await getMyInformation(); // Call API
          if (personalInfor) {
            setPersonalInforState(personalInfor);         // Update local state
            dispatch(setPersonalInfo(personalInfor));     // Update global Redux store
          }
        } catch (err) {
          setError(err);             // Save error to state
          dispatch(clearPersonalInfo()); // Clear Redux store if fetch fails
        } finally {
          setLoading(false);         // Stop loading
        }
      };

      fetchInfor(); // Trigger the async function
    }
  }, [isEmptyInfor, dispatch]);

  // Return useful data and status for components that consume this hook
  return {
    personalInforState, // User info (either from Redux or fetched)
    error,              // Any error from API call
    loading             // Loading status
  };
};

export default useMyInformation;