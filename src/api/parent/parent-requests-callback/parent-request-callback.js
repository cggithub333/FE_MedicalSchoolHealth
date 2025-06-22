
import Request from '../../request';

// health check campaign:
export const getLatestHealthCheckCampaign = async () => {

  return Request.get('latest_campaign');
}

// send request for changes in Survey's sensitive disease:
export const updateSentitiveDisease = async (data) => {
  return Request.patch(`healthCheckConsentFormConfirm`, data);
}
/*
  data = {
    consentFormId: 23,
    healthCheckkDisease: [
      {
        diseaseId: 6,
        status: 'Approved'
      },
      {
        diseaseId: 8,
        status: 'Approved'
      },
      {
        diseaseId: 12,
        status: 'Approved'
      }
      // còn lại không gửi (nghĩa là parent không chọn) thì thành `Rejected` hết (kể cả đang `Approved` trong database);
    ]
  }
*/


