"use client";
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PhotoGrid from "@/components/photos/PhotoGrid";
import PhotoToolbar from "@/components/photos/PhotoToolbar";
import { dummyPhotosByDate } from "@/data/photos"; // We'll need to move the data to a separate file
import { useGallery } from "@/store/GalleryStore";

export default function FavoritesPage() {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { favorites, toggleFavorite, addFavorites } = useGallery();

  // Get all photos from dummyPhotosByDate that are in favorites
  const favoritePhotos = dummyPhotosByDate
    .flatMap((group) => group.photos)
    .filter((photo) => favorites.includes(photo.id));

  // Filter favorite photos based on search
  const filteredPhotos = favoritePhotos.filter((photo) =>
    photo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleAddSelectedToFavorites = () => {
    addFavorites(selectedPhotos);
    setSelectedPhotos([]);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Browse your favorite photos
          </p>
        </div>

        <PhotoToolbar
          selectedCount={selectedPhotos.length}
          onClearSelection={() => setSelectedPhotos([])}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddToFavorites={handleAddSelectedToFavorites}
        />

        {filteredPhotos.length > 0 ? (
          <PhotoGrid
            photos={filteredPhotos}
            selectedPhotos={selectedPhotos}
            onSelectPhoto={handleSelectPhoto}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? `No favorites found matching "${searchQuery}"`
                : "No favorite photos yet"}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
