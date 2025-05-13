"use client"

import {useEffect, useRef, useState} from "react";
import Image from "next/image";

interface LazyImageProps {
  id: number
  aspectRatio: string
}

function getFlexBasis(aspectRatio: string): string {
  const [width, height] = aspectRatio.split("/").map(Number)
  const ratio = width / height

  // wide images get more room, tall images get less
  if (ratio >= 2) return "100%" // very wide images
  if (ratio > 1.5) return "65%" // wide images
  if (ratio > 1) return "48%" // slightly wide images
  if (ratio === 1) return "32%" // square images
  if (ratio < 0.6) return "24%" // very tall images
  return "32%" // default for other aspect ratios
}

// lazyimage function with intersection observer for lazy loading
// p.s. if you're reading, you better not have any ulterior motives...
function LazyImage({id, aspectRatio}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)
  const flexBasis = getFlexBasis(aspectRatio)

  // convert aspect ratio string to style
  const [width, height] = aspectRatio.split("/").map(Number)
  const paddingTop = `${(height / width) * 100}%`

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
        flexBasis,
        flexGrow: 1,
        minWidth: "300px",
        // set a maximum width based on aspect ratio but never exceed 1200px
        maxWidth: aspectRatio === "16/9" || aspectRatio === "2/1" ? "min(100%, 1200px)" : "min(800px, 100%)",
      }}
    >
      <div style={{paddingTop}}/>
      {isInView ? (
        <Image
          src={`/placeholder.svg?height=800&width=${Math.round(800 * (width / height))}&text=Photo ${id}`}
          alt={`Gallery photo ${id}`}
          className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

export default LazyImage;