'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HelpCircle,
  LayoutGrid,
  LineChart,
  Megaphone,
  Package,
  ShoppingBag,
  Sparkles,
  ScrollText,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutGrid,
    id: 'nav-dashboard',
  },
  {
    href: '/orders',
    label: 'Orders',
    icon: Package,
    id: 'nav-orders',
  },
  {
    href: '/my-products',
    label: 'My Products',
    icon: ShoppingBag,
    id: 'nav-my-products',
  },
  {
    label: 'AI Tools',
    icon: Sparkles,
    id: 'nav-ai-tools',
    subItems: [
      {
        href: '/products',
        label: 'Product Descriptions',
        icon: ScrollText,
      },
      {
        href: '/sales',
        label: 'Sales Insights',
        icon: LineChart,
      },
      {
        href: '/trends',
        label: 'Trending Crafts',
        icon: Sparkles,
      },
      {
        href: '/marketing',
        label: 'Marketing Coach',
        icon: Megaphone,
      },
    ],
  },
];

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col', className)}>
      <SidebarMenu>
        {menuItems.map((item) =>
          item.subItems ? (
            <SidebarMenuItem key={item.label} id={item.id}>
              <SidebarMenuButton
                isActive={item.subItems.some((sub) => pathname.startsWith(sub.href))}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                {item.subItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.href}>
                    <SidebarMenuSubButton
                      asChild
                      size="sm"
                      isActive={pathname === subItem.href}
                    >
                      <Link href={subItem.href}>
                        <subItem.icon />
                        <span>{subItem.label}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem key={item.href} id={item.id}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </nav>
  );
}
