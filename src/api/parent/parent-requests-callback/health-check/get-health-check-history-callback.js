
import Request from '../../../request';

export const getHealthCheckHistoryCallback = async (pupilId, schoolYear) => {

  return Request.get(`management/health-check/annual/result?pupilId=${pupilId}&schoolYear=${schoolYear}`);
}