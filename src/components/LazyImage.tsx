"use client"

import {useEffect, useRef, useState} from "react";
import Image from "next/image";

// lazyimage function with intersection observer for lazy loading
// p.s. if you're reading, you better not have any ulterior motives...
const LazyImage = ({index}: { index: number }) => {
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        // load images 200px before they enter viewport
        rootMargin: "200px",
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
      className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 aspect-square"
    >
      {isInView ? (
        <Image
          src={`/placeholder.svg?height=600&width=600&text=Photo ${index + 1}`}
          alt={`Gallery photo ${index + 1}`}
          className="object-cover hover:scale-105 transition-transform duration-500"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIiAvPjwvc3ZnPg=="
        />
      ) : (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"/>
      )}
    </div>
  )
};

export default LazyImage;