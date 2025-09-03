"use client"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"

function LoginPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    console.log("[LOGIN] Auth state - loading:", loading, "user:", user?.email);
    
    if (loading) {
      console.log("[LOGIN] Still loading auth state...");
      return;
    }

    if (user) {
      console.log(`[LOGIN] User authenticated, preparing redirect to ${redirectTo}`);
      
      // Small delay to ensure all auth state is properly set
      const timer = setTimeout(() => {
        console.log('[LOGIN] Executing redirect to:', redirectTo);
        
        // Create a promise to handle the navigation
        const handleNavigation = async () => {
          try {
            await router.replace(redirectTo);
            // If we get here but still on login page, force reload
            if (window.location.pathname === '/login') {
              console.log('[LOGIN] Client-side navigation failed, forcing full page reload');
              window.location.href = redirectTo;
            }
          } catch (error: unknown) {
            console.error('[LOGIN] Error during navigation:', error);
            window.location.href = redirectTo;
          }
        };
        
        void handleNavigation();
      }, 200);
      
      return () => clearTimeout(timer);
    } else {
      console.log('[LOGIN] No user found, showing login form');
    }
  }, [user, loading, router, redirectTo]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bienvenido a Tradeia
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Inicia sesión para acceder a tu dashboard personalizado
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes cuenta?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}