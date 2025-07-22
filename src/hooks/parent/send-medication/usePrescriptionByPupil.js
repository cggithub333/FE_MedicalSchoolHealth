
import { getPrescriptionByPupilIdAction } from "@api/parent/parent-requests-action/send-medication/get-prescription-by-pupilid-action";
import { parseMedicalInfo } from "@utils/parseLogsObject";
import { useState, useEffect, useCallback } from "react";

const usePrescriptionByPupil = (pupilId) => {

  const [prescriptionArr, setPrescriptionArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrescription = useCallback(async (localPupilId) => {

    setLoading(true);
    setError(null);

    try {

      if (!localPupilId) {
        throw new Error("Pupil ID is required to fetch prescriptions.");
      }

      const fetchedPrescriptionArr = await getPrescriptionByPupilIdAction(localPupilId);

      setPrescriptionArr(fetchedPrescriptionArr);

    } catch (error) {
      console.error('Error fetching prescription:', error);
      setError(error);
      setPrescriptionArr([]); // Clear the prescription array on error
    } finally {
      setLoading(false);
    }

  }, []); // useCallback ensures that the function is not recreated on every render

  useEffect(() => {
    fetchPrescription(pupilId);
  }, []);

  return {
    prescriptionArr,
    loading,
    error,
    refetch: fetchPrescription, // Allows manual refetching
    injectedNoteObjs: injectMedicationLogs(prescriptionArr) // Injects parsed logs into the prescription array
  }
}

const injectMedicationLogs = (prescriptionArr) => {

  if (!prescriptionArr || !Array.isArray(prescriptionArr)) {
    console.error("Invalid prescription array provided.");
    return [];
  }

  const injectedNoteObjs = prescriptionArr.reduce((acc, prescription) => {


    if (!prescription || !prescription.medicationLogs || !Array.isArray(prescription.medicationLogs)) {
      console.warn("No medication logs found for prescription:", prescription);
      return acc;
    }

    const medicationLogs = prescription.medicationLogs;
    const medicationLogNoteObjs = medicationLogs.map(log => {
      
      if (!log || !log.note) {
        console.warn("Invalid log or missing note:", log);
        return null;
      }

      // else:
      const parsedNoteObj = parseMedicalInfo(log.note);
      return parsedNoteObj;
    }).filter(noteObj => noteObj !== null);

    if (medicationLogNoteObjs.length > 0) {
      acc.push(...medicationLogNoteObjs);
    }

    return acc;

  }, []);

  return injectedNoteObjs;
}

export default usePrescriptionByPupil;