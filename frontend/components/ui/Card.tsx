'use client';

import { ReactNode } from 'react';
import { classNames } from '@/lib/utils/helpers';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className, onClick }: CardProps) => {
  return (
    <div
      className={classNames(
        'bg-white border border-grey-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200',
        onClick && 'cursor-pointer hover:border-grey-400',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const CardHeader = ({ title, subtitle, action }: CardHeaderProps) => {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        {subtitle && <p className="text-sm text-grey-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody = ({ children, className }: CardBodyProps) => {
  return <div className={classNames('text-sm text-grey-800', className)}>{children}</div>;
};
