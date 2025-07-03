import { useState, useEffect, type RefObject } from 'react';

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

export function useBackgroundDetection(elementRef: RefObject<HTMLElement>) {
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const detectBackgroundColor = () => {
      if (!elementRef.current) return;

      const headerRect = elementRef.current.getBoundingClientRect();
      const middleX = headerRect.left + headerRect.width / 2;
      const elementBelow = document.elementFromPoint(middleX, headerRect.bottom + 5);

      if (elementBelow) {
        // check if element is or contains an image
        const imgElement = elementBelow.tagName === 'IMG'
          ? elementBelow
          : elementBelow.querySelector('img');

        if (imgElement && (
          window.getComputedStyle(imgElement).objectFit === 'cover' ||
          imgElement.closest('.h-screen')
        )) {
          setIsDarkBackground(true);
          return;
        }

        // attempt to get computed background color
        let bgColor = '';
        let currentEl: Element | null = elementBelow;

        while (currentEl && !bgColor && currentEl !== document.body) {
          const style = window.getComputedStyle(currentEl);
          const bg = style.backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            bgColor = bg;
          }
          currentEl = currentEl.parentElement;
        }

        if (bgColor) {
          const rgb = bgColor.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const luminance = (0.299 * +rgb[0] + 0.587 * +rgb[1] + 0.114 * +rgb[2]) / 255;
            setIsDarkBackground(luminance < 0.5);
            return;
          }
        }
      }

      // use scroll position as fallback
      setIsDarkBackground(window.scrollY > 100);
    };

    const throttledDetect = throttle(detectBackgroundColor, 100);

    // initial check
    detectBackgroundColor();

    // add event listeners
    window.addEventListener('scroll', throttledDetect);
    window.addEventListener('load', detectBackgroundColor);

    return () => {
      window.removeEventListener('scroll', throttledDetect);
      window.removeEventListener('load', detectBackgroundColor);
    };
  }, [elementRef]);

  return isDarkBackground;
}