'use client';

import { useState, useEffect } from 'react';
import { classNames } from '@/lib/utils/helpers';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export const Toast = ({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-100 text-green-700 border-green-300',
    error: 'bg-red-100 text-red-700 border-red-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  };

  return (
    <div
      className={classNames(
        'fixed bottom-4 right-4 px-4 py-3 rounded-lg border max-w-sm animate-pulse',
        typeStyles[type]
      )}
    >
      {message}
    </div>
  );
};
