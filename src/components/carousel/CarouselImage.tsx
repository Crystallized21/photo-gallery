"use client"

import type React from "react"
import {useEffect, useRef, useState} from "react"
import {AnimatePresence, motion, useMotionValue} from "motion/react"
import {useImageCarouselNavigation} from "@/hooks/useImageCarouselNavigation"
import {useImageZoom} from "@/hooks/useImageZoom"
import {CarouselControls} from "@/components/carousel/CarouselControls"
import {CarouselContent} from "@/components/carousel/CarouselContent"
import {CarouselOverlays} from "@/components/carousel/CarouselOverlays"
import {overlayVariants} from "@/animations/carouselAnimations"

interface CarouselImageProps {
  images: {
    id: string
    src: string
    fullSrc?: string
    alt: string
    aspectRatio: string
    description?: string
  }[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
}

export function CarouselImage({images, currentIndex, isOpen, onClose}: CarouselImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)

  // motion values for dragging
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // ref for the image container
  const imageContainerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  // custom hook for navigation
  const {index, setIndex, direction, setDirection, next, previous} =
    useImageCarouselNavigation(images, currentIndex)

  // custom hook for zoom functionality
  const {
    isDragging,
    showDragHint,
    dragConstraints,
    toggleZoom,
    handleDragStart,
    handleDragEnd
  } = useImageZoom({
    isZoomed,
    setIsZoomed,
    x,
    y,
    imageContainerRef,
    isLoading
  })

  // handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false)
        } else {
          onClose()
        }
      } else if (e.key === "ArrowLeft" && !isZoomed) {
        previous()
      } else if (e.key === "ArrowRight" && !isZoomed) {
        next()
      } else if (e.key === "z") {
        setIsZoomed(!isZoomed)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, isZoomed, next, previous])

  // update index when currentIndex changes
  useEffect(() => {
    setIndex(currentIndex)
  }, [currentIndex, setIndex])

  // reset the loading state and position when index changes
  useEffect(() => {
    setIsLoading(true)
    x.set(0)
    y.set(0)
  }, [x, y])

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isZoomed) {
      previous();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isZoomed) {
      next();
    }
  };

  // swipe handlers for mobile navigation
  const handleSwipeDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    if (isZoomed) return; // don't navigate when zoomed

    // check if the horizontal swipe distance is significant
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        previous(); // swipe right to go to previous
      } else {
        next(); // swipe left to go to next
      }
    }
  };

  if (!isOpen || images.length === 0) return null

  const currentImage = images[index]

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={() => {
        if (isZoomed && !isDragging) {
          setIsZoomed(false)
        } else if (!isZoomed) {
          onClose()
        }
      }}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
          }
        }}
      >
        {/* control buttons */}
        <CarouselControls
          isZoomed={isZoomed}
          onClose={onClose}
          toggleZoom={toggleZoom}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
        />

        {/* overlays, drag, captions... */}
        <CarouselOverlays
          isLoading={isLoading}
          showDragHint={showDragHint}
          isZoomed={isZoomed}
          currentImage={currentImage}
          index={index}
          totalImages={images.length}
        />

        <div className="w-full h-full flex items-center justify-center p-8">
          <motion.div
            ref={imageContainerRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            drag={!isZoomed ? "x" : false}
            dragConstraints={{left: 0, right: 0}}
            dragElastic={0.2}
            onDragEnd={handleSwipeDragEnd}
          >
            <AnimatePresence>
              <CarouselContent
                key={currentImage.id}
                image={currentImage}
                isZoomed={isZoomed}
                direction={direction}
                index={index}
                x={x}
                y={y}
                dragConstraints={dragConstraints}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                isDragging={isDragging}
                toggleZoom={toggleZoom}
                onLoadingComplete={() => setIsLoading(false)}
              />
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}