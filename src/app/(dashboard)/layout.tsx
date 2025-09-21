import * as React from 'react';
import Link from 'next/link';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { MainNav } from './_components/main-nav';
import { Header } from './_components/header';
import { TourProvider } from './_components/tour-provider';
import { LanguageProvider } from './_components/language-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <TourProvider>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/assets/iconcm.svg"
                  alt="KalConnect Logo"
                  style={{ height: '40px', width: '40px', marginRight: '8px' }}
                />
                <span className="text-xl font-bold font-headline tracking-tight">
                  KalConnect
                </span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <div
              className="relative flex min-h-screen flex-col"
              style={{
                backgroundImage: "url('/background.svg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
              }}
            >
              <div className="relative z-10 flex min-h-screen flex-col bg-background/80 backdrop-blur-sm">
                <Header />
                <div className="flex-1">{children}</div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TourProvider>
    </LanguageProvider>
  );
}
