'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Package, LineChart, ScrollText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from './_components/language-provider';

export default function DashboardPage() {
  const { t } = useLanguage();

  const featureCards = [
    {
      title: t('Manage Orders'),
      description: t('View and process your incoming orders efficiently.'),
      href: '/orders',
      icon: <Package className="h-6 w-6 text-primary" />,
      linkText: t('Go to Orders'),
    },
    {
      title: t('Analyze Sales'),
      description: t('Get AI-powered insights into your sales performance.'),
      href: '/sales',
      icon: <LineChart className="h-6 w-6 text-primary" />,
      linkText: t('Go to Sales'),
    },
    {
      title: t('Create Descriptions'),
      description: t('Generate compelling product descriptions with AI.'),
      href: '/products',
      icon: <ScrollText className="h-6 w-6 text-primary" />,
      linkText: t('Go to Products'),
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border shadow-sm">
        <Image
          src="/weaving.png"
          alt="Artisan weaving a colorful textile"
          fill
          className="object-cover z-0"
          priority
        />
        <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8 text-white">
          <div className="bg-black/40 p-6 rounded-lg">
            <h1 className="text-3xl md:text-5xl font-headline font-bold shadow-2xl">
              {t('Welcome to KlaConnect')}
            </h1>
            <p className="mt-2 max-w-lg text-lg text-neutral-200">
              {t('Empowering artisans, connecting cultures. Here are your tools for success.')}
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((card) => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium font-headline">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <CardDescription>{card.description}</CardDescription>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link href={card.href}>
                  {card.linkText}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
