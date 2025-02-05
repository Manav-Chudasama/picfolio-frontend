"use client";
import MainLayout from "@/components/layout/MainLayout";
import PhotoGrid from "@/components/photos/PhotoGrid";
import PhotoToolbar from "@/components/photos/PhotoToolbar";

// Dummy data for testing
const dummyPhotos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Nature Photo 1",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1529419412599-7bb870e11810?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Nature Photo 2",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Nature Photo 3",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1508349937151-22b68b72d5b1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Nature Photo 4",
  },
  // Add more dummy photos as needed
];

export default function PhotosPage() {
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

        <PhotoToolbar />
        <PhotoGrid photos={dummyPhotos} />
      </div>
    </MainLayout>
  );
}
