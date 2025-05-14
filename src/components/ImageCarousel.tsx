"use client"

import type React from "react"
import {useEffect, useRef, useState} from "react"
import {ChevronLeft, ChevronRight, Loader2, Move, X, ZoomIn, ZoomOut} from "lucide-react"
import Image from "next/image"
import {Button} from "@/components/ui/button"
import {AnimatePresence, motion, useMotionValue} from "motion/react"

interface ImageCarouselProps {
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

export function ImageCarousel({images, currentIndex, isOpen, onClose}: ImageCarouselProps) {
  const [index, setIndex] = useState(currentIndex)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
  const [isZoomed, setIsZoomed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [viewportSize, setViewportSize] = useState({width: 0, height: 0})

  const [isDragging, setIsDragging] = useState(false)
  const [showDragHint, setShowDragHint] = useState(false)

  // motion values for dragging
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // ref for the image container
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // track drag constraints
  const [dragConstraints, setDragConstraints] = useState({top: 0, right: 0, bottom: 0, left: 0})

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
        setDirection(-1)
        setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      } else if (e.key === "ArrowRight" && !isZoomed) {
        setDirection(1)
        setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      } else if (e.key === "z") {
        setIsZoomed(!isZoomed)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, images.length, onClose, isZoomed])

  // update index when currentIndex changes
  useEffect(() => {
    setIndex(currentIndex)
  }, [currentIndex])

  // reset the loading state when index changes
  useEffect(() => {
    setIsLoading(true)
    x.set(0);
    y.set(0);
  }, [x, y])

  // show drag hint when first zooming in
  useEffect(() => {
    if (isZoomed) {
      setShowDragHint(true)
      const timer = setTimeout(() => {
        setShowDragHint(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isZoomed])

  // calculate drag constraints when image is loaded and zoomed
  useEffect(() => {
    if (isZoomed && imageContainerRef.current && !isLoading) {
      const imageEl = imageContainerRef.current.querySelector("img")
      if (imageEl) {
        // get the actual rendered size of the image
        const rect = imageEl.getBoundingClientRect()
        const imageWidth = rect.width
        const imageHeight = rect.height

        // calculate how much the image can be dragged
        // this is based on how much the zoomed image exceeds the viewport
        const xConstraint = Math.max(0, (imageWidth - viewportSize.width) / 2)
        const yConstraint = Math.max(0, (imageHeight - viewportSize.height) / 2)

        setDragConstraints({
          top: -yConstraint,
          right: xConstraint,
          bottom: yConstraint,
          left: -xConstraint,
        })
      }
    }
  }, [isZoomed, isLoading, viewportSize])

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isZoomed) {
      setDirection(-1)
      setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isZoomed) {
      setDirection(1)
      setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
  }

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation()
    // reset posistion when zooming out
    if (isZoomed) {
      x.set(0)
      y.set(0)
    }
    setIsZoomed(!isZoomed)
  }

  // handle drag start
  const handleDragStart = () => {
    if (isZoomed) {
      setIsDragging(true)
    }
  }

  // handle drag end
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // animation variants
  const overlayVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {duration: 0.3},
    },
    exit: {
      opacity: 0,
      transition: {duration: 0.3},
    },
  }

  const slideVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      scale: 0.9,
      x: direction > 0 ? "100%" : "-100%",
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        opacity: {duration: 0.3},
        scale: {duration: 0.3},
        x: {type: "spring", stiffness: 300, damping: 30},
      },
    },
    exit: (direction: number) => ({
      opacity: 0,
      scale: 0.9,
      x: direction < 0 ? "100%" : "-100%",
      transition: {
        opacity: {duration: 0.3},
        scale: {duration: 0.3},
        x: {type: "spring", stiffness: 300, damping: 30},
      },
    }),
  }

  // drag hint animation
  const dragHintVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {duration: 0.3},
    },
    exit: {
      opacity: 0,
      transition: {duration: 0.5},
    },
  }

  if (!isOpen || images.length === 0) return null

  const currentImage = images[index]

  return (
    <AnimatePresence>
      {isOpen && (
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
            {/* close button */}
            <motion.div
              initial={{opacity: 0, y: -20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.2, duration: 0.3}}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                onClick={onClose}
              >
                <X className="h-6 w-6"/>
                <span className="sr-only">Close</span>
              </Button>
            </motion.div>

            {/* zoom button */}
            <motion.div
              initial={{opacity: 0, y: -20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.2, duration: 0.3}}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-16 z-50 text-white hover:bg-white/20"
                onClick={toggleZoom}
              >
                {isZoomed ? <ZoomOut className="h-6 w-6"/> : <ZoomIn className="h-6 w-6"/>}
                <span className="sr-only">{isZoomed ? "Zoom out" : "Zoom in"}</span>
              </Button>
            </motion.div>

            {/* navigation buttons only show when not zoomed */}
            {!isZoomed && (
              <>
                <motion.div
                  initial={{opacity: 0, x: -20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: 0.3, duration: 0.3}}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 z-50 text-white hover:bg-white/20 h-12 w-12"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-8 w-8"/>
                    <span className="sr-only">Previous image</span>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{opacity: 0, x: 20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: 0.3, duration: 0.3}}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 z-50 text-white hover:bg-white/20 h-12 w-12"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-8 w-8"/>
                    <span className="sr-only">Next image</span>
                  </Button>
                </motion.div>
              </>
            )}

            {/* loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{rotate: 360}}
                  transition={{duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear"}}
                >
                  <Loader2 className="h-8 w-8 text-white/70"/>
                </motion.div>
              </div>
            )}

            {/* drag hint - only show when first zoomed in */}
            <AnimatePresence>
              {showDragHint && isZoomed && (
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-4 py-3 rounded-md flex items-center gap-2 z-50"
                  variants={dragHintVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Move className="h-5 w-5"/>
                  <span>Drag to pan image</span>
                </motion.div>
              )}
            </AnimatePresence>


            <div className="w-full h-full flex items-center justify-center p-8">
              <div
                ref={imageContainerRef}
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
              >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex items-center justify-center"
                    style={{
                      position: "absolute",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      cursor: isZoomed ? "grab" : "zoom-in",
                      x, y
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isZoomed && !isDragging) {
                        x.set(0);
                        y.set(0);
                        setIsZoomed(false); // zoom out when clicked while zoomed in
                      } else if (!isZoomed) {
                        toggleZoom(e); // use existing zoom in function
                      }
                    }}
                    drag={isZoomed}
                    dragConstraints={dragConstraints}
                    dragElastic={0.1}
                    dragMomentum={false}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <Image
                      src={isZoomed && currentImage.fullSrc ? currentImage.fullSrc : currentImage.src}
                      alt={currentImage.alt}
                      width={1200}
                      height={800}
                      style={{cursor: isZoomed ? "grab" : "zoom-in",}}
                      className={`max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain transition-transform duration-300 ${
                        isZoomed ? "scale-200" : ""
                      } ${
                        // hacky way to handle aspect ratio of landscape images
                        !isZoomed && currentImage.aspectRatio &&
                        Number.parseFloat(currentImage.aspectRatio.split('/')[0]) >
                        Number.parseFloat(currentImage.aspectRatio.split('/')[1])
                          ? "min-w-[50vw]"
                          : ""
                      }`}
                      priority
                      onLoad={() => setIsLoading(false)}
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* image caption */}
            {currentImage.description && !isZoomed && (
              <motion.div
                className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white bg-black/70 px-6 py-3 rounded-md max-w-[80%]"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.4, duration: 0.3}}
              >
                <p className="text-center">{currentImage.description}</p>
              </motion.div>
            )}

            {/* image counter */}
            {!isZoomed && (
              <motion.div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.4, duration: 0.3}}
              >
                {index + 1} / {images.length}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
