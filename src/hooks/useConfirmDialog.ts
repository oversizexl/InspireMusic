import { useState, useCallback } from 'react';

interface UseConfirmDialogOptions {
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * Small helper to unify confirm dialog open/close flows.
 */
export const useConfirmDialog = ({ onConfirm, onCancel }: UseConfirmDialogOptions = {}) => {
  const [open, setOpen] = useState(false);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  const handleConfirm = useCallback(() => {
    onConfirm?.();
    hide();
  }, [onConfirm, hide]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    hide();
  }, [onCancel, hide]);

  return {
    open,
    show,
    hide,
    handleConfirm,
    handleCancel,
  } as const;
};
