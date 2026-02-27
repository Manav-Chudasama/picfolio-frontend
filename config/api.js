// Backend API Configuration
export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/+$/, "");

export const API_ENDPOINTS = {
  getUsers: () => `${API_BASE_URL}/api/users`,
  createUser: () => `${API_BASE_URL}/api/user/create`,
  authUser: () => `${API_BASE_URL}/api/user/auth`,
  renameUser: (username, newUsername) =>
    `${API_BASE_URL}/api/user/rename/${username}/${newUsername}`,
  deleteUser: (username) => `${API_BASE_URL}/api/user/delete/${username}`,
  uploadAsset: () => `${API_BASE_URL}/api/upload`,
  getPhotosList: () => `${API_BASE_URL}/api/list/general`,
  getAssetDetails: (username, photoId) =>
    `${API_BASE_URL}/api/details/${username}/${photoId}`,
  getPreview: (username, photoId) =>
    `${API_BASE_URL}/api/preview/${username}/${photoId}`,
  getMaster: (username, photoId) =>
    `${API_BASE_URL}/api/asset/${username}/${photoId}`,

  // Favorites APIs
  toggleLike: (username, assetId) =>
    `${API_BASE_URL}/api/like/${username}/${assetId}`,
  checkLiked: (username, assetId) =>
    `${API_BASE_URL}/api/liked/${username}/${assetId}`,
  searchAssets: () => `${API_BASE_URL}/api/search`,

  // Faces APIs
  getFacesList: () => `${API_BASE_URL}/api/list/faces`,
  getFaceImage: (username, faceId) =>
    `${API_BASE_URL}/api/face/image/${username}/${faceId}`,
  getFaceName: (username, faceId) =>
    `${API_BASE_URL}/api/face/name/${username}/${faceId}`,
  getFaceAssets: (username, faceId) =>
    `${API_BASE_URL}/api/list/face/${username}/${faceId}`,
  renameFace: (username, faceId, name) =>
    `${API_BASE_URL}/api/face/rename/${username}/${faceId}/${encodeURIComponent(name)}`,
  deleteFace: (username, faceId) =>
    `${API_BASE_URL}/api/face/delete/${username}/${faceId}`,
  joinFaces: () => `${API_BASE_URL}/api/face/join`,
  addFaceToPhoto: () => `${API_BASE_URL}/api/face/add`,
  removeFaceFromPhoto: () => `${API_BASE_URL}/api/face/remove`,
  getPendingVerifications: (username) =>
    `${API_BASE_URL}/api/face/verify/pending/${username}`,
  updateVerification: () => `${API_BASE_URL}/api/face/verify/update`,

  // Auto Albums APIs
  getAutoAlbumsList: () => `${API_BASE_URL}/api/list/autoalbums`,
  getAutoAlbumCover: (username, autoAlbumName) =>
    `${API_BASE_URL}/api/autoalbum/${username}/${encodeURIComponent(autoAlbumName)}`,
  getAutoAlbumAssets: () => `${API_BASE_URL}/api/list/autoalbums`,

  // Album APIs
  listAlbums: () => `${API_BASE_URL}/api/list/albums`,
  createAlbum: () => `${API_BASE_URL}/api/album/create`,
  addAssetsToAlbum: () => `${API_BASE_URL}/api/album/add`,
  removeAssetsFromAlbum: () => `${API_BASE_URL}/api/album/remove`,
  deleteAlbum: () => `${API_BASE_URL}/api/album/delete`,
  getAlbumAssets: (username, albumId) =>
    `${API_BASE_URL}/api/album/${username}/${albumId}`,
  renameAlbum: () => `${API_BASE_URL}/api/album/rename`,
  redateAlbum: () => `${API_BASE_URL}/api/album/redate`,

  // Delete/Bin APIs
  deleteAssets: (username, ids) =>
    `${API_BASE_URL}/api/delete/${username}/${ids}`,
  getDeletedAssets: () => `${API_BASE_URL}/api/list/deleted`,
  restoreAssets: () => `${API_BASE_URL}/api/restore`,

  // Duplicates API
  getDuplicates: () => `${API_BASE_URL}/api/list/duplicate`,

  // Statistics API
  getStatistics: () => `${API_BASE_URL}/api/stats`,

  // Redate API
  redateAssets: () => `${API_BASE_URL}/api/redate`,

  // Location API
  updateLocation: () => `${API_BASE_URL}/api/location`,

  // Pending Assets API
  getPendingCount: (username) => `${API_BASE_URL}/api/pending/${username}`,
};
