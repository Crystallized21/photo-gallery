export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? "100%" : "-100%",
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? "-100%" : "100%",
    transition: {
      duration: 0.4,
      ease: "easeIn"
    },
  }),
}

export const dragHintVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

export const buttonAnimations = {
  close: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.2, duration: 0.3 },
  },
  prevNext: {
    initial: (isLeft: boolean) => ({ opacity: 0, x: isLeft ? -20 : 20 }),
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.3, duration: 0.3 },
  },
  caption: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.4, duration: 0.3 },
  },
};