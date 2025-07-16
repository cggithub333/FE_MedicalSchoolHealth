import { useState, useEffect } from "react";
import { getAllEquipmentMedicalAction } from "../../../api/schoolnurse/schoolnurse-requests-action/new-event/get-all-equipment-medical-action";

export const useGetAllEquipment = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEquipmentList = async () => {
        try {
            setLoading(true);
            const response = await getAllEquipmentMedicalAction();
            setEquipmentList(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquipmentList();
    }, []);

    return { equipmentList, loading, error };
}
