
import Request from '../../request';

export const getAllPupils = async () => {
  return Request.get('parent_pupils');
}

export const getSurveyByPupilId = async (pupilId) => {
  return Request.get(`surveys/?pupilId=${pupilId}`);
}

export const getVaccinationSurvey = async () => {
  return Request.get('vaccination_survey_by_parentId');
}