"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PhotoGrid from "@/components/photos/PhotoGrid";
import PhotoToolbar from "@/components/photos/PhotoToolbar";
import DateSection from "@/components/photos/DateSection";
import { dummyPhotosByDate } from "@/data/photos";
import { v4 as uuidv4 } from "uuid";

export default function PhotosPage() {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Initialize favorites from localStorage after component mounts
  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

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
    const allPhotoIds = dummyPhotosByDate.flatMap((group) =>
      group.photos.map((photo) => photo.id)
    );

    if (selectedPhotos.length === allPhotoIds.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(allPhotoIds);
    }
  };

  const handleToggleFavorite = (photoId) => {
    const newFavorites = favorites.includes(photoId)
      ? favorites.filter((id) => id !== photoId)
      : [...favorites, photoId];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const handleAddSelectedToFavorites = () => {
    const newFavorites = [...new Set([...favorites, ...selectedPhotos])];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setSelectedPhotos([]); // Clear selection after adding to favorites
  };

  // Filter photos based on search query
  const filteredPhotosByDate = dummyPhotosByDate
    .map((group) => ({
      ...group,
      photos: group.photos.filter((photo) =>
        photo.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.photos.length > 0);

  const handleUploadPhotos = async (files) => {
    // Here you would typically upload the files to your server
    // For now, we'll just add them to the dummy data
    const newPhotos = files.map((file) => ({
      id: uuidv4(),
      url: file.preview,
      title: file.name,
    }));

    // Add the new photos to Today's group
    const updatedPhotosByDate = [...dummyPhotosByDate];
    if (updatedPhotosByDate[0].date === "Today") {
      updatedPhotosByDate[0].photos = [
        ...newPhotos,
        ...updatedPhotosByDate[0].photos,
      ];
    } else {
      updatedPhotosByDate.unshift({
        date: "Today",
        photos: newPhotos,
      });
    }

    // In a real app, you would update your backend here
    // For now, we'll just force a re-render
    setSelectedPhotos([]);
  };

  const handleCreateAlbum = ({ title, description, photoIds }) => {
    const newAlbum = {
      id: uuidv4(),
      title,
      description,
      photos: dummyPhotosByDate
        .flatMap((group) => group.photos)
        .filter((photo) => photoIds.includes(photo.id)),
      createdAt: new Date().toISOString(),
    };

    // Get existing albums and add the new one
    const existingAlbums = JSON.parse(localStorage.getItem("albums") || "[]");
    const updatedAlbums = [...existingAlbums, newAlbum];
    localStorage.setItem("albums", JSON.stringify(updatedAlbums));

    // Clear selection after creating album
    setSelectedPhotos([]);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Photos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Browse and manage your photos
          </p>
        </div>

        <PhotoToolbar
          selectedCount={selectedPhotos.length}
          onSelectAll={handleSelectAll}
          isAllSelected={
            selectedPhotos.length ===
            dummyPhotosByDate.flatMap((g) => g.photos).length
          }
          onClearSelection={() => setSelectedPhotos([])}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddToFavorites={handleAddSelectedToFavorites}
          onUploadPhotos={handleUploadPhotos}
          onCreateAlbum={handleCreateAlbum}
          availablePhotos={dummyPhotosByDate.flatMap((group) => group.photos)}
          selectedPhotos={selectedPhotos}
        />

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
        </div>
      </div>
    </MainLayout>
  );
}
