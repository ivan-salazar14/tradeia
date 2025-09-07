import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { SpeedInsights } from "@vercel/speed-insights/next"
console.log('📜 Iniciando layout principal')

export const metadata: Metadata = {
  title: "Tradeia",
  description: "Trading Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('🎨 Renderizando layout')
  
  return (
    <html lang="es">
      <body className="bg-secondary text-textdark font-inter">
        <AuthProvider>
          {children}
           <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}
