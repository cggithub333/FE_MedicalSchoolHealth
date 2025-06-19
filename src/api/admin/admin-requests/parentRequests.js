

import Request from "../Request";

export const requestAllPupils = async () =>  Request.get('pupils');

export const requestAllVaccinationHistoryByPupilId = async (pupilId) => Request.get(`vaccination-history/?pupilId=${pupilId}`);

export const requestAllVaccinationSurveyByPupilId = async (pupilId) => Request.get(`vaccination-survey/?pupilId=${pupilId}`);