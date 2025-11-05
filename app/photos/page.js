"use client";
import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PhotoGrid from "@/components/photos/PhotoGrid";
import PhotoToolbar from "@/components/photos/PhotoToolbar";
import DateSection from "@/components/photos/DateSection";
import { dummyPhotosByDate } from "@/data/photos";
import { v4 as uuidv4 } from "uuid";
import { useGallery } from "@/store/GalleryStore";
import Lightbox from "@/components/photos/Lightbox";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useSession } from "@/components/providers/SessionProvider";
import { API_ENDPOINTS, API_BASE_URL } from "@/config/api";

export default function PhotosPage() {
  const { currentUser, logout } = useSession();
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { favorites, toggleFavorite, addFavorites, addAlbum } = useGallery();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
  const [visibleGroups, setVisibleGroups] = useState(2);

  // Real data from API
  const [photosByDate, setPhotosByDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch photos from API
  const fetchPhotos = useCallback(
    async (page = 0) => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("username", currentUser);
        formData.append("page", page.toString());

        const response = await fetch(API_ENDPOINTS.getPhotosList(), {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform API response to match our component structure
        const transformedData = data.map(([date, ids]) => ({
          date: date,
          photos: ids.map(([id, _, duration]) => ({
            id: id.toString(),
            url: `${API_BASE_URL}/api/preview/${currentUser}/${id}`,
            title: `Photo ${id}`,
            isVideo: duration !== null && duration !== undefined,
            duration: duration || null,
          })),
        }));

        if (page === 0) {
          setPhotosByDate(transformedData);
        } else {
          setPhotosByDate((prev) => [...prev, ...transformedData]);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        setError("Failed to load photos. Please try again.");
        // Fallback to dummy data if API fails
        setPhotosByDate(dummyPhotosByDate);
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Load photos on component mount
  useEffect(() => {
    fetchPhotos(0);
  }, [fetchPhotos]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchPhotos(nextPage);
  };

  const handleSelectPhoto = (photoId) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleSelectAllInDate = (datePhotos) => {
    const datePhotoIds = datePhotos.map((photo) => photo.id);
    const allSelected = datePhotoIds.every((id) => selectedPhotos.includes(id));

    if (allSelected) {
      setSelectedPhotos((prev) =>
        prev.filter((id) => !datePhotoIds.includes(id))
      );
    } else {
      setSelectedPhotos((prev) => [...new Set([...prev, ...datePhotoIds])]);
    }
  };

  const handleSelectAll = () => {
    const allPhotoIds = photosByDate.flatMap((group) =>
      group.photos.map((photo) => photo.id)
    );

    if (selectedPhotos.length === allPhotoIds.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(allPhotoIds);
    }
  };

  const handleToggleFavorite = (photoId) => {
    toggleFavorite(photoId);
  };

  const handleAddSelectedToFavorites = () => {
    addFavorites(selectedPhotos);
    setSelectedPhotos([]);
  };

  // Filter photos based on search query
  const filteredPhotosByDate = photosByDate
    .map((group) => ({
      ...group,
      photos: group.photos.filter((photo) =>
        photo.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.photos.length > 0);

  const handleUploadPhotos = async (files) => {
    // After successful upload, refresh the photos list
    setCurrentPage(0);
    await fetchPhotos(0);
    setSelectedPhotos([]);
  };

  const handleCreateAlbum = ({ title, description, photoIds }) => {
    const newAlbum = {
      id: uuidv4(),
      title,
      description,
      photos: photosByDate
        .flatMap((group) => group.photos)
        .filter((photo) => photoIds.includes(photo.id)),
      createdAt: new Date().toISOString(),
    };

    addAlbum(newAlbum);
    setSelectedPhotos([]);
  };

  const openLightbox = (photo, photos) => {
    // Create high-definition versions for lightbox
    const hdPhotos = photos.map((p) => ({
      ...p,
      url: `${API_BASE_URL}/api/asset/${currentUser}/${p.id}`,
    }));
    setLightboxPhotos(hdPhotos);
    const idx = photos.findIndex((p) => p.id === photo.id);
    setLightboxStartIndex(Math.max(0, idx));
    setLightboxOpen(true);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Photos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, {currentUser}!
            </p>
          </div>

          <PhotoToolbar
            selectedCount={selectedPhotos.length}
            onSelectAll={handleSelectAll}
            isAllSelected={
              selectedPhotos.length ===
              photosByDate.flatMap((g) => g.photos).length
            }
            onClearSelection={() => setSelectedPhotos([])}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddToFavorites={handleAddSelectedToFavorites}
            onUploadPhotos={handleUploadPhotos}
            onCreateAlbum={handleCreateAlbum}
            availablePhotos={photosByDate.flatMap((group) => group.photos)}
            selectedPhotos={selectedPhotos}
          />

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
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => fetchPhotos(0)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          )}

          <div className="space-y-8">
            {filteredPhotosByDate.map((group) => {
              const datePhotoIds = group.photos.map((photo) => photo.id);
              const dateSelectionCount = datePhotoIds.filter((id) =>
                selectedPhotos.includes(id)
              ).length;

              return (
                <DateSection
                  key={group.date}
                  date={group.date}
                  onSelectAll={() => handleSelectAllInDate(group.photos)}
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
                    onToggleFavorite={handleToggleFavorite}
                    onOpenPhoto={(photo) => openLightbox(photo, group.photos)}
                  />
                </DateSection>
              );
            })}

            {/* No Results Message */}
            {filteredPhotosByDate.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No photos found matching {`"${searchQuery}"`}
                </p>
              </div>
            )}

            {!loading && photosByDate.length > 0 && (
              <div className="flex justify-center py-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </div>
        </div>

        <Lightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          photos={lightboxPhotos}
          startIndex={lightboxStartIndex}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
