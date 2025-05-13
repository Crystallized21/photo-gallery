"use client"

import {useEffect, useState} from "react"
import {ChevronLeft, ChevronRight, X} from "lucide-react"
import Image from "next/image"
import {Button} from "@/components/ui/button"

interface ImageCarouselProps {
  images: {
    id: number
    src: string
    alt: string
    aspectRatio: string
  }[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
}

export function ImageCarousel({images, currentIndex, isOpen, onClose}: ImageCarouselProps) {
  const [index, setIndex] = useState(currentIndex)

  // handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      } else if (e.key === "ArrowRight") {
        setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, images.length, onClose])

  // update index when currentIndex changes
  useEffect(() => {
    setIndex(currentIndex)
  }, [currentIndex])

  if (!isOpen) return null

  const currentImage = images[index]

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClose()
      }}
      tabIndex={0}
      role="button"
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") e.stopPropagation()
        }}
        tabIndex={0}
        role="button"
      >
        {/* the close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6"/>
          <span className="sr-only">Close</span>
        </Button>

        {/* navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 z-50 text-white hover:bg-white/20 h-12 w-12"
          onClick={(e) => {
            e.stopPropagation()
            setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
          }}
        >
          <ChevronLeft className="h-8 w-8"/>
          <span className="sr-only">Previous image</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 z-50 text-white hover:bg-white/20 h-12 w-12"
          onClick={(e) => {
            e.stopPropagation()
            setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
          }}
        >
          <ChevronRight className="h-8 w-8"/>
          <span className="sr-only">Next image</span>
        </Button>

        {/* image */}
        <div className="relative w-full h-full flex items-center justify-center p-8">
          <div className="relative max-w-full max-h-full">
            <Image
              src={currentImage.src || "/placeholder.svg"}
              alt={currentImage.alt}
              width={1200}
              height={800}
              className="max-h-[90vh] w-auto h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  )
}