import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'KlaConnect',
  description: 'Empowering artisans, connecting cultures.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ isolation: 'isolate' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased bg-transparent')}>
         <div
          className="fixed inset-0 -z-10 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/background.svg')",
            opacity: 0.1,
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
