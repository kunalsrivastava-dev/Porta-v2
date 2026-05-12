'use client';
 
import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="transition-transform hover:scale-105">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6 bg-black rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden group">
               <Image 
                src="/logo.png" 
                alt="PORTA Logo" 
                fill
                className="object-contain p-2 transition-transform group-hover:scale-110"
                priority
               />
               <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Portal <span className="text-grey-400">V2</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-grey-500 font-medium max-w-xs">
            Enterprise workflow & operations orchestrator.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-grey-100 to-grey-200 rounded-2xl blur opacity-25" />
          <div className="relative">
            {children}
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-grey-400 font-mono tracking-widest uppercase">
            Secured by PORTA-ENT-SEC v2.4
          </p>
        </div>
      </div>
    </div>
  );
};
