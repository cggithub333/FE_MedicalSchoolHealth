import { Request } from '../Request';

/**
 * Vaccination-related API requests
 * Handles vaccination history, campaigns, and vaccine information
 */

/* JSON-SERVER API RULE: https://github.com/typicode/json-server */

/*

  Admin: (Build functions about vaccination reports)

  Manager:  + Create new campaign
            + Watch campaigns
            + Watch campaign detail
            + Cancel campaigns
            + Update campaigns

  School nurse: 
            + Watch campaign detail

  Parent:   + Watch campaigns of his/her child
            + Watch campaign detail of his/her child
            + Query vaccination history of his/her child
*/

// Manager, School nurse, Parent:  ---------------------------------------------------------//
export const getAllCampaigns = async () => {
  // server bases on JWT to define which campaigns should the current users read.
  return Request.get('/campaigns');
}

export const getCampaignDetail = async (campaignId) => {
  // server bases on JWT to define which campaigns should the current users read.
  return Request.get(`/campaigns/${campaignId}`);
}


// PARENT-ONLY:-----------------------------------------------------------------------------//
export const getAllVaccinationHistories = async (childId) => {
  // server bases on JWT to define current user and query his child's vaccination history.
  return Request.get(`/vaccination-histories/${childId}`);
}

export const getVaccinationHistoryDetail = async (childId, historyId) => {
  return Request.get(`/vaccination-history/${childId}/${historyId}`);
}


// MANAGER-ONLY: ---------------------------------------------------------------------------//
export const createVaccineCampaign = async (campaignData) => {
  return Request.post(`/campaigns`, campaignData);
}

export const deleteCampaign = async (campaignId) => {
  return Request.delete(`/campaigns/${campaignId}`);
}

export const updateAllFieldsCampaign = async (campaignId, campaignData) => {
  return Request.put(`/campaigns/${campaignId}`, campaignData);
}

export const updateSomeFieldsCampaign = async (campaignId, campaignData) => {
  return Request.patch(`/campaigns/${campaignId}`, campaignData);
}