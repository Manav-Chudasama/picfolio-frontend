"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Heart, Download } from "lucide-react";

export default function Lightbox({
  isOpen,
  onClose,
  photos = [],
  startIndex = 0,
  onToggleFavorite,
  favorites = [],
}) {
  const [index, setIndex] = useState(startIndex);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) setIndex(startIndex);
  }, [isOpen, startIndex]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setIndex((i) => Math.min(i + 1, photos.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, photos.length]);

  if (!isOpen || photos.length === 0) return null;
  const photo = photos[index];
  const isFav = favorites.includes(photo.id);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        ref={containerRef}
      >
        <Dialog.Panel className="w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-3 text-white">
            <div className="text-sm opacity-75">{photo.title}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(photo.id)}
                className={`p-2 rounded bg-white/10 hover:bg-white/20 ${
                  isFav ? "text-red-400" : "text-white"
                }`}
                aria-label="Favorite"
              >
                <Heart
                  className="w-5 h-5"
                  fill={isFav ? "currentColor" : "none"}
                />
              </button>
              <button
                className="p-2 rounded bg-white/10 hover:bg-white/20"
                aria-label="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded bg-white/10 hover:bg-white/20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative select-none">
            <img
              src={photo.url}
              alt={photo.title || "Photo"}
              className="max-h-full max-w-full m-auto object-contain"
              draggable={false}
            />

            {/* Navigation */}
            {index > 0 && (
              <button
                onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded bg-white/10 hover:bg-white/20 text-white"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {index < photos.length - 1 && (
              <button
                onClick={() =>
                  setIndex((i) => Math.min(i + 1, photos.length - 1))
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded bg-white/10 hover:bg-white/20 text-white"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
