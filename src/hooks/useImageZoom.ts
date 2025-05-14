import {type RefObject, useEffect, useState} from "react";
import type {MotionValue} from "motion/react";

interface UseImageZoomProps {
  isZoomed: boolean;
  setIsZoomed: (zoomed: boolean) => void;
  x: MotionValue<number>;
  y: MotionValue<number>;
  imageContainerRef: RefObject<HTMLDivElement>;
  isLoading: boolean;
}

export function useImageZoom({
  isZoomed,
  setIsZoomed,
  x,
  y,
  imageContainerRef,
  isLoading,
}: UseImageZoomProps) {
  const [showDragHint, setShowDragHint] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  // Update viewport size on mount and resize
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateViewportSize);
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

  // Show drag hint when first zooming in
  useEffect(() => {
    if (isZoomed) {
      setShowDragHint(true);
      const timer = setTimeout(() => {
        setShowDragHint(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isZoomed]);

  // Calculate drag constraints when image is loaded and zoomed
  useEffect(() => {
    if (isZoomed && imageContainerRef.current && !isLoading) {
      const recalculateConstraints = () => {
        const imageEl = imageContainerRef.current?.querySelector("img");
        if (imageEl) {
          const rect = imageEl.getBoundingClientRect();
          // When zoomed, the scale-200 class doubles the size
          const zoomedWidth = rect.width * (isZoomed ? 2 : 1);
          const zoomedHeight = rect.height * (isZoomed ? 2 : 1);

          const xConstraint = Math.max(0, (zoomedWidth - viewportSize.width) / 2);
          const yConstraint = Math.max(0, (zoomedHeight - viewportSize.height) / 2);

          setDragConstraints({
            top: -yConstraint,
            right: xConstraint,
            bottom: yConstraint,
            left: -xConstraint,
          });
        }
      };

      // Add small delay to ensure dimensions are correct after zoom animation
      const timer = setTimeout(recalculateConstraints, 50);
      return () => clearTimeout(timer);
    }
  }, [isZoomed, isLoading, viewportSize, imageContainerRef]);

  // Reset position when unzooming
  useEffect(() => {
    if (!isZoomed) {
      x.set(0);
      y.set(0);
    }
  }, [isZoomed, x, y]);

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  const handleDragStart = () => {
    if (isZoomed) {
      setIsDragging(true);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return {
    isDragging,
    showDragHint,
    dragConstraints,
    toggleZoom,
    handleDragStart,
    handleDragEnd,
  };
}