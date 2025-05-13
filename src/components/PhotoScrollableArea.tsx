import React from 'react';
import ImageContainer from "@/components/ImageContainer";
import {ThemeModeToggle} from "@/components/ThemeModeToggle";

// sample image data with different aspect ratios
const galleryImages = [
  {
    id: 1,
    aspectRatio: "4/3",
    src: "/placeholder.svg?height=800&width=1067&text=Photo 1",
    alt: "Gallery photo 1",
  },
  {
    id: 2,
    aspectRatio: "1/1",
    src: "/placeholder.svg?height=800&width=800&text=Photo 2",
    alt: "Gallery photo 2",
  },
  {
    id: 3,
    aspectRatio: "3/4",
    src: "/placeholder.svg?height=800&width=600&text=Photo 3",
    alt: "Gallery photo 3",
  },
  {
    id: 4,
    aspectRatio: "16/9",
    src: "/placeholder.svg?height=800&width=1422&text=Photo 4 (16:9)",
    alt: "Gallery photo 4",
  },
  {
    id: 5,
    aspectRatio: "9/16",
    src: "/placeholder.svg?height=800&width=450&text=Photo 5",
    alt: "Gallery photo 5",
  },
  {
    id: 6,
    aspectRatio: "2/1",
    src: "/placeholder.svg?height=800&width=1600&text=Photo 6 (Panorama)",
    alt: "Gallery photo 6",
  },
  {
    id: 7,
    aspectRatio: "1/2",
    src: "/placeholder.svg?height=800&width=400&text=Photo 7",
    alt: "Gallery photo 7",
  },
  {
    id: 8,
    aspectRatio: "2/1",
    src: "/placeholder.svg?height=800&width=1600&text=Large Image (7200x3600)",
    alt: "Large panoramic photo",
  },
  {
    id: 9,
    aspectRatio: "2/3",
    src: "/placeholder.svg?height=800&width=533&text=Photo 9",
    alt: "Gallery photo 9",
  },
  {
    id: 10,
    aspectRatio: "4/3",
    src: "/placeholder.svg?height=800&width=1067&text=Photo 10",
    alt: "Gallery photo 10",
  },
  {
    id: 11,
    aspectRatio: "1/1",
    src: "/placeholder.svg?height=800&width=800&text=Photo 11",
    alt: "Gallery photo 11",
  },
  {
    id: 12,
    aspectRatio: "4/3",
    src: "/placeholder.svg?height=800&width=1067&text=Photo 12",
    alt: "Gallery photo 12",
  },
  {
    id: 13,
    aspectRatio: "3/2",
    src: "/placeholder.svg?height=800&width=1200&text=Photo 13",
    alt: "Gallery photo 13",
  },
  {
    id: 14,
    aspectRatio: "1/1",
    src: "/placeholder.svg?height=800&width=800&text=Photo 14",
    alt: "Gallery photo 14",
  },
  {
    id: 15,
    aspectRatio: "4/3",
    src: "/placeholder.svg?height=800&width=1067&text=Photo 15",
    alt: "Gallery photo 15",
  },
  {
    id: 16,
    aspectRatio: "3/4",
    src: "/placeholder.svg?height=800&width=600&text=Photo 16",
    alt: "Gallery photo 16",
  },
]

const PhotoScrollableArea = () => {
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

        <div className="flex flex-wrap gap-4 w-full justify-center">
          {galleryImages.map((image) => (
            <ImageContainer
              key={image.id}
              id={image.id}
              aspectRatio={image.aspectRatio}
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
            />
          ))}
        </div>
      </div>
    </div>
  )
};

export default PhotoScrollableArea;