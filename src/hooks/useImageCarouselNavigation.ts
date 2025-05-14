import {useCallback, useState} from "react";

interface CarouselImage {
  id: string
  src: string
  fullSrc?: string
  alt: string
  aspectRatio: string
  description?: string
}

export function useImageCarouselNavigation(images: CarouselImage[], initialIndex = 0) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1); // Direction is 1 for next
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const previous = useCallback(() => {
    setDirection(-1); // Direction is -1 for previous
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  return {index, setIndex, direction, setDirection, next, previous};
}