"use client"

import React, {useState} from 'react';
import {ThemeModeToggle} from "@/components/ThemeModeToggle";
import AppwriteCarousel from "@/components/AppwriteCarousel";

const PhotoScrollableArea = () => {
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openCarousel = (index: number) => {
    setCurrentImageIndex(index);
    setCarouselOpen(true);
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="w-full px-4 py-8">
        <div className="flex justify-end mb-6">
          <ThemeModeToggle/>
        </div>

        <div className="mb-12 text-center px-20">
          <h1 className="text-3xl font-bold mb-6">My Photo Gallery</h1>
          <p className="text-lg leading-relaxed">
            If you came from my dev website, welcome. This is me when I have time and go outside to do something else,
            taking a break from the screens.
            <br/>
            If you find this website by any other means e.g. email, social media, or
            word of person, welcome to my gallery.
            <br/>
            <br/>
            Hope you enjoy viewing my photos.
          </p>
        </div>
      </div>

      <AppwriteCarousel/>
    </div>
  );
};

export default PhotoScrollableArea;