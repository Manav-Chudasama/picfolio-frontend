"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PhotoGrid from "@/components/photos/PhotoGrid";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [album, setAlbum] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const albums = JSON.parse(localStorage.getItem("albums") || "[]");
    const foundAlbum = albums.find((a) => a.id === params.id);
    setAlbum(foundAlbum);

    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, [params.id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      const albums = JSON.parse(localStorage.getItem("albums") || "[]");
      const updatedAlbums = albums.filter((a) => a.id !== params.id);
      localStorage.setItem("albums", JSON.stringify(updatedAlbums));
      router.push("/albums");
    }
  };

  if (!album) {
    return null;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <Link
                href="/albums"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 
                  hover:text-gray-800 dark:hover:text-gray-200 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Albums</span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {album.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {album.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {album.photos.length} photos
              </p>
            </div>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 
                flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Album</span>
            </button>
          </div>
        </div>

        <PhotoGrid
          photos={album.photos}
          selectedPhotos={[]}
          onSelectPhoto={() => {}}
          favorites={favorites}
          onToggleFavorite={() => {}}
        />
      </div>
    </MainLayout>
  );
} 