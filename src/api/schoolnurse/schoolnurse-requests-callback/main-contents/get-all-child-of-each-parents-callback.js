import request from "@api/request";

export const getAllChildOfEachParentsCallback = async () => request.get("pupils/listPupils")