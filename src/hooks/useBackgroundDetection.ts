import {type RefObject, useEffect, useRef, useState} from 'react';

// Throttle function to improve performance
const throttle = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

export function useBackgroundDetection(
  elementRef: RefObject<HTMLElement>,
  options = {samplePoints: 3, luminanceThreshold: 0.5, debug: false}
) {
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  // Use ref instead of useMemo to maintain stable reference
  const optionsRef = useRef({
    samplePoints: options.samplePoints || 3,
    luminanceThreshold: options.luminanceThreshold || 0.5,
    debug: options.debug || false
  });

  useEffect(() => {
    if (!elementRef.current) return;

    const opts = optionsRef.current;

    const detectBackgroundColor = () => {
      if (!elementRef.current) return;

      const headerRect = elementRef.current.getBoundingClientRect();
      const samplePoints = opts.samplePoints;
      let darkPointsCount = 0;

      // Sample multiple points beneath the header for better accuracy
      for (let i = 0; i < samplePoints; i++) {
        // Calculate X position for this sample (evenly distributed)
        const sampleX = headerRect.left + (headerRect.width * (i + 1)) / (samplePoints + 1);
        const elementBelow = document.elementFromPoint(sampleX, headerRect.bottom + 5);

        if (elementBelow) {
          // Get effective background color, traversing up the DOM if needed
          const effectiveColor = getEffectiveBackgroundColor(elementBelow);

          if (effectiveColor) {
            const luminance = calculateLuminance(effectiveColor);
            if (opts.debug) {
              console.log(`Sample ${i + 1}: luminance ${luminance} at x=${sampleX}`, effectiveColor);
            }

            if (luminance < opts.luminanceThreshold) {
              darkPointsCount++;
            }
          }
        }
      }

      // More than half of sample points detected as dark = dark background
      const isDark = darkPointsCount > samplePoints / 2;
      if (opts.debug) {
        console.log(`Dark points: ${darkPointsCount}/${samplePoints}, setting isDark: ${isDark}`);
      }
      setIsDarkBackground(isDark);
    };

    // Get the effective background color of an element
    const getEffectiveBackgroundColor = (element: Element): string | null => {
      let currentEl: Element | null = element;
      let effectiveColor = null;

      while (currentEl && currentEl !== document.body) {
        const style = window.getComputedStyle(currentEl);
        const backgroundColor = style.backgroundColor;

        if (backgroundColor &&
          backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          backgroundColor !== 'transparent') {
          effectiveColor = backgroundColor;
          break;
        }

        // Check background-image as well
        const backgroundImage = style.backgroundImage;
        if (backgroundImage && backgroundImage !== 'none') {
          // For background images, we'll use a dark assumption if there's an image
          return 'rgba(50, 50, 50, 1)';
        }

        currentEl = currentEl.parentElement;
      }

      // Fallback to body/html background if nothing was found
      if (!effectiveColor) {
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        if (bodyBg && bodyBg !== 'rgba(0, 0, 0, 0)' && bodyBg !== 'transparent') {
          effectiveColor = bodyBg;
        } else {
          effectiveColor = window.getComputedStyle(document.documentElement).backgroundColor;
        }
      }

      return effectiveColor;
    };

    // Calculate luminance from RGB color
    const calculateLuminance = (color: string): number => {
      const rgb = color.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        return (0.299 * +rgb[0] + 0.587 * +rgb[1] + 0.114 * +rgb[2]) / 255;
      }
      return 0.5; // Default to middle luminance if can't determine
    };

    const throttledDetect = throttle(detectBackgroundColor, 100);

    // Initial check
    detectBackgroundColor();

    // Set up regular interval check (every second)
    const intervalId = setInterval(detectBackgroundColor, 1000);

    // Add event listeners for immediate updates
    window.addEventListener('scroll', throttledDetect);
    window.addEventListener('load', detectBackgroundColor);
    window.addEventListener('resize', throttledDetect);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('scroll', throttledDetect);
      window.removeEventListener('load', detectBackgroundColor);
      window.removeEventListener('resize', throttledDetect);
    };
  }, [elementRef]); // Only elementRef as dependency

  return isDarkBackground;
}