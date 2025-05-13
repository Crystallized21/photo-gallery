"use client"

import {useEffect, useRef, useState} from "react"
import Image from "next/image"
import {ColourExtractor} from "@/components/ColourExtractor";

interface ImageContainerProps {
  id: number
  aspectRatio: string
  src: string
  alt: string
  onClick: () => void
}

// lazyimage function with intersection observer for lazy loading
// p.s. if you're reading, you better not have any ulterior motives...
const ImageContainer = ({id, aspectRatio, src, alt, onClick}: ImageContainerProps) => {
  const [isInView, setIsInView] = useState(false)
  const [dominantColor, setDominantColor] = useState("rgba(0, 0, 0, 0)")
  const [isHovered, setIsHovered] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // convert aspect ratio string to style
  const [width, height] = aspectRatio.split("/").map(Number)
  const paddingTop = `${(height / width) * 100}%`

  // calculate flex basis based on aspect ratio
  const getFlexBasis = () => {
    const ratio = width / height

    // wide images get more space, tall images get less
    if (ratio >= 2) return "50%" // Very wide images
    if (ratio > 1.5) return "32%" // Wide images
    if (ratio > 1) return "24%" // Slightly wide images
    if (ratio === 1) return "20%" // Square images
    if (ratio < 0.6) return "18%" // Very tall images
    return "22%" // Default for other aspect ratios
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "200px", // load images 200px before they enter viewport
        threshold: 0.1,
      },
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.disconnect()
      }
    }
  }, [])

  // handle colour extraction
  const handleColourExtract = (color: string) => {
    setDominantColor(color)
  }

  return (
    <div
      ref={imgRef}
      className="relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300"
      style={{
        flexBasis: getFlexBasis(),
        flexGrow: 1,
        minWidth: "300px",
        maxWidth: "500px",
        boxShadow: isHovered ? `0 0 20px ${dominantColor}` : "none",
        zIndex: isHovered ? 10 : 1,
        transform: isHovered ? "scale(1.02)" : "scale(1)",
      }}
      onClick={onClick}
      onKeyDown={e => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* this div maintains the aspect ratio, please help me */}
      <div style={{paddingTop}}/>

      {isInView ? (
        <>
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIiAvPjwvc3ZnPg=="
          />
          <ColourExtractor src={src} onExtract={handleColourExtract}/>
        </>
      ) : (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"/>
      )}
    </div>
  )
}

export default ImageContainer;