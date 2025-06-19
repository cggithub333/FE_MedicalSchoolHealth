import { fetchResponse } from '../Helper';
import {
  getAllCampaigns,
  getCampaignDetail,
  getAllVaccinationHistories,
  getVaccinationHistoryDetail,
  createVaccineCampaign,
  deleteCampaign,
  updateAllFieldsCampaign,
  updateSomeFieldsCampaign
} from '../schoolnurse-requests/vaccinationRequests';

// Campaign helpers
export const handleGetAllCampaigns = async () => {
  try {
    const response = await fetchResponse(getAllCampaigns);
    if (response.status === false) {
      throw new Error("Failed to fetch campaigns");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const handleGetCampaignDetail = async (campaignId) => {
  try {
    const response = await fetchResponse(getCampaignDetail(campaignId));
    if (response.status === false) {
      throw new Error("Failed to fetch campaign details");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Parent-only helpers
export const handleGetAllVaccinationHistories = async (childId) => {
  try {
    const response = await fetchResponse(getAllVaccinationHistories(childId));
    if (response.status === false) {
      throw new Error("Failed to fetch vaccination histories");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const handleGetVaccinationHistoryDetail = async (childId, historyId) => {
  try {
    const response = await fetchResponse(getVaccinationHistoryDetail(childId, historyId));
    if (response.status === false) {
      throw new Error("Failed to fetch vaccination history details");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Manager-only helpers
export const handleCreateVaccineCampaign = async (campaignData) => {
  try {
    const response = await fetchResponse(createVaccineCampaign(campaignData));
    if (response.status === false) {
      throw new Error("Failed to create campaign");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const handleDeleteCampaign = async (campaignId) => {
  try {
    const response = await fetchResponse(deleteCampaign(campaignId));
    if (response.status === false) {
      throw new Error("Failed to delete campaign");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const handleUpdateAllFieldsCampaign = async (campaignId, campaignData) => {
  try {
    const response = await fetchResponse(updateAllFieldsCampaign(campaignId, campaignData));
    if (response.status === false) {
      throw new Error("Failed to update campaign");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const handleUpdateSomeFieldsCampaign = async (campaignId, campaignData) => {
  try {
    const response = await fetchResponse(updateSomeFieldsCampaign(campaignId, campaignData));
    if (response.status === false) {
      throw new Error("Failed to update campaign fields");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
} 