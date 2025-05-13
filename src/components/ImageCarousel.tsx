"use client"

import {useEffect, useState} from "react"
import {ChevronLeft, ChevronRight, X} from "lucide-react"
import Image from "next/image"
import {Button} from "@/components/ui/button"
import {AnimatePresence, motion} from "motion/react"

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
  const [index, setIndex] = useState(currentIndex);
  const [direction, setDirection] = useState(0); // 0: none, 1: left, -1: right

  // handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        setDirection(-1);
        setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      } else if (e.key === "ArrowRight") {
        setDirection(1);
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

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDirection(-1)
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDirection(1)
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
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
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: {type: "spring", stiffness: 300, damping: 30},
        opacity: {duration: 0.2},
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: {type: "spring", stiffness: 300, damping: 30},
        opacity: {duration: 0.2},
      },
    }),
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onClose()
          }}
          role="button"
          tabIndex={0}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
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

            {/* navigation buttons */}
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

            {/* image */}
            <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={images[index].id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative max-w-full max-h-full"
                >
                  <Image
                    src={images[index].src || "/placeholder.svg"}
                    alt={images[index].alt}
                    width={1200}
                    height={800}
                    className="max-h-[90vh] w-auto h-auto object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* image counter */}
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.4, duration: 0.3}}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white"
            >
              {index + 1} / {images.length}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}