'use client';

import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="h-screen overflow-hidden bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md overflow-y-auto max-h-screen py-4">
        {children}
      </div>
    </div>
  );
};
