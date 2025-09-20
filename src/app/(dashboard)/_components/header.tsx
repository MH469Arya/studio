import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from './user-nav';
import { Logo } from '@/components/logo';
import { KalGuide } from './kal-guide';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="hidden font-bold md:block text-xl font-headline">
          KalConnect
        </Link>
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <KalGuide />
        <UserNav />
      </div>
    </header>
  );
}
