import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { AccessibilityProvider } from "@/contexts/accessibility-context";

console.log('📜 Iniciando layout principal')

export const metadata: Metadata = {
  title: "Tradeia - Plataforma de Trading",
  description: "Plataforma de trading con señales de criptomonedas, automatización y seguimiento de rendimiento",
  keywords: "trading, criptomonedas, señales, automatización, finanzas",
  authors: [{ name: "Tradeia Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('🎨 Renderizando layout')
  
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#0066cc" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <AccessibilityProvider>
          <AuthProvider>
            <main id="main-content">
              {children}
            </main>
          </AuthProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
