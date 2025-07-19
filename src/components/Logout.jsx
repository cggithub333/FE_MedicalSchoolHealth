import { Navigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import { clearPersonalInfo } from "@store/slices/personalInforSlice";

const Logout = () => {
  const dispatch = useDispatch();

  // clear all localStorage's data:
  localStorage.clear();

  // clear personal info from redux store:
  dispatch(clearPersonalInfo());
  
  // add light mode:
  localStorage.setItem("toolpad-mode", "light");

  // back to Homepage:
  return <Navigate to={"/homepage"} replace />
}

export default Logout;