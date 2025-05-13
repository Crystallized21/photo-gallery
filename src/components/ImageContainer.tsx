"use client"

import {useEffect, useRef, useState} from "react"
import Image from "next/image"

interface ImageContainerProps {
  id: number
  aspectRatio: string
  src: string
  alt: string
}

// lazyimage function with intersection observer for lazy loading
// p.s. if you're reading, you better not have any ulterior motives...
const ImageContainer = ({id, aspectRatio, src, alt}: ImageContainerProps) => {
  const [isInView, setIsInView] = useState(false)
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

  return (
    <div
      ref={imgRef}
      className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
      style={{
        flexBasis: getFlexBasis(),
        flexGrow: 1,
        minWidth: "300px",
        // fixed maximum width constraint regardless of original image dimensions
        maxWidth: "500px",
      }}
    >
      {/* this div maintains the aspect ratio, please help me */}
      <div style={{paddingTop}}/>

      {isInView ? (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIiAvPjwvc3ZnPg=="
        />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"/>
      )}
    </div>
  )
}

export default ImageContainer;