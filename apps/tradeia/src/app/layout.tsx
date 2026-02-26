import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
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
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NLNRVF2BZ4"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NLNRVF2BZ4');
            `,
          }}
        />
      </head>
      <body className="bg-secondary text-textdark font-inter">
        <AuthProvider>
          {children}
            <SpeedInsights />
            <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
