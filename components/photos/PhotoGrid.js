"use client";
import { useState } from "react";
import Image from "next/image";
import { Heart, Download, Share2, Trash2, CheckCircle } from "lucide-react";

export default function PhotoGrid({
  photos,
  selectedPhotos,
  onSelectPhoto,
  isAllSelected,
  favorites,
  onToggleFavorite,
  onOpenPhoto,
}) {
  const [hoveredPhoto, setHoveredPhoto] = useState(null);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-4">
      {photos.map((photo) => {
        const isSelected = selectedPhotos.includes(photo.id);
        const isFavorite = favorites.includes(photo.id);

        return (
          <div
            key={photo.id}
            className="relative group rounded-md sm:rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:shadow-md"
            onMouseEnter={() => setHoveredPhoto(photo.id)}
            onMouseLeave={() => setHoveredPhoto(null)}
          >
            {/* Selection Checkbox */}
            <div
              className={`absolute left-2 top-2 z-20 transition-opacity duration-200
                ${
                  hoveredPhoto === photo.id || isSelected
                    ? "opacity-100"
                    : "opacity-0"
                }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPhoto(photo.id);
                }}
                className={`rounded-full p-1 transition-colors
                  ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "bg-black/50 text-white/75 hover:bg-black/75"
                  }`}
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Favorite Button */}
            <div
              className={`absolute right-2 top-2 z-20 transition-opacity duration-200
                ${
                  hoveredPhoto === photo.id || isFavorite
                    ? "opacity-100"
                    : "opacity-0"
                }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(photo.id);
                }}
                className={`rounded-full p-1.5 transition-colors
                  ${
                    isFavorite
                      ? "bg-red-500 text-white"
                      : "bg-black/50 text-white/75 hover:bg-black/75"
                  }`}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </button>
            </div>

            <div
              className="aspect-square relative cursor-zoom-in"
              onClick={() => onOpenPhoto && onOpenPhoto(photo)}
            >
              <Image
                src={photo.url}
                alt={photo.title || "Photo"}
                fill
                className={`object-cover transition-transform duration-300
                  ${isSelected ? "brightness-75" : "group-hover:scale-105"}`}
                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 33vw, 20vw"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
