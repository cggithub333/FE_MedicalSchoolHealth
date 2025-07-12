
import { fetchResponse } from "@api/fetch-response";
import { MedicationPreparationCallback } from '../../schoolnurse-requests-callback/send-medication/medication-preparation-callback'

export const MedicationPreparationAction = async (grade, session) => {

  try {

    const callback = () => MedicationPreparationCallback(grade, session);

    const response = await fetchResponse(callback);

    // debug:
    console.log("MedicationPreparationAction response:", JSON.stringify(response, null, 2));

    const medicationPreparations = await response.data || [];

    return medicationPreparations;
  } catch(error) {
    throw new Error(`MedicationPreparationAction failed: ${error.message}`);
  }

}