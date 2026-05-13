'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Building2,
  Users,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { adminAPI } from '@/lib/api/endpoints';

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

export const Sidebar = ({ onToggle }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Brands', href: '/dashboard/brands', icon: <Building2 size={18} /> },
    { label: 'Influencers', href: '/dashboard/influencers', icon: <Sparkles size={18} /> },
    { label: 'Users', href: '/dashboard/users', icon: <Users size={18} /> },
  ];

  const internNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Brands', href: '/dashboard/brands', icon: <Building2 size={18} /> },
    { label: 'Influencers', href: '/dashboard/influencers', icon: <Sparkles size={18} /> },
    { label: 'My Work', href: '/dashboard/work', icon: <CheckSquare size={18} /> },
  ];

  const dataEntryNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Brands', href: '/dashboard/brands', icon: <Building2 size={18} /> },
    { label: 'Influencers', href: '/dashboard/influencers', icon: <Sparkles size={18} /> },
    { label: 'Upload Data', href: '/dashboard/upload', icon: <Upload size={18} /> },
  ];

  const navItems = user?.role === 'ADMIN' ? adminNavItems
    : user?.role === 'DATA_ENTRY' ? dataEntryNavItems
      : internNavItems;

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
        onToggle?.(true);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggle = useCallback(() => {
    const next = !collapsed;
    setCollapsed(next);
    onToggle?.(next);
    // Also fire global event for layout sync
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { collapsed: next } }));
  }, [collapsed, onToggle]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const NavItem = ({ item }: { item: { label: string; href: string; icon: JSX.Element; badge?: number | null } }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        onClick={() => isMobile && setMobileOpen(false)}
        title={collapsed && !isMobile ? item.label : ''}
        className={`flex items-center gap-3 px-3 py-2.5 border-2 transition-all duration-150 font-bold uppercase text-[10px] tracking-widest group ${isActive
          ? 'bg-black text-white border-black'
          : 'text-black border-transparent hover:border-black hover:bg-grey-50'
          } ${collapsed && !isMobile ? 'justify-center' : ''}`}
      >
        <span className="shrink-0">{item.icon}</span>
        {(!collapsed || isMobile) && <span className="truncate flex-1">{item.label}</span>}
        {item.badge && (!collapsed || isMobile) && (
          <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-none font-black animate-pulse">
            {item.badge}
          </span>
        )}
        {item.badge && collapsed && !isMobile && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        )}
      </Link>
    );
  };

  const SidebarBody = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-14 border-b-4 border-black flex items-center justify-between px-4 shrink-0 bg-black text-white">
        {(!collapsed || isMobile) && (
          <h1 className="text-xl font-black tracking-tighter">PORTA</h1>
        )}
        <button
          onClick={isMobile ? () => setMobileOpen(false) : toggle}
          className={`p-1.5 hover:bg-white/20 transition-colors rounded-none ${collapsed && !isMobile ? 'mx-auto' : ''}`}
        >
          {isMobile ? <X size={18} /> : collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
        {navItems.map(item => <NavItem key={item.href} item={item} />)}
      </nav>

      {/* User footer */}
      <div className="border-t-4 border-black p-3 shrink-0 bg-grey-50">
        {(!collapsed || isMobile) ? (
          <div className="space-y-2">
            <div className="border-2 border-black p-2 bg-white">
              <p className="text-[9px] text-grey-500 uppercase font-black tracking-wider">{user?.role}</p>
              <p className="text-xs font-black text-black truncate">{user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 border-2 border-black py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 border-2 border-black hover:bg-black hover:text-white transition-all"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-3 left-3 z-50 p-2.5 bg-black text-white border-2 border-white"
        >
          <Menu size={18} />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen border-r-4 border-black z-50 overflow-hidden transition-all duration-300 ${isMobile
          ? mobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
          : collapsed ? 'w-20' : 'w-64'
          }`}
      >
        <SidebarBody />
      </div>
    </>
  );
};
