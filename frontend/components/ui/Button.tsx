'use client';

import { ReactNode } from 'react';
import { classNames } from '@/lib/utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: 'bg-black text-white hover:bg-white hover:text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1',
  secondary: 'bg-white text-black hover:bg-grey-100 border-4 border-black',
  outline: 'bg-white text-black border-2 border-black hover:bg-black hover:text-white',
  ghost: 'bg-transparent text-black hover:bg-grey-100 border-2 border-transparent',
  danger: 'bg-white text-black border-4 border-black hover:bg-black hover:text-white',
};

const sizes = {
  sm: 'px-4 py-2 text-xs font-black uppercase tracking-wider',
  md: 'px-6 py-3 text-sm font-black uppercase tracking-widest',
  lg: 'px-8 py-4 text-base font-black uppercase tracking-widest',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        'rounded-none transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
