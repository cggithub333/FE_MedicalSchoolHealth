import { useState, useEffect } from "react";
import { fetchAllVaccinationDiseases } from "../../../../api/manager/manager-requests-action/vaccination/get-all-vaccination-disease-request.action";

export const useGetVaccineByDisease = () => {
    const [vaccinesByDisease, setVaccinesByDisease] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const loadVaccines = async () => {
            setIsLoading(true)
            try {
                const response = await fetchAllVaccinationDiseases()
                console.log("✅ API raw response:", response)
                // Extract the GetVaccineByDisease array from the response
                const diseases = response?.GetVaccineByDisease || response || []
                setVaccinesByDisease(diseases)
            } catch (error) {
                console.error("Failed to fetch:", error)
                setVaccinesByDisease([])
            } finally {
                setIsLoading(false)
            }
        }

        loadVaccines()
    }, [])

    return { vaccines: vaccinesByDisease, isLoading }
}

