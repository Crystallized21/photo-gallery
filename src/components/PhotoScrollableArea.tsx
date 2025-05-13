import React from 'react';
import {ThemeModeToggle} from "@/components/ThemeModeToggle";
import LazyImage from "@/components/LazyImage";

const PhotoScrollableArea = () => {
  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <ThemeModeToggle/>
        </div>

        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-3xl font-bold mb-6">My Photo Gallery</h1>
          <p className="text-lg leading-relaxed">
            If you came from my dev website, welcome. This is me when I have time and go outside to do something else,
            taking a break from the screens. If you find this website by any other means e.g. email, social media, or
            word of person, welcome to my gallery. Hope you enjoy viewing my photos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {Array.from({length: 12}).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: i dont have weblinks for now, will be added soon
            <LazyImage key={i} index={i}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoScrollableArea;