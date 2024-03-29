import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/context/theme-provider';
import ProgressBar from '@/components/progress-bar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PWA with Next 13',
  description: 'PWA application with Next 13',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'nextjs13', 'next13', 'pwa', 'next-pwa'],
};

export const viewport: Viewport = {
  themeColor: '#2196f3',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="fr">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster />
            <ProgressBar />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
