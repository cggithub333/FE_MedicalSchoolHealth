
export const stylePupilBtn = (pupilGender) => {
  return {
    color: "#fff",
    background: (pupilGender == "F") ? "#e493b3" : "#65aee7",
    borderRadius: "5px",
    padding: "2px",
    boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.1)",
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