
import { useState, useEffect, useCallback } from "react";
import { getAllDiseasesVaccinesAction } from "@api/parent/parent-requests-action/vaccination/get-all-diseases-vaccines-action";

const useAllDiseasesVaccines = () => {

  const [diseaseVaccineMap, setDiseaseVaccineMap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiseasesVaccines = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedDiseaseVaccineMap = await getAllDiseasesVaccinesAction();
      setDiseaseVaccineMap(fetchedDiseaseVaccineMap);

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiseasesVaccines();
  }, [fetchDiseasesVaccines]);

  return {
    diseaseVaccineMap,
    loading,
    error,
    refetch: fetchDiseasesVaccines, // Allow manual refetching
  }
}

export default useAllDiseasesVaccines;