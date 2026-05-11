'use client';

import { ReactNode } from 'react';
import { classNames } from '@/lib/utils/helpers';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  default: 'bg-grey-200 text-black',
  success: 'bg-black text-white',
  warning: 'bg-white text-black border-2 border-black',
  error: 'bg-grey-500 text-white',
  info: 'bg-white text-black border border-black border-dashed',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[10px] uppercase font-black',
  md: 'px-3 py-1 text-xs uppercase font-black',
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) => {
  return (
    <span
      className={classNames(
        'inline-block rounded-none tracking-tighter',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
