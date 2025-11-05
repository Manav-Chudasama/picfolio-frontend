// Backend API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  getUsers: () => `${API_BASE_URL}/api/users`,
  createUser: () => `${API_BASE_URL}/api/user/create`,
  authUser: () => `${API_BASE_URL}/api/user/auth`,
  renameUser: (username, newUsername) =>
    `${API_BASE_URL}/api/user/rename/${username}/${newUsername}`,
  deleteUser: (username) => `${API_BASE_URL}/api/user/delete/${username}`,
  uploadAsset: () => `${API_BASE_URL}/api/upload`,
  getPhotosList: () => `${API_BASE_URL}api/list/general`,
  getAssetDetails: (username, photoId) =>
    `${API_BASE_URL}/api/details/${username}/${photoId}`,
};
