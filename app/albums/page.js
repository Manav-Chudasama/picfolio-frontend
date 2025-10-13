"use client";
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AlbumCard from "@/components/albums/AlbumCard";
import CreateAlbumModal from "@/components/albums/CreateAlbumModal";
import { Plus } from "lucide-react";
import { dummyPhotosByDate } from "@/data/photos";
import { v4 as uuidv4 } from "uuid";
import { useGallery } from "@/store/GalleryStore";

export default function AlbumsPage() {
  const { albums, addAlbum, deleteAlbum } = useGallery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

    addAlbum(newAlbum);
  };

  const handleDeleteAlbum = (albumId) => {
    deleteAlbum(albumId);
  };

  // Get all available photos
  const availablePhotos = dummyPhotosByDate.flatMap((group) => group.photos);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Albums
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Organize your photos into collections
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 
              flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-nowrap hidden sm:block">Create Album</span>
          </button>
        </div>

        {albums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onDelete={handleDeleteAlbum}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No albums yet. Create your first album!
            </p>
          </div>
        )}

        <CreateAlbumModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateAlbum={handleCreateAlbum}
          availablePhotos={availablePhotos}
        />
      </div>
    </MainLayout>
  );
}
