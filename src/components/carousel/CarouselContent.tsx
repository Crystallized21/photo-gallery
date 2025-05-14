import type React from "react";
import Image from "next/image";
import {AnimatePresence, motion, type MotionValue} from "motion/react";
import {slideVariants} from "@/animations/carouselAnimations";

interface CarouselContent {
  image: {
    id: string;
    src: {
      thumbnail: string;
      medium: string;
      full: string;
    } | string;
    fullSrc?: string;
    alt: string;
    aspectRatio: string;
  };
  isZoomed: boolean;
  direction: number;
  index: number;
  x: MotionValue<number>;
  y: MotionValue<number>;
  dragConstraints: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  handleDragStart: () => void;
  handleDragEnd: () => void;
  isDragging: boolean;
  toggleZoom: (e: React.MouseEvent) => void;
  onLoadingComplete: () => void;
}

export function CarouselContent({
  image,
  isZoomed,
  direction,
  index,
  x,
  y,
  dragConstraints,
  handleDragStart,
  handleDragEnd,
  isDragging,
  toggleZoom,
  onLoadingComplete,
}: CarouselContent) {
  // Handle both flat and nested src structures
  const getImageSrc = () => {
    if (typeof image.src === 'string') {
      return isZoomed && image.fullSrc ? image.fullSrc : image.src;
    }
      // Use the appropriate quality based on zoom state
      return isZoomed ? image.src.full : image.src.medium;
  };

  return (
    <AnimatePresence>
      <motion.div
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
            toggleZoom(e);
          } else if (!isZoomed) {
            toggleZoom(e);
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
          src={getImageSrc()}
          alt={image.alt}
          width={1200}
          height={800}
          style={{cursor: isZoomed ? "grab" : "zoom-in"}}
          className={`max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain transition-transform duration-300 ${
            isZoomed ? "scale-200" : ""
          } ${
            !isZoomed && image.aspectRatio &&
            Number.parseFloat(image.aspectRatio.split('/')[0]) >
            Number.parseFloat(image.aspectRatio.split('/')[1])
              ? "min-w-[50vw]"
              : ""
          }`}
          priority
          onLoad={onLoadingComplete}
          draggable={false}
        />
      </motion.div>
    </AnimatePresence>
  );
}