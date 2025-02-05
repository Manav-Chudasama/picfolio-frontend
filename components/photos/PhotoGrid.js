'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Heart, Download, Share2, Trash2 } from 'lucide-react';

export default function PhotoGrid({ photos }) {
  const [hoveredPhoto, setHoveredPhoto] = useState(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative group rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md"
          onMouseEnter={() => setHoveredPhoto(photo.id)}
          onMouseLeave={() => setHoveredPhoto(null)}
        >
          <div className="aspect-square relative">
            <Image
              src={photo.url}
              alt={photo.title || 'Photo'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
          
          {/* Overlay with actions - Always visible on mobile, hover on desktop */}
          <div className={`absolute inset-0 bg-black/50 flex flex-col justify-between p-4
            sm:transition-opacity sm:duration-200
            ${hoveredPhoto === photo.id ? 'opacity-100' : 'sm:opacity-0 opacity-100'}`}>
            <div className="flex justify-end space-x-2">
              <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-medium truncate">{photo.title}</h3>
              <div className="flex justify-between">
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-red-500/60 hover:bg-red-500/80 text-white">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 