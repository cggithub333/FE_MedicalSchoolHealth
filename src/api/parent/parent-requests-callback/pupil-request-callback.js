
import Request from '../../request';

export const getAllPupils = async () => {
  return Request.get('parent_pupils');
}

export const getSurveyByPupilId = async (pupilId) => {
  return Request.get(`health-check-consent-form/?pupilId=${pupilId}`);
}

export const getVaccinationSurvey = async () => {
  return Request.get('vaccination_survey_by_parentId');
}

export const getVaccinationHistoryByPupilId = async (pupilId) => {
  return Request.get(`vaccination-history-by-pupilid?pupilId=${pupilId}`);
}