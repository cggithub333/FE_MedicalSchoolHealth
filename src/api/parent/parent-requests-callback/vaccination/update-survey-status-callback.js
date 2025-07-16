
import Request from '@api/request';

export const updateSurveyStatusCallback = async (consentFormId, status) => {

  if (!consentFormId || !status || (status !== 'APPROVED' && status !== 'REJECTED')) {
    throw new Error('Invalid parameters: consentFormId and status are required, and status must be either APPROVED or REJECTED.');
  }

  return Request.patch(`consent-forms/${consentFormId}/respond`,
    {
      "status": status,
      "notes": "no notes"
    }
  );
}