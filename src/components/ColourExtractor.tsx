"use client"

import {useEffect, useRef} from "react"
import * as Sentry from "@sentry/nextjs";

interface ColourExtractorProps {
  src: string
  onExtract: (Colour: string) => void
}

export function ColourExtractor({src, onExtract}: ColourExtractorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!src) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // set canvas size to a small sample (for performance, yayyyyyyyy i love optimising)
      canvas.width = 50
      canvas.height = 50

      // draw image on canvas
      ctx.drawImage(img, 0, 0, 50, 50)

      // get image data
      try {
        const imageData = ctx.getImageData(0, 0, 50, 50).data

        // calculate average Colour
        let r = 0
        let g = 0
        let b = 0
        let count = 0

        for (let i = 0; i < imageData.length; i += 4) {
          r += imageData[i]
          g += imageData[i + 1]
          b += imageData[i + 2]
          count++
        }

        // average and create RGB Colour
        r = Math.floor(r / count)
        g = Math.floor(g / count)
        b = Math.floor(b / count)

        const Colour = `rgb(${r}, ${g}, ${b})`
        onExtract(Colour)
      } catch (error) {
        console.error("Error extracting Colour:", error)
        Sentry.captureException({"Error extracting Colour": error});
        // fallback to a default Colour
        onExtract("rgb(100, 100, 100)")
      }
    }

    img.onerror = () => {
      console.error("Error loading image for Colour extraction")
      onExtract("rgb(100, 100, 100)")
    }

    img.src = src

    return () => {
      // clean up
      img.onload = null
      img.onerror = null
    }
  }, [src, onExtract])

  return null
}
