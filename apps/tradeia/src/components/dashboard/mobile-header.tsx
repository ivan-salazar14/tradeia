"use client";

import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const menu = [
  { label: "Panel de Control", path: "/dashboard", icon: "dashboard" },
  { label: "Señales", path: "/dashboard/signals", icon: "signals" },
  { label: "Pools de Liquidez", path: "/dashboard/pools", icon: "pools" },
  { label: "Estrategias", path: "/dashboard/strategies", icon: "strategies" },
  { label: "Análisis", path: "/dashboard/analysis", icon: "analysis" },
  { label: "Backtesting", path: "/dashboard/backtest", icon: "backtest" },
  { label: "Cartera", path: "/dashboard/portfolio", icon: "portfolio" },
  { label: "Gestión de Bots", path: "/dashboard/bots", icon: "bots" },
  { label: "Soporte", path: "/dashboard/support", icon: "support" },
];

const getPageTitle = (pathname: string): string => {
  const cleanPath = pathname.replace(/\/undefined/g, '');
  const menuItem = menu.find(item => item.path === cleanPath);
  return menuItem ? menuItem.label : "AI Trader";
};

interface MobileHeaderProps {
  pathname: string;
  sidebarVisible?: boolean;
  onToggleSidebar?: () => void;
}

export default function MobileHeader({ pathname, sidebarVisible = true, onToggleSidebar }: MobileHeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      router.push("/login");
    }
  };

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <div className="flex items-center">
          {/* Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title={sidebarVisible ? "Ocultar menú" : "Mostrar menú"}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {sidebarVisible ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold text-indigo-600 ml-3">{getPageTitle(pathname)}</h1>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-gray-500 text-lg">🔔</span>
          <div className="text-sm font-medium text-gray-700 truncate max-w-32">
            {user?.email?.split('@')[0]}
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="text-xs">
            Salir
          </Button>
        </div>
      </header>
    </>
  );
}
