
import Request from '../../request';

export const getAllPupils = async () => {
  return Request.get('pupils');
}

export const getSurveyByPupilId = async (pupilId) => {
  return Request.get(`surveys/?pupilId=${pupilId}`);
}