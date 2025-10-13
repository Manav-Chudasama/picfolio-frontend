"use client";

import MainLayout from "@/components/layout/MainLayout";
import PeopleCarousel, { PeopleRow } from "@/components/explore/PeopleCarousel";
import PlacesGrid from "@/components/explore/PlacesGrid";
import { people, places } from "@/data/explore";

export default function ExplorePage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Explore
          </h1>
        </div>

        {/* People */}
        <PeopleCarousel people={people} />
        <PeopleRow people={people} />

        {/* Places */}
        <PlacesGrid places={places} />
      </div>
    </MainLayout>
  );
}
