import { Variants } from 'framer-motion';

/**
 * Curva de aceleração cúbica 'ease-out-expo'.
 * Proporciona uma desaceleração ultra suave e dinâmica com impacto visual premium.
 */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Variante do container que orquestra a entrada escalonada (stagger) dos cartões de indicadores.
 */
export const indicatorContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

/**
 * Variante individual para os cartões de indicadores no dashboard,
 * utilizando a transição com a curva 'ease-out-expo'.
 */
export const indicatorCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: EASE_OUT_EXPO,
    },
  },
};

/**
 * Variante para barras de progresso internas dos indicadores.
 */
export const indicatorProgressVariants = (targetPercent: string | number): Variants => ({
  hidden: {
    width: 0,
  },
  visible: {
    width: typeof targetPercent === 'number' ? `${targetPercent}%` : targetPercent,
    transition: {
      duration: 0.9,
      ease: EASE_OUT_EXPO,
      delay: 0.2,
    },
  },
});
