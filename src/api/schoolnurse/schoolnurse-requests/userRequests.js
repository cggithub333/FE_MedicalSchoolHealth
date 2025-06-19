import { Request } from '../Request';

/* JSON-SERVER API RULE: https://github.com/typicode/json-server */

/**
 * User-related API requests
 * Handles authentication, user management, and user profile operations
 */

// USERS: Authentication requests:
export const login = async (credentials) => {
  return Request.post('/auth/login', credentials);
} 

export const logout = async () => {
  return Request.post('/auth/logout');
}

/* 
  Cuong explains:
    only uses for refresh token when build with json-server.
    then we can remove it if we have a back-end server process it.
  */
export const refreshToken = async (refreshToken) => {
  return Request.post('/auth/refresh-token', { refreshToken });
}

// USERS: User profile requests: 
export const getUserProfile = async (userId) => {
  // server bases on JWT to define which user profile to get.
  return Request.get(`/profile/${userId}`);
}

// ADMIN-ONLY: Account management requests
/*
export const getAllUsers = async () => {
    return Request.get('/users');
};

export const createUser = async (userData) => {
    return Request.post('/users', userData);
};

export const updateAllFieldsUserInfo = async (userId, userData) => { 
    return Request.put(`/users/${userId}`, userData); // update entire information;
};

export const updateSomeFieldsUserInfo = async (userId, userData) => {
    return Request.patch(`/users/${userId}`, userData);
} 

export const deleteUser = async (userId) => {
    return Request.delete(`/users/${userId}`);
}; 
*/