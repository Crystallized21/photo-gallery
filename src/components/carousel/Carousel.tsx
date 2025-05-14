"use client"

import {fetchImages} from "@/lib/appwrite";
import React, {useCallback, useEffect, useState} from 'react';
import {CarouselImage} from './CarouselImage'
import {useInView} from 'react-intersection-observer'
import ImageContainer from "@/components/ImageContainer";
import {motion} from "motion/react";
import {Loader2} from "lucide-react";

interface GalleryImage {
  id: string
  fileId: string
  title: string
  description: string
  aspectRatio: string
  src: {
    thumbnail: string
    medium: string
    full: string
  }
  alt: string
  createdAt: string
}

const Carousel = () => {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [carouselOpen, setCarouselOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // limit on how many images to fetch at once
  const LIMIT = 10;

  // set up intersection observer for infinite scroll
  const {ref, inView} = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  // load the initial images
  const loadImages = useCallback(
    async (reset = false) => {
      try {
        setLoading(true)
        const newOffset = reset ? 0 : offset
        const newImages = await fetchImages(LIMIT, newOffset)

        if (newImages.length < LIMIT) {
          setHasMore(false)
        }

        setImages((prev) => (reset ? newImages : [...prev, ...newImages]))
        setOffset((prev) => (reset ? LIMIT : prev + LIMIT))
      } catch (err) {
        setError("Failed to load images. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [offset],
  )

  // load more images when user scrolls to bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadImages()
    }
  }, [inView, hasMore, loading, loadImages])

  // initial load
  useEffect(() => {
    loadImages(true)
  }, [loadImages])

  const openCarousel = (index: number) => {
    setCurrentImageIndex(index)
    setCarouselOpen(true)
  }

  // prepare images for carousel
  const carouselImages = images.map((img) => ({
    id: img.id,
    src: img.src.medium,
    fullSrc: img.src.full,
    alt: img.alt,
    aspectRatio: img.aspectRatio,
    description: img.title,
  }))

  return (
    <div className="w-full">
      <div className="flex flex-wrap w-full px-8 gap-2">
        {images.map((image, index) => (
          <ImageContainer
            key={image.id}
            id={index}
            aspectRatio={image.aspectRatio}
            src={image.src.thumbnail || "/placeholder.svg"}
            alt={image.alt}
            onClick={() => openCarousel(index)}
            index={index}
          />
        ))}
      </div>

      {/* this only displays if theres nothing in my bucket or shit hits the fan */}
      {!loading && images.length === 0 && (
        <div className="w-full text-center py-16">
          <p className="text-xl text-gray-500 dark:text-gray-400">No images found in your bucket</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Upload some images to your Appwrite bucket to get started
          </p>
        </div>
      )}

      {/* loading indicator */}
      {loading && (
        <div className="w-full flex justify-center py-8">
          <motion.div
            animate={{rotate: 360}}
            transition={{duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear"}}
          >
            <Loader2 className="h-8 w-8 text-gray-500 dark:text-gray-400"/>
          </motion.div>
        </div>
      )}

      {error && <div className="w-full text-center py-8 text-red-500">{error}</div>}

      {hasMore && !loading && <div ref={ref} className="w-full h-10"/>}

      {!hasMore && images.length > 0 && (
        <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
          You've reached the end of the gallery
        </div>
      )}

      {/* the actual carousel itself */}
      {images.length > 0 && (
        <CarouselImage
          images={carouselImages}
          currentIndex={currentImageIndex}
          isOpen={carouselOpen}
          onClose={() => setCarouselOpen(false)}
        />
      )}
    </div>
  )
};

export default Carousel;