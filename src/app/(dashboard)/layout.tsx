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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TourProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2">
              <img src="/iconcm.svg" alt="KalConnect Logo" width="28" height="28" />
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
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TourProvider>
  );
}
