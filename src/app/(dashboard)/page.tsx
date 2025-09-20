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
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border shadow-sm flex flex-col justify-end p-6 md:p-8 text-white bg-black">
        <video
          src="/artisan-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />
        <div className="bg-gradient-to-t from-black/60 to-transparent absolute inset-0 -z-10"></div>
        <div>
          <h1 className="text-3xl md:text-5xl font-headline font-bold shadow-2xl">
            Welcome to KalConnect
          </h1>
          <p className="mt-2 max-w-lg text-lg text-neutral-200">
            Empowering artisans, connecting cultures. Here are your tools for success.
          </p>
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
