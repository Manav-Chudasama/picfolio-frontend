"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import Image from "next/image";

export default function CreateAlbumModal({
  isOpen,
  onClose,
  onCreateAlbum,
  availablePhotos = [],
  preselectedPhotos = [],
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  // Reset form and update selections when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Only update selected photos if they're different from current selection
      if (
        JSON.stringify(selectedPhotos) !== JSON.stringify(preselectedPhotos)
      ) {
        setSelectedPhotos(preselectedPhotos);
      }
    } else {
      // Reset form when modal closes
      setTitle("");
      setDescription("");
      setSelectedPhotos([]);
    }
  }, [isOpen]); // Only depend on isOpen, not preselectedPhotos

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateAlbum({
      title,
      description,
      photoIds: selectedPhotos,
    });
    setTitle("");
    setDescription("");
    setSelectedPhotos([]);
    router.push("/albums");
    onClose();
  };

  const togglePhotoSelection = (photoId) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Create New Album
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Album Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 
                  dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter album title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 
                  dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter album description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Photos ({selectedPhotos.length} selected)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto p-1">
                {Array.isArray(availablePhotos) && availablePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => togglePhotoSelection(photo.id)}
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
                    />
                    {selectedPhotos.includes(photo.id) && (
                      <div className="absolute inset-0 bg-blue-500/20" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                  hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title || selectedPhotos.length === 0}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Album
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
