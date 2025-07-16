
import Request from "@api/request"

export const MedicationPreparationCallback = async (grade, session) => {

  if (!grade || !session) {
    throw new Error("Grade and session are required parameters")
  }

  if (typeof grade === "number" && (grade < 1 || grade > 5)) {
    throw new Error("Grade must be a number between 1 and 5")
  }

  if (typeof session === "number" && (session < 1 || session > 3)) {
    throw new Error("Session must be a number between 1 and 3")
  }

  return Request.get(`send-medication/prescription-prepare?grade=${grade}&session=${session}`)
}