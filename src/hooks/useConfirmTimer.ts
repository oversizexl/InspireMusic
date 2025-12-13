import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Simple confirm-then-execute helper with auto-reset timer.
 * Returns `confirming` state and `requestConfirm` which toggles and
 * tells caller whether action should proceed.
 */
export function useConfirmTimer(durationMs = 3000) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setConfirming(false);
  }, [clearTimer]);

  const requestConfirm = useCallback(() => {
    if (confirming) {
      reset();
      return true;
    }
    setConfirming(true);
    clearTimer();
    timerRef.current = setTimeout(() => {
      setConfirming(false);
      timerRef.current = null;
    }, durationMs);
    return false;
  }, [clearTimer, confirming, durationMs, reset]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return { confirming, requestConfirm, reset };
}
