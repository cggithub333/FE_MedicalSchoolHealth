
import { fetchResponse } from "@api/fetch-response";
import { updatePrescriptionStatusCallback } from "@api/schoolnurse/schoolnurse-requests-callback/send-medication/update-prescription-status-callback";

export const updatePrescriptionStatusAction = async (sendMedicationId, status) => {
  try {

    const callback = () => updatePrescriptionStatusCallback(sendMedicationId, status);

    // Validate status
    if (status !== "APPROVED" && status !== "REJECTED") {
      throw new Error("Invalid status. Only 'APPROVED' or 'REJECTED' are allowed.");
    }

    // Call the callback function to update the prescription status
    const response = await fetchResponse(callback);

    // debug:
    console.log("Update Prescription Status Response:", response);

  } catch (error) {
    console.error("Error updating prescription status:", error);
    throw error; // Re-throw the error for further handling
  }
}