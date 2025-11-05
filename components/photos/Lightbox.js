"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Heart, Download, Info } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";

export default function Lightbox({
  isOpen,
  onClose,
  photos = [],
  startIndex = 0,
  onToggleFavorite,
  favorites = [],
  currentUser,
}) {
  const [index, setIndex] = useState(startIndex);
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIndex(startIndex);
      setShowDetails(false);
      setDetails(null);
    }
  }, [isOpen, startIndex]);

  const fetchPhotoDetails = useCallback(async () => {
    if (!currentUser || !photos[index]) return;

    try {
      setLoadingDetails(true);
      const response = await fetch(
        API_ENDPOINTS.getAssetDetails(currentUser, photos[index].id)
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error("Error fetching photo details:", error);
      setDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  }, [currentUser, photos, index]);

  // Fetch details when photo changes and details panel is open
  useEffect(() => {
    if (showDetails && currentUser && photos[index]) {
      fetchPhotoDetails();
    }
  }, [index, showDetails, currentUser, photos, fetchPhotoDetails]);

  const handleDetailsClick = () => {
    if (!showDetails) {
      setShowDetails(true);
      if (!details) {
        fetchPhotoDetails();
      }
    } else {
      setShowDetails(false);
    }
  };

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
                onClick={handleDetailsClick}
                className={`p-2 rounded bg-white/10 hover:bg-white/20 ${
                  showDetails ? "bg-white/20" : ""
                }`}
                aria-label="Details"
              >
                <Info className="w-5 h-5" />
              </button>
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

          <div className="flex-1 relative select-none flex">
            <div className={`flex-1 ${showDetails ? "mr-80" : ""} transition-all duration-300`}>
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

            {/* Details Panel */}
            {showDetails && (
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/95 text-white overflow-y-auto">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Photo Details</h2>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="p-1 rounded hover:bg-white/10"
                      aria-label="Close Details"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {loadingDetails ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  ) : details ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Name</label>
                        <p className="text-white mt-1">{details.name || "N/A"}</p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Tags</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {details.tags && details.tags.length > 0 ? (
                            details.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-white/10 rounded text-sm"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">No tags</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Date</label>
                        <p className="text-white mt-1">{details.date || "N/A"}</p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Time</label>
                        <p className="text-white mt-1">{details.time || "N/A"}</p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Format</label>
                        <p className="text-white mt-1 uppercase">{details.format || "N/A"}</p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Compressed</label>
                        <p className="text-white mt-1">
                          {details.compress ? "Yes" : "No"}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Resolution</label>
                        <p className="text-white mt-1">{details.mp || "N/A"}</p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Dimensions</label>
                        <p className="text-white mt-1">
                          {details.width && details.height
                            ? `${details.width} × ${details.height}`
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">File Size</label>
                        <p className="text-white mt-1">{details.size || "N/A"}</p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Faces</label>
                        <div className="mt-1 space-y-1">
                          {details.faces && details.faces.length > 0 ? (
                            details.faces.map((face, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-white bg-white/10 px-2 py-1 rounded"
                              >
                                {face[1]} {face[0] ? `(ID: ${face[0]})` : ""}
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500">No faces detected</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Location</label>
                        <p className="text-white mt-1">
                          {details.location || "No location data"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      Failed to load details
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
