

import Request from '@api/request';

export const getVaccinationSurveyCallback = async () => {

  return Request.get('consent-forms/my-forms');
} 