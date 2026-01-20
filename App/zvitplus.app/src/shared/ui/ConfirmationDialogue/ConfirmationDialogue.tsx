// ConfirmationDialog.tsx
import React from 'react';
import cl from './ConfirmationDialogue.module.css';

interface ConfirmationDialogueProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialogue({
  isOpen,
  title,
  message,
  confirmText = 'Підтвердити',
  cancelText = 'Скасувати',
  variant = 'info',
  onConfirm,
  onCancel
}: ConfirmationDialogueProps) {
  if (!isOpen) return null;

  return (
    <div className={cl.Overlay}>
      <div className={`${cl.Dialog} ${cl[variant]}`}>
        <div className={cl.Header}>
          <h3>{title}</h3>
        </div>
        <div className={cl.Body}>
          <p>{message}</p>
        </div>
        <div className={cl.Footer}>
          <button 
            className={cl.CancelButton}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={cl.ConfirmButton}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}