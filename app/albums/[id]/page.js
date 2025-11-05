"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PhotoGrid from "@/components/photos/PhotoGrid";
import DateSection from "@/components/photos/DateSection";
import { ArrowLeft, Trash2, Edit2, Calendar, Plus, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/components/providers/SessionProvider";
import { API_ENDPOINTS, API_BASE_URL } from "@/config/api";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useGallery } from "@/store/GalleryStore";
import Lightbox from "@/components/photos/Lightbox";

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useSession();
  const { favorites, toggleFavorite } = useGallery();
  const [albumData, setAlbumData] = useState(null);
  const [photosByDate, setPhotosByDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  // Edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editedDate, setEditedDate] = useState("");
  const [showAddPhotos, setShowAddPhotos] = useState(false);
  const [availablePhotos, setAvailablePhotos] = useState([]);

  // Fetch album metadata
  const fetchAlbumInfo = useCallback(async () => {
    if (!currentUser || !params.id) return;

    try {
      const formData = new FormData();
      formData.append("username", currentUser);

      const response = await fetch(API_ENDPOINTS.listAlbums(), {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const album = data.find(([id]) => id.toString() === params.id.toString());
        if (album) {
          const [albumId, name, coverImageId, startDate] = album;
          setAlbumData({
            id: albumId.toString(),
            title: name,
            coverImageId: coverImageId ? coverImageId.toString() : null,
            startDate: startDate,
          });
          setEditedName(name);
          setEditedDate(startDate || "");
        }
      }
    } catch (error) {
      console.error("Error fetching album info:", error);
    }
  }, [currentUser, params.id]);

  // Fetch album assets
  const fetchAlbumAssets = useCallback(async () => {
    if (!currentUser || !params.id) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        API_ENDPOINTS.getAlbumAssets(currentUser, params.id),
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform API response: [[date, [[id], [id, null, duration], ...]], ...]
      const transformedData = data.map(([date, assets]) => ({
        date: date,
        photos: assets.map(([id, _, duration]) => ({
          id: id.toString(),
          url: `${API_BASE_URL}/api/preview/${currentUser}/${id}`,
          title: `Photo ${id}`,
          isVideo: duration !== null && duration !== undefined,
          duration: duration || null,
        })),
      }));

      setPhotosByDate(transformedData);
    } catch (error) {
      console.error("Error fetching album assets:", error);
      setError("Failed to load album photos. Please try again.");
      setPhotosByDate([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser, params.id]);

  // Load album data on mount
  useEffect(() => {
    fetchAlbumInfo();
    fetchAlbumAssets();
  }, [fetchAlbumInfo, fetchAlbumAssets]);

  const handleDelete = async () => {
    if (!currentUser) return;

    if (!window.confirm("Are you sure you want to delete this album?")) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", currentUser);
      formData.append("album_id", params.id.toString());

      const response = await fetch(API_ENDPOINTS.deleteAlbum(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete album");
      }

      const result = await response.text();
      if (result !== "Album deleted successfully") {
        throw new Error(result);
      }

      router.push("/albums");
    } catch (error) {
      console.error("Error deleting album:", error);
      alert(error.message || "Failed to delete album. Please try again.");
    }
  };

  const handleRename = async () => {
    if (!currentUser || !editedName.trim()) return;

    try {
      const formData = new FormData();
      formData.append("username", currentUser);
      formData.append("album_id", params.id.toString());
      formData.append("name", editedName.trim());

      const response = await fetch(API_ENDPOINTS.renameAlbum(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to rename album");
      }

      const result = await response.text();
      if (result !== "Album renamed successfully") {
        throw new Error(result);
      }

      setIsEditingName(false);
      await fetchAlbumInfo();
    } catch (error) {
      console.error("Error renaming album:", error);
      alert(error.message || "Failed to rename album. Please try again.");
    }
  };

  const handleRedate = async () => {
    if (!currentUser || !editedDate.trim()) return;

    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(editedDate)) {
      alert("Please enter a valid date in YYYY-MM-DD format");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", currentUser);
      formData.append("album_id", params.id.toString());
      formData.append("date", editedDate.trim());

      const response = await fetch(API_ENDPOINTS.redateAlbum(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update album date");
      }

      const result = await response.text();
      if (result !== "Album redated successfully") {
        throw new Error(result);
      }

      setIsEditingDate(false);
      await fetchAlbumInfo();
    } catch (error) {
      console.error("Error updating album date:", error);
      alert(error.message || "Failed to update album date. Please try again.");
    }
  };

  const handleRemoveAssets = async () => {
    if (!currentUser || selectedPhotos.length === 0) return;

    if (!window.confirm(`Remove ${selectedPhotos.length} photo(s) from this album?`)) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", currentUser);
      formData.append("album_id", params.id.toString());
      formData.append("asset_ids", selectedPhotos.join(","));

      const response = await fetch(API_ENDPOINTS.removeAssetsFromAlbum(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to remove photos from album");
      }

      const result = await response.text();
      if (result !== "Photos removed from album successfully") {
        throw new Error(result);
      }

      setSelectedPhotos([]);
      await fetchAlbumAssets();
      await fetchAlbumInfo(); // Refresh album info in case cover changed
    } catch (error) {
      console.error("Error removing assets:", error);
      alert(error.message || "Failed to remove photos. Please try again.");
    }
  };

  const handleAddAssets = async (photoIds) => {
    if (!currentUser || !photoIds || photoIds.length === 0) return;

    try {
      const formData = new FormData();
      formData.append("username", currentUser);
      formData.append("album_id", params.id.toString());
      formData.append("asset_id", photoIds.join(","));

      const response = await fetch(API_ENDPOINTS.addAssetsToAlbum(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add photos to album");
      }

      const result = await response.text();
      if (result !== "Photos added to album successfully") {
        throw new Error(result);
      }

      setShowAddPhotos(false);
      await fetchAlbumAssets();
      await fetchAlbumInfo(); // Refresh album info in case cover changed
    } catch (error) {
      console.error("Error adding assets:", error);
      alert(error.message || "Failed to add photos. Please try again.");
    }
  };

  // Fetch available photos for adding
  useEffect(() => {
    const fetchAvailablePhotos = async () => {
      if (!currentUser || !showAddPhotos) return;

      try {
        const formData = new FormData();
        formData.append("username", currentUser);
        formData.append("page", "0");

        const response = await fetch(API_ENDPOINTS.getPhotosList(), {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const photos = data.flatMap(([date, ids]) =>
            ids.map(([id, _, duration]) => ({
              id: id.toString(),
              url: `${API_BASE_URL}/api/preview/${currentUser}/${id}`,
              title: `Photo ${id}`,
              isVideo: duration !== null && duration !== undefined,
              duration: duration || null,
            }))
          );

          // Filter out photos already in album
          const albumPhotoIds = new Set(
            photosByDate.flatMap((group) => group.photos.map((p) => p.id))
          );
          setAvailablePhotos(
            photos.filter((photo) => !albumPhotoIds.has(photo.id))
          );
        }
      } catch (error) {
        console.error("Error fetching available photos:", error);
      }
    };

    fetchAvailablePhotos();
  }, [currentUser, showAddPhotos, photosByDate]);

  const handleSelectPhoto = (photoId) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const openLightbox = (photo, photos) => {
    const hdPhotos = photos.map((p) => ({
      ...p,
      url: `${API_BASE_URL}/api/asset/${currentUser}/${p.id}`,
    }));
    setLightboxPhotos(hdPhotos);
    const idx = photos.findIndex((p) => p.id === photo.id);
    setLightboxStartIndex(Math.max(0, idx));
    setLightboxOpen(true);
  };

  const totalPhotos = photosByDate.reduce(
    (sum, group) => sum + group.photos.length,
    0
  );

  if (!albumData && !loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Album not found
            </p>
            <Link
              href="/albums"
              className="mt-4 inline-flex items-center gap-2 text-blue-500 hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Albums</span>
            </Link>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <Link
              href="/albums"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 
                hover:text-gray-800 dark:hover:text-gray-200 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Albums</span>
            </Link>

            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-3xl font-bold text-gray-800 dark:text-gray-100 
                        bg-transparent border-b-2 border-blue-500 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRename();
                        } else if (e.key === "Escape") {
                          setIsEditingName(false);
                          setEditedName(albumData?.title || "");
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleRename}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setEditedName(albumData?.title || "");
                      }}
                      className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                      {albumData?.title || "Loading..."}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      title="Rename album"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {isEditingDate ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="date"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                      className="text-sm text-gray-600 dark:text-gray-400 
                        bg-transparent border-b border-blue-500 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRedate();
                        } else if (e.key === "Escape") {
                          setIsEditingDate(false);
                          setEditedDate(albumData?.startDate || "");
                        }
                      }}
                    />
                    <button
                      onClick={handleRedate}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingDate(false);
                        setEditedDate(albumData?.startDate || "");
                      }}
                      className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    {albumData?.startDate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(albumData.startDate).toLocaleDateString()}
                      </p>
                    )}
                    <button
                      onClick={() => setIsEditingDate(true)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      title="Change date"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {totalPhotos} photo{totalPhotos !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex gap-2">
                {selectedPhotos.length > 0 && (
                  <>
                    <button
                      onClick={handleRemoveAssets}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 
                        flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Remove Selected</span>
                    </button>
                    <button
                      onClick={() => setSelectedPhotos([])}
                      className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 
                        flex items-center gap-2"
                    >
                      Clear
                    </button>
                  </>
                )}
                {!showAddPhotos && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedPhotos([]);
                        setShowAddPhotos(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 
                        flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Photos</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 
                        flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Album</span>
                    </button>
                  </>
                )}
                {showAddPhotos && (
                  <button
                    onClick={() => {
                      setSelectedPhotos([]);
                      setShowAddPhotos(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 
                      flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Add Photos Modal */}
          {showAddPhotos && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Add Photos to Album</h2>
              <div className="grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-96 overflow-y-auto mb-4">
                {availablePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => handleSelectPhoto(photo.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer
                      ${
                        selectedPhotos.includes(photo.id)
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 25vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    {selectedPhotos.includes(photo.id) && (
                      <div className="absolute inset-0 bg-blue-500/20" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddPhotos(false);
                    setSelectedPhotos([]);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddAssets(selectedPhotos)}
                  disabled={selectedPhotos.length === 0}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add {selectedPhotos.length > 0 ? `${selectedPhotos.length} ` : ""}Photo
                  {selectedPhotos.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && photosByDate.length === 0 && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading photos...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => fetchAlbumAssets()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          )}

          {/* Photos Grid */}
          {!loading && !showAddPhotos && (
            <div className="space-y-8">
              {photosByDate.map((group) => {
                const datePhotoIds = group.photos.map((photo) => photo.id);
                const dateSelectionCount = datePhotoIds.filter((id) =>
                  selectedPhotos.includes(id)
                ).length;

                return (
                  <DateSection
                    key={group.date}
                    date={group.date}
                    onSelectAll={() => {
                      const allSelected = datePhotoIds.every((id) =>
                        selectedPhotos.includes(id)
                      );
                      if (allSelected) {
                        setSelectedPhotos((prev) =>
                          prev.filter((id) => !datePhotoIds.includes(id))
                        );
                      } else {
                        setSelectedPhotos((prev) => [
                          ...new Set([...prev, ...datePhotoIds]),
                        ]);
                      }
                    }}
                    isAllSelected={datePhotoIds.every((id) =>
                      selectedPhotos.includes(id)
                    )}
                    selectionCount={dateSelectionCount}
                  >
                    <PhotoGrid
                      photos={group.photos}
                      selectedPhotos={selectedPhotos}
                      onSelectPhoto={handleSelectPhoto}
                      isAllSelected={datePhotoIds.every((id) =>
                        selectedPhotos.includes(id)
                      )}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      onOpenPhoto={(photo) => openLightbox(photo, group.photos)}
                    />
                  </DateSection>
                );
              })}

              {photosByDate.length === 0 && !error && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No photos in this album yet. Add some photos!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <Lightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          photos={lightboxPhotos}
          startIndex={lightboxStartIndex}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          currentUser={currentUser}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}