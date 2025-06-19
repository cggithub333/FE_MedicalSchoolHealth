import { fetchResponse } from '../Helper';
import { 
  login, 
  logout, 
  refreshToken, 
  getUserProfile 
} from '../admin-requests/userRequests';

// Authentication helpers
export const handleLogin = async (credentials) => {
  try {
    const response = await fetchResponse(login(credentials));
    if (response.status === false) {
      throw new Error("Login failed");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const handleLogout = async () => {
  try {
    const response = await fetchResponse(logout());
    if (response.status === false) {
      throw new Error("Logout failed");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const handleRefreshToken = async (refreshToken) => {
  try {
    const response = await fetchResponse(refreshToken(refreshToken));
    if (response.status === false) {
      throw new Error("Token refresh failed");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Profile helpers
export const handleGetUserProfile = async (userId) => {
  try {
    const response = await fetchResponse(getUserProfile(userId));
    if (response.status === false) {
      throw new Error("Failed to fetch user profile");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
} 