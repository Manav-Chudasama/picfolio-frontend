"use client";

import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PeopleCarousel, { PeopleRow } from "@/components/explore/PeopleCarousel";
import PlacesGrid from "@/components/explore/PlacesGrid";
import { places } from "@/data/explore";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useSession } from "@/components/providers/SessionProvider";
import { API_ENDPOINTS, API_BASE_URL } from "@/config/api";

export default function ExplorePage() {
  const { currentUser } = useSession();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch faces from API
  const fetchFaces = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("username", currentUser);

      const response = await fetch(API_ENDPOINTS.getFacesList(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform API response: [[face_id, name], ...]
      const transformedPeople = data.map(([faceId, name]) => ({
        id: faceId.toString(),
        name: name,
        avatar: `${API_BASE_URL}/api/face/image/${currentUser}/${faceId}`,
        photoCount: 0, // Will be fetched separately if needed
      }));

      setPeople(transformedPeople);
    } catch (error) {
      console.error("Error fetching faces:", error);
      setError("Failed to load people. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load faces on component mount
  useEffect(() => {
    fetchFaces();
  }, [fetchFaces]);

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Explore
            </h1>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading people...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchFaces}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          )}

          {/* People Section */}
          {!loading && !error && (
            <>
              <PeopleCarousel people={people} />
              <PeopleRow people={people} />
            </>
          )}

          {/* No People Message */}
          {!loading && !error && people.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No people detected yet. Upload photos with faces to see them
                here!
              </p>
            </div>
          )}

          {/* Places */}
          <PlacesGrid places={places} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
