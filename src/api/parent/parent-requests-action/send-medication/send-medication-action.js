
import { sendMedicationCallback } from "@api/parent/parent-requests-callback/send-medication/send-medication-callback";
import { fetchResponse } from "@api/fetch-response";

export const sendMedicationAction = async (formData) => {

  try {
    const callback = () => sendMedicationCallback(formData);

    const response = await fetchResponse(callback);

    // debug:
    console.log("sendMedicationAction response:", response);

    const data = response.data;
    //debug:
    console.log("sendMedicationAction data:", JSON.stringify(data, null, 2));
  }
  catch (error) {
    console.error("sendMedicationAction error:", error);
    throw error; // Re-throw to handle it in the calling function
  }
}