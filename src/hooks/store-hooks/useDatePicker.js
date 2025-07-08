
import {useSelector} from "react-redux";

const useDatePicker = () => useSelector((state) => state.datePicker);

export default useDatePicker;