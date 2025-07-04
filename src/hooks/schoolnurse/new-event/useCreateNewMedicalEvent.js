import { useState, useEffect } from "react";
import createNewMedicalEventAction from "../../../api/schoolnurse/schoolnurse-requests-action/new-event/create-new-medical-event-action";

export const useCreateNewMedicalEvent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createNewMedicalEvent = async (eventData) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            await createNewMedicalEventAction(eventData);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { createNewMedicalEvent, loading, error, success };
}
