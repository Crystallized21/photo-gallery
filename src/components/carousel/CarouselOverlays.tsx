import React from "react";
import {AnimatePresence, motion} from "motion/react";
import {Loader2, Move} from "lucide-react";
import {buttonAnimations, dragHintVariants} from "@/animations/carouselAnimations";
import {T} from "gt-next";


interface CarouselOverlaysProps {
  isLoading: boolean;
  showDragHint: boolean;
  isZoomed: boolean;
  currentImage: {
    description?: string;
  };
  index: number;
  totalImages: number;
}

export function CarouselOverlays({
  isLoading,
  showDragHint,
  isZoomed,
  currentImage,
  index,
  totalImages
}: CarouselOverlaysProps) {
  return (
    <>
      {/* loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{rotate: 360}}
            transition={{duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear"}}>

            <Loader2 className="h-8 w-8 text-white/70"/>
          </motion.div>
        </div>
      )}

      {/* drag hint */}
      <AnimatePresence>
        {showDragHint && isZoomed && (
          <T>
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-4 py-3 rounded-md flex items-center gap-2 z-50"
              variants={dragHintVariants}
              initial="hidden"
              animate="visible"
              exit="exit">

              <Move className="h-5 w-5"/>
              <span>Drag to pan image</span>
            </motion.div>
          </T>
        )}
      </AnimatePresence>

      {/* image caption */}
      {currentImage.description && !isZoomed && (
        <motion.div
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white bg-black/70 px-6 py-3 rounded-md max-w-[80%] z-50"
          initial={buttonAnimations.caption.initial}
          animate={buttonAnimations.caption.animate}
          transition={buttonAnimations.caption.transition}>

          <p className="text-center">{currentImage.description}</p>
        </motion.div>
      )}

      {/* image counter */}
      {!isZoomed && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full"
          initial={buttonAnimations.caption.initial}
          animate={buttonAnimations.caption.animate}
          transition={buttonAnimations.caption.transition}>

          {index + 1} / {totalImages}
        </motion.div>
      )}
    </>
  );
}
