import { useLocation } from "react-router-dom"

const forAllChildrenLink = [
  "/parent/declaration/health-declaration",
  "/parent/profile",
  "/parent/notification"
]

export const stylePupilBtn = (pupilGender) => {

  const location = useLocation(); 
  const test = (forAllChildrenLink.some(item => location.pathname.includes(item)))
  const isForAll = test;
  const isForMale = !test && (pupilGender === "M");
  const backgroundColor = isForAll ? "#e7ef88" : (isForMale ? "#65aee7" : "#e493b3");

  return {
    color: "#fff",
    background: backgroundColor,
    borderRadius: "5px",
    padding: "2px",
    boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.1)",
    transition: "all 0.5s ease",
    "&:hover": {
      background: "#e7ef88"
    }
  }
}

export const styleChildItem = (isInStorage) => {
  return {
    background: (isInStorage) ? "#1565c0" : "#fff",
    color: (isInStorage) ? "#fff" : "#000",
    display: "flex",
    gap: "10px",
    alignItems: "center"
  }
}