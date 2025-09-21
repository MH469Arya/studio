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
                  alt="KlaConnect Logo"
                  style={{ height: '40px', width: '40px', marginRight: '8px' }}
                />
                <span className="text-xl font-bold font-headline tracking-tight">
                  KlaConnect
                </span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <div
              className="relative flex min-h-screen flex-col bg-grid-pattern bg-background bg-opacity-10"
            >
              <Header />
              <div className="flex-1">{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TourProvider>
    </LanguageProvider>
  );
}
