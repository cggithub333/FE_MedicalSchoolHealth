
import {useSelector} from "react-redux";

const useDatePicker = () => {
  // Get the date from the Redux store
  const data = useSelector((state) => state.datePicker.value);

  // debug:
  // console.log("useDatePicker data:", data);
  // console.log("useDatePicker data:", data.format("DD-MM-YYYY"));

  return data;
}

export default useDatePicker;