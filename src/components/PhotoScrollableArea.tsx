"use client"

import React, {useState} from 'react';
import {ThemeModeToggle} from "@/components/themes/ThemeModeToggle";
import Carousel from "@/components/carousel/Carousel";

const PhotoScrollableArea = () => {
  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="w-full px-4 py-8">
        <div className="flex justify-end mb-6">
          <ThemeModeToggle/>
        </div>

        <div className="mb-12 text-center max-w-8xl mx-auto md:px-20 px-4">
          <h1 className="text-3xl font-bold mb-6">My Photo Gallery</h1>
          <p className="text-lg leading-relaxed mx-auto">
            If you came from my dev website, welcome. This is me when I have time and go outside to do something else,
            taking a break from the screens.
            <br/>
            If you find this website by any other means e.g. email, social media, or
            word of person, welcome to my gallery.
            <br/>
            <br/>
            Hope you enjoy viewing my photos.
            <br/>
            - Michael Bui
          </p>
        </div>
      </div>

      <Carousel/>
    </div>
  );
};

export default PhotoScrollableArea;
