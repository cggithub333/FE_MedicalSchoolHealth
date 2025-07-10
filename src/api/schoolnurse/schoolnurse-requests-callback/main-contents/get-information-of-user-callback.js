import request from "@api/request";

export const getInformationOfUserCallback = async () => request.get("users/me")