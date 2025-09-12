"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const menu = [
  { label: "Panel de Control", path: "/dashboard", icon: "dashboard" },
  { label: "Señales", path: "/dashboard/signals", icon: "signals" },
  { label: "Estrategias", path: "/dashboard/strategies", icon: "strategies" },
  { label: "Análisis", path: "/dashboard/analysis", icon: "analysis" },
  { label: "Backtesting", path: "/dashboard/backtest", icon: "backtest" },
  { label: "Cartera", path: "/dashboard/portfolio", icon: "portfolio" },
  { label: "Gestión de Bots", path: "/dashboard/bots", icon: "bots" },
  { label: "Soporte", path: "/dashboard/support", icon: "support" },
];

const icons: Record<string, React.ReactElement> = {
  dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  ),
  signals: (
    <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
  ),
  analysis: (
    <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
  ),
  portfolio: (
    <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
  ),
  bots: (
    <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ),
  support: (
    <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  backtest: (
    <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m6 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  strategies: (
    <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  // Handle client-side mounting and path cleaning in a single effect
  useEffect(() => {
    // Set mounted state
    setIsMounted(true);
    
    // Only run path cleaning on client side
    if (pathname && pathname.includes('undefined')) {
      const cleanPath = pathname
        .split('/')
        .filter(segment => segment && segment !== 'undefined')
        .join('/') || '/';
      
      if (cleanPath !== pathname) {
        console.log(`[Sidebar] Cleaning path from ${pathname} to ${cleanPath}`);
        router.replace(cleanPath);
        return; // Prevent showing content until after redirect
      }
    }
    
    // If we get here, we can show the actual content
    setShowLoading(false);
    
    // Cleanup function
    return () => {
      setShowLoading(true);
    };
  }, [pathname, router]);

  // Show loading state until we're sure about the path
  if (!isMounted || showLoading) {
    return (
      <div className="w-16 h-screen bg-gray-800 flex flex-col items-center py-4">
        <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse mb-6"></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-gray-700 rounded-full my-2 animate-pulse"></div>
        ))}
      </div>
    );
  }

  const handleNavigation = (path: string) => {
    // Ensure the path doesn't contain any undefined segments
    const cleanPath = path.replace(/\/undefined/g, '');
    router.push(cleanPath);
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white shadow-lg">
      {/* Desktop Sidebar Header */}
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-2xl font-bold text-indigo-600">AI Trader</h1>
      </div>

      {/* Desktop Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {menu.map((item) => {
          // Clean the path for comparison to handle any undefined segments
          const cleanPathname = pathname.replace(/\/undefined/g, '');
          const cleanItemPath = item.path.replace(/\/undefined/g, '');
          const active = cleanPathname === cleanItemPath;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`nav-item flex items-center w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-150 ${active ? "active" : ""}`}
              style={active ? { backgroundColor: "#e0e7ff", color: "#4f46e5", fontWeight: 600 } : {}}
            >
              <span className="sidebar-icon mr-4">{icons[item.icon]}</span>
              <span className="mx-4">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
} 