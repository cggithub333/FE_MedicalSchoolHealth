import { Navigate } from "react-router-dom"

const Logout = () => {

  // clear all localStotage's data:
  localStorage.clear();1
  
  // add light mode:
  localStorage.setItem("toolpad-mode", "light");
  
  // back to HOmepage:
  return <Navigate to={"/homepage"} replace />
}

export default Logout;