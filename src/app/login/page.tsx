"use client"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("[LOGIN] loading:", loading, "user:", user);
    if (!loading && user) {
      // Get redirect URL from query params if it exists, otherwise default to /dashboard
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      console.log(`[LOGIN] Usuario autenticado, redirigiendo a ${redirectTo}`);
      router.push(redirectTo);
    }
  }, [user, loading, router]);

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
  )
} 