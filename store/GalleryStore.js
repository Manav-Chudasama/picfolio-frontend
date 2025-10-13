"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEYS = {
  favorites: "favorites",
  albums: "albums",
};

const GalleryContext = createContext(null);

export function GalleryProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [albums, setAlbums] = useState([]);

  // Initial load from localStorage
  useEffect(() => {
    try {
      const fav = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || "[]");
      const alb = JSON.parse(localStorage.getItem(STORAGE_KEYS.albums) || "[]");
      setFavorites(Array.isArray(fav) ? fav : []);
      setAlbums(Array.isArray(alb) ? alb : []);
    } catch {
      setFavorites([]);
      setAlbums([]);
    }
  }, []);

  // Persist whenever these change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.albums, JSON.stringify(albums));
    } catch {}
  }, [albums]);

  const toggleFavorite = useCallback((photoId) => {
    setFavorites((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  }, []);

  const addFavorites = useCallback((photoIds) => {
    setFavorites((prev) => Array.from(new Set([...prev, ...photoIds])));
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const addAlbum = useCallback((album) => {
    setAlbums((prev) => [...prev, album]);
  }, []);

  const deleteAlbum = useCallback((albumId) => {
    setAlbums((prev) => prev.filter((a) => a.id !== albumId));
  }, []);

  const updateAlbum = useCallback((albumId, updater) => {
    setAlbums((prev) => prev.map((a) => (a.id === albumId ? { ...a, ...updater(a) } : a)));
  }, []);

  const getAlbumById = useCallback(
    (albumId) => albums.find((a) => a.id === albumId) || null,
    [albums]
  );

  const value = useMemo(
    () => ({
      // state
      favorites,
      albums,
      // favorites api
      toggleFavorite,
      addFavorites,
      clearFavorites,
      // albums api
      addAlbum,
      deleteAlbum,
      updateAlbum,
      getAlbumById,
    }),
    [favorites, albums, toggleFavorite, addFavorites, clearFavorites, addAlbum, deleteAlbum, updateAlbum, getAlbumById]
  );

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
}

export function useGallery() {
  const ctx = useContext(GalleryContext);
  if (!ctx) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return ctx;
}


