
import { useSelector } from "react-redux";

const useStoredPrescription = () => useSelector((state) => state.prescription);

export default useStoredPrescription;