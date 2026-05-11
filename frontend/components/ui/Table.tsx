'use client';

import { ReactNode } from 'react';
import { classNames } from '@/lib/utils/helpers';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table = ({ children, className }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={classNames(
          'w-full text-sm border-collapse',
          className
        )}
      >
        {children}
      </table>
    </div>
  );
};

interface TableHeaderProps {
  children: ReactNode;
}

export const TableHeader = ({ children }: TableHeaderProps) => {
  return (
    <thead className="bg-grey-50 border-b border-grey-200">
      {children}
    </thead>
  );
};

interface TableBodyProps {
  children: ReactNode;
}

export const TableBody = ({ children }: TableBodyProps) => {
  return (
    <tbody className="divide-y divide-grey-200">
      {children}
    </tbody>
  );
};

interface TableRowProps {
  children: ReactNode;
  hover?: boolean;
  onClick?: () => void;
}

export const TableRow = ({ children, hover = true, onClick }: TableRowProps) => {
  return (
    <tr
      className={classNames(
        'text-black',
        hover && 'hover:bg-grey-50 cursor-pointer',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: ReactNode;
  header?: boolean;
  align?: 'left' | 'center' | 'right';
}

export const TableCell = ({
  children,
  header = false,
  align = 'left',
}: TableCellProps) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  const Component = header ? 'th' : 'td';

  return (
    <Component
      className={classNames(
        'px-4 py-3',
        alignClass,
        header && 'font-semibold text-black'
      )}
    >
      {children}
    </Component>
  );
};
