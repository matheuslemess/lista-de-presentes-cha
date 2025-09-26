// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Dancing_Script } from "next/font/google"; // NOVO: Importa a fonte
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// NOVO: Configura a fonte Dancing Script
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dancing-script'
});

export const metadata: Metadata = {
  title: "Chá de Panela - Thainá & Noivo",
  description: "Nossa lista de presentes para o Chá de Panela",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        // NOVO: Adiciona a variável da nova fonte aqui
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} font-sans antialiased`}
      >
        <div className="relative min-h-screen">
          <div className="absolute inset-0 bg-gradient-radial from-rose-50 to-white -z-10" />
          {children}
        </div>
      </body>
    </html>
  );
}