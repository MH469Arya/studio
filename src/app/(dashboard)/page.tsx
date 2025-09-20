import Link from 'next/link';
import { ArrowUpRight, Package, LineChart, ScrollText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoHero } from './_components/video-hero';

export default function DashboardPage() {
  const featureCards = [
    {
      title: 'Manage Orders',
      description: 'View and process your incoming orders efficiently.',
      href: '/orders',
      icon: <Package className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Analyze Sales',
      description: 'Get AI-powered insights into your sales performance.',
      href: '/sales',
      icon: <LineChart className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Create Descriptions',
      description: 'Generate compelling product descriptions with AI.',
      href: '/products',
      icon: <ScrollText className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <VideoHero />
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
                  Go to {card.title.split(' ')[1]}
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
