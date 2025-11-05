"use client";

import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useSession } from "@/components/providers/SessionProvider";
import { API_ENDPOINTS, API_BASE_URL } from "@/config/api";

export default function AllPeoplePage() {
  const { currentUser } = useSession();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

      // Transform API response and fetch counts
      const transformedPeople = await Promise.all(
        data.map(async ([faceId, name]) => {
          try {
            const countResponse = await fetch(
              API_ENDPOINTS.getFaceName(currentUser, faceId)
            );
            const [faceName, count] = await countResponse.json();
            return {
              id: faceId.toString(),
              name: faceName,
              avatar: `${API_BASE_URL}/api/face/image/${currentUser}/${faceId}`,
              photoCount: count || 0,
            };
          } catch {
            return {
              id: faceId.toString(),
              name: name,
              avatar: `${API_BASE_URL}/api/face/image/${currentUser}/${faceId}`,
              photoCount: 0,
            };
          }
        })
      );

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

  // Filter people based on search
  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              All People
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Browse all detected faces in your photos
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

          {/* People Grid */}
          {!loading && !error && filteredPeople.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredPeople.map((person) => (
                <Link
                  key={person.id}
                  href={`/explore/people/${person.id}`}
                  className="flex flex-col items-center group"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 transition">
                    <Image
                      src={person.avatar}
                      alt={person.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300 text-center max-w-[128px] truncate">
                    {person.name}
                  </span>
                  {person.photoCount > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {person.photoCount} photos
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filteredPeople.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? `No people found matching "${searchQuery}"`
                  : "No people detected yet. Upload photos with faces to see them here!"}
              </p>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
