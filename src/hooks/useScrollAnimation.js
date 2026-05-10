import { useRef } from 'react';

// Animations fully disabled — all hooks are no-ops

export const useScrollAnimation = (_animationType, _config) => {
  const elementRef = useRef(null);
  return { ref: elementRef, show: () => {}, hide: () => {}, reset: () => {}, getState: () => null };
};

export const useMultipleScrollAnimations = (count = 0) => {
  const refs = useRef([]);
  return { refs, showAll: () => {}, hideAll: () => {}, resetAll: () => {}, getStates: () => [] };
};

export const useBatchScrollAnimations = () => {
  return { trigger: () => {}, reset: () => {}, getState: () => null };
};
