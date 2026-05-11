'use client';

import { classNames } from '@/lib/utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = ({
  label,
  error,
  hint,
  className,
  disabled,
  ...props
}: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-black mb-2">
          {label}
        </label>
      )}
      <input
        className={classNames(
          'w-full px-4 py-2.5 border rounded-lg text-sm transition-all duration-200',
          'bg-white text-black placeholder-grey-500',
          'focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
          error ? 'border-red-500' : 'border-grey-300',
          disabled && 'bg-grey-50 cursor-not-allowed opacity-60',
          className
        )}
        disabled={disabled}
        {...props}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {hint && <p className="text-sm text-grey-600 mt-1">{hint}</p>}
    </div>
  );
};
