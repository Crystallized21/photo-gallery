"use client"

import {useEffect, useState} from "react"
import Image from "next/image"
import {fetchImages} from "@/lib/appwrite"

export default function FOHCarousel() {
  const [images, setImages] = useState<Array<{
    id: string;
    title: string;
    src: { thumbnail: string; full: string };
    alt: string;
  }>>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // fetch images from Appwrite
  useEffect(() => {
    const getImages = async () => {
      try {
        setIsLoading(true)
        // Fetch all images from the bucket
        const allImages = await fetchImages(100, 0)

        // select 3 random images
        let randomImages = []
        if (allImages.length <= 3) {
          // if 3 or fewer images total, use all of them
          randomImages = allImages
        } else {
          // select 3 random images without duplicates
          const selectedIndices = new Set<number>()
          while (selectedIndices.size < 3) {
            const randomIndex = Math.floor(Math.random() * allImages.length)
            selectedIndices.add(randomIndex)
          }

          randomImages = Array.from(selectedIndices).map(index => allImages[index])
        }

        setImages(randomImages)
        setIsLoading(false)
      } catch (err) {
        console.error("Failed to fetch images:", err)
        setError("Failed to load gallery images")
        setIsLoading(false)
      }
    }

    getImages()
  }, [])

  // Image rotation logic
  useEffect(() => {
    if (images.length === 0) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }, 5000) // change image every 5 seconds

    return () => clearInterval(interval)
  }, [images.length])

  if (isLoading) {
    return (
      <div className="relative h-screen w-full flex flex-col items-center justify-center bg-black">
        <div className="mb-4 h-12 w-12 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin"/>
        <p className="text-xl">Loading</p>
      </div>
    )
  }

  if (error || images.length === 0) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-500">{error || "No images available"}</p>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.src.full}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
            quality={90}
          />
        </div>
      ))}

      {/* darker overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30"/>

      {/* Welcome text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-light text-white drop-shadow-lg">
          Welcome to my outside life.
        </h1>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-white drop-shadow-lg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-label="Scroll down indicator"
          role="img"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  )
}