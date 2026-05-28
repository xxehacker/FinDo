/** Shared Framer Motion presets for neobrutalist interactions */

export const pressTransition = { type: "spring", stiffness: 500, damping: 30 };

export const buttonMotion = {
  whileHover: { x: -2, y: -2, scale: 1.02 },
  whileTap: { x: 2, y: 2, scale: 0.98 },
  transition: pressTransition,
};

export const cardMotion = {
  whileHover: { y: -4, rotate: -0.5 },
  transition: { type: "spring", stiffness: 400, damping: 25 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};
