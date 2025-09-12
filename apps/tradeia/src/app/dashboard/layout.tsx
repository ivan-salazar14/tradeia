"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Sidebar from "@/components/dashboard/sidebar";
import MobileHeader from "@/components/dashboard/mobile-header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    // Only run on client side after initial render
    if (!isClient) return;

    // If we're still loading auth state, do nothing
    if (loading) {
      console.log('[DashboardLayout] Auth loading...');
      return;
    }

    console.log('[DashboardLayout] Auth state - loading:', loading, 'user:', user?.email);

    if (!user) {
      console.log('[DashboardLayout] No user found, redirecting to login');
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
      setIsRedirecting(true);
      router.replace(redirectUrl);
      return;
    }

    // Auth state is now properly synchronized - no forced reload needed

    // Onboarding redirects removed - users can access dashboard freely
  }, [user, loading, router, isClient]);

  // Show loading state while checking auth or during redirect
  if (loading || !isClient || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If there's no user but we're not loading, show nothing (redirect is in progress)
  if (!user) {
    return null;
  }

  // Render the dashboard layout
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader pathname={pathname} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}