"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PhotoGrid from "@/components/photos/PhotoGrid";
import DateSection from "@/components/photos/DateSection";
import Lightbox from "@/components/photos/Lightbox";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useSession } from "@/components/providers/SessionProvider";
import { useGallery } from "@/store/GalleryStore";
import { API_ENDPOINTS, API_BASE_URL } from "@/config/api";
import Image from "next/image";

export default function PersonPhotosPage() {
  const params = useParams();
  const faceId = params.id;
  const { currentUser } = useSession();
  const { favorites, toggleFavorite, setUser, syncFavorites } = useGallery();

  const [personName, setPersonName] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [photosByDate, setPhotosByDate] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  // Fetch person details and photos
  const fetchPersonData = useCallback(async () => {
    if (!currentUser || !faceId) return;

    try {
      setLoading(true);
      setError("");

      // Fetch person name and count
      const nameResponse = await fetch(
        API_ENDPOINTS.getFaceName(currentUser, faceId)
      );
      if (nameResponse.ok) {
        const [name, count] = await nameResponse.json();
        setPersonName(name);
        setPhotoCount(count);
      }

      // Fetch person's photos
      const photosResponse = await fetch(
        API_ENDPOINTS.getFaceAssets(currentUser, faceId)
      );

      if (!photosResponse.ok) {
        throw new Error(`HTTP error! status: ${photosResponse.status}`);
      }

      const data = await photosResponse.json();

      // Transform API response
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

      setPhotosByDate(transformedData);
    } catch (error) {
      console.error("Error fetching person data:", error);
      setError("Failed to load photos. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentUser, faceId]);

  // Sync user and load data
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      syncFavorites();
      fetchPersonData();
    }
  }, [currentUser, setUser, syncFavorites, fetchPersonData]);

  const handleSelectPhoto = (photoId) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleToggleFavorite = (photoId) => {
    toggleFavorite(photoId);
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

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Person Header */}
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
              <Image
                src={`${API_BASE_URL}/api/face/image/${currentUser}/${faceId}`}
                alt={personName}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {personName || "Loading..."}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {photoCount} {photoCount === 1 ? "photo" : "photos"}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
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
                onClick={fetchPersonData}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          )}

          {/* Photos Grid */}
          {!loading && !error && (
            <div className="space-y-8">
              {photosByDate.map((group) => (
                <DateSection key={group.date} date={group.date}>
                  <PhotoGrid
                    photos={group.photos}
                    selectedPhotos={selectedPhotos}
                    onSelectPhoto={handleSelectPhoto}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenPhoto={(photo) => openLightbox(photo, group.photos)}
                  />
                </DateSection>
              ))}

              {/* No Photos Message */}
              {photosByDate.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No photos found for this person
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
          onToggleFavorite={handleToggleFavorite}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
