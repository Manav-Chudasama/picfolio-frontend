"use client";

import { GalleryProvider } from "@/store/GalleryStore";

export default function Providers({ children }) {
  return <GalleryProvider>{children}</GalleryProvider>;
}
