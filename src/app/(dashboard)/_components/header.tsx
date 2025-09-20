import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from './user-nav';
import { KalGuide } from './kal-guide';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex items-center gap-2 md:hidden">
          <img src="/iconcm.svg" alt="KalConnect Logo" width="28" height="28" />
           <span className="font-bold text-xl font-headline">
            KalConnect
          </span>
        </Link>
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <KalGuide />
        <UserNav />
      </div>
    </header>
  );
}
