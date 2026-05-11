'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for sidebar collapse events via custom event
  useEffect(() => {
    const handler = (e: CustomEvent) => setSidebarCollapsed(e.detail.collapsed);
    window.addEventListener('sidebar-toggle' as any, handler);
    return () => window.removeEventListener('sidebar-toggle' as any, handler);
  }, []);

  const marginLeft = isMobile ? 0 : sidebarCollapsed ? 80 : 256;

  return (
    // Full viewport, no overflow at root
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <Sidebar onToggle={(c) => setSidebarCollapsed(c)} />

      {/* Main content: takes remaining width, scrolls internally */}
      <div
        className="flex flex-col flex-1 overflow-hidden transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : marginLeft }}
      >
        {/* Mobile top bar spacing */}
        {isMobile && <div className="h-14 shrink-0" />}

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
