
import { sendMedicationAction } from "@api/parent/parent-requests-action/send-medication/send-medication-action";

const useSendMedication = () => {

  const sendMedication = async (formData) => {
    try {
      const response = await sendMedicationAction(formData);
      return response;
    } catch (error) {
      console.error("Error sending medication:", error);
      throw error;
    }
  };
  return { sendMedication };
}

export default useSendMedication;