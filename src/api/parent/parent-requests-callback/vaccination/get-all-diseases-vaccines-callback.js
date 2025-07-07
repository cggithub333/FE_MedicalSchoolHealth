
import Request from "@api/request";

export const getAllDiseasesVaccinesCallback = async () => {

  return Request.get(`diseases/vaccines`);
}