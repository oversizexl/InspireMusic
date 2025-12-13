import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface OverlayVisibilityOptions {
  onClose: () => void;
  requestClose?: boolean;
  durationMs?: number;
}

/**
 * Shared visibility/exit-animation controller for overlays and drawers.
 * Handles initial mount animation, external close requests, and timeout cleanup.
 */
export const useOverlayVisibility = ({
  onClose,
  requestClose = false,
  durationMs = 300,
}: OverlayVisibilityOptions) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const hasRequestedCloseRef = useRef(false);

  // Play entry animation on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Clear timers on unmount
  useEffect(() => () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  }, []);

  const close = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setIsVisible(false);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      closeTimeoutRef.current = null;
      onClose();
    }, durationMs);
  }, [durationMs, isClosing, onClose]);

  // External close trigger
  // Trigger close when parent requests it; allowed to set state synchronously here
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    if (requestClose && !isClosing && !hasRequestedCloseRef.current) {
      hasRequestedCloseRef.current = true;
      close();
    }
    if (!requestClose) {
      hasRequestedCloseRef.current = false;
    }
  }, [requestClose, isClosing, close]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return { isVisible, isClosing, close } as const;
};
