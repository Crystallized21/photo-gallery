import type React from "react";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut} from "lucide-react";
import {motion} from "motion/react";
import {buttonAnimations} from "@/animations/carouselAnimations";

interface CarouselControlsProps {
  isZoomed: boolean;
  onClose: () => void;
  toggleZoom: (e: React.MouseEvent) => void;
  handlePrevious: (e: React.MouseEvent) => void;
  handleNext: (e: React.MouseEvent) => void;
}

export function CarouselControls({
  isZoomed,
  onClose,
  toggleZoom,
  handlePrevious,
  handleNext,
}: CarouselControlsProps) {
  return (
    <>
      {/* close button */}
      <motion.div
        initial={buttonAnimations.close.initial}
        animate={buttonAnimations.close.animate}
        transition={buttonAnimations.close.transition}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white cursor-pointer"
          onClick={onClose}
        >
          <X className="h-6 w-6"/>
          <span className="sr-only">Close</span>
        </Button>
      </motion.div>

      {/* zoom button */}
      <motion.div
        initial={buttonAnimations.close.initial}
        animate={buttonAnimations.close.animate}
        transition={buttonAnimations.close.transition}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-16 z-50 text-white cursor-pointer"
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
            initial="initial"
            animate="animate"
            variants={{
              initial: buttonAnimations.prevNext.initial(true),
              animate: buttonAnimations.prevNext.animate
            }}
            transition={buttonAnimations.prevNext.transition}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-50 text-white h-12 w-12 cursor-pointer"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8"/>
              <span className="sr-only">Previous image</span>
            </Button>
          </motion.div>

          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              initial: buttonAnimations.prevNext.initial(false),
              animate: buttonAnimations.prevNext.animate
            }}
            transition={buttonAnimations.prevNext.transition}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-50 text-white h-12 w-12 cursor-pointer"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8"/>
              <span className="sr-only">Next image</span>
            </Button>
          </motion.div>
        </>
      )}
    </>
  );
}